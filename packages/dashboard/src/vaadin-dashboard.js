/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-dashboard-widget.js';
import './vaadin-dashboard-section.js';
import { css, html, LitElement, render } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { DashboardLayoutMixin } from './vaadin-dashboard-layout-mixin.js';

const widgetClass = customElements.get('vaadin-dashboard-widget');

/**
 * Dashboard element
 *
 * @fires {CustomEvent} dashboard-dragend - Fired when dragging of a widget ends.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ResizeMixin
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
class Dashboard extends DashboardLayoutMixin(ElementMixin(ThemableMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-dashboard';
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host([dragging-widget]) vaadin-dashboard-section {
          outline: 3px dashed gray;
          outline-offset: 3px;
        }
      `,
    ];
  }

  static get properties() {
    return {
      // TODO: rename?
      items: {
        type: Object,
        notify: true,
        observer: '__itemsChanged',
      },

      dense: {
        type: Boolean,
        reflectToAttribute: true,
      },

      __widgetCount: {
        type: Number,
      },
    };
  }

  /** @protected */
  render() {
    return html`<slot></slot>`;
  }

  ready() {
    super.ready();

    this.addEventListener('dragstart', (event) => {
      const composedPath = event.composedPath();

      // TODO: Rather use track gesture for resizing
      const resizer = composedPath.find((node) => node.classList && node.classList.contains('resizer'));
      if (resizer) {
        const transparentImage = new Image();
        transparentImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
        event.dataTransfer.setDragImage(transparentImage, 0, 0);

        this.__resizedWidget = event.target;
        this.__resizeStartX = event.clientX;
        this.__resizeStartY = event.clientY;
      } else {
        requestAnimationFrame(() => {
          this.toggleAttribute('dragging-widget', true);
          event.target.toggleAttribute('dragging', true);
        });
        this.__draggedWidget = event.target;
      }
    });

    this.addEventListener('dragover', (event) => {
      if (this.__draggedWidget) {
        this.__onReorderDragover(event);
      } else if (this.__resizedWidget) {
        this.__onResizeDragover(event);
      }
    });

    this.addEventListener('dragend', () => {
      if (this.__draggedWidget) {
        this.__draggedWidget.removeAttribute('dragging');
        this.dispatchEvent(
          new CustomEvent('dashboard-dragend', {
            bubbles: true,
            composed: true,
            detail: { items: this.items },
          }),
        );
      }
      this.__draggedWidget = null;
      this.__resizedWidget = null;
      this.__resizeStartX = null;
      this.__resizeStartY = null;
      this.toggleAttribute('dragging-widget', false);
    });
  }

  __itemsChanged() {
    render(this.__renderItems(this.items || []), this);
  }

  __renderItems(items) {
    return items.map((item) => {
      if (item.section) {
        return html`<vaadin-dashboard-section .title="${item.title}">
          ${this.__renderItems(item.section)}
        </vaadin-dashboard-section>`;
      }
      return html`<vaadin-dashboard-widget
        id="${item.id}"
        title="${item.title}"
        colspan="${item.colspan}"
        rowspan="${item.rowspan}"
        style="view-transition-name: vaadin-dashboard-widget-transition-${item.id}"
      ></vaadin-dashboard-widget>`;
    });
  }

  __onReorderDragover(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';

    const targetWidget = event.target;
    if (targetWidget instanceof widgetClass === false) {
      return;
    }

    // TODO: support dragging inside sections
    const targetWidgetIndex = this.items.findIndex((item) => item.id === targetWidget.id);
    const draggedWidgetIndex = this.items.findIndex((item) => item.id === this.__draggedWidget.id);

    if (targetWidgetIndex < 0 || targetWidgetIndex === draggedWidgetIndex) {
      return;
    }

    const draggedPos = this.__draggedWidget.getBoundingClientRect();
    const targetPos = targetWidget.getBoundingClientRect();
    let overThreshold = false;
    if (draggedPos.top > targetPos.bottom) {
      // target is on a row above the dragged widget
      overThreshold = event.clientY < targetPos.top + targetPos.height / 2;
    } else if (draggedPos.bottom < targetPos.top) {
      // target is on a row below the dragged widget
      overThreshold = event.clientY > targetPos.top + targetPos.height / 2;
    } else if (draggedPos.left > targetPos.right) {
      // target is on a column to the left of the dragged widget
      overThreshold = event.clientX < targetPos.left + targetPos.width / 2;
    } else if (draggedPos.right < targetPos.left) {
      // target is on a column to the right of the dragged widget
      overThreshold = event.clientX > targetPos.left + targetPos.width / 2;
    }

    if (overThreshold && !this.__swappingOrders) {
      this.__swappingOrders = true;
      setTimeout(() => {
        this.__swappingOrders = false;
      }, 300);

      // Swap the order of the dragged widget and the target widget
      this.__startViewTransition(() => {
        // TODO: Don't just swap the widgets' orders
        const items = [...this.items];
        const draggedItem = items.splice(draggedWidgetIndex, 1)[0];
        items.splice(targetWidgetIndex, 0, draggedItem);
        this.items = items;
      });
    }
  }

  __startViewTransition(callback) {
    if (document.startViewTransition) {
      document.startViewTransition(callback);
    } else {
      callback();
    }
  }

  __onResizeDragover(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    // TODO: support resizing inside sections
    const resizedItem = this.items.find((item) => item.id === this.__resizedWidget.id);

    const deltaX = event.clientX - this.__resizeStartX;
    const deltaY = event.clientY - this.__resizeStartY;

    const columnWidth = parseFloat(getComputedStyle(this).gridTemplateColumns.split(' ')[0]);

    let colspanDelta = 0;
    if (deltaX > columnWidth / 2) {
      colspanDelta = 1;
      this.__resizeStartX += columnWidth;
    } else if (deltaX < -columnWidth / 2) {
      if (resizedItem.colspan > 1) {
        colspanDelta = -1;
        this.__resizeStartX -= columnWidth;
      }
    }

    // TODO: There's no way to detect row height when dynamic row height is used
    const rowHeight = parseFloat(getComputedStyle(this).getPropertyValue('--_dashboard-row-height'));
    let rowspanDelta = 0;
    if (deltaY > rowHeight / 2) {
      rowspanDelta = 1;
      this.__resizeStartY += rowHeight;
    } else if (deltaY < -rowHeight / 2) {
      if (resizedItem.rowspan > 1) {
        rowspanDelta = -1;
        this.__resizeStartY -= rowHeight;
      }
    }

    if (colspanDelta || rowspanDelta) {
      this.__resizedWidget.style.viewTransitionName = '';
      this.__startViewTransition(() => {
        // TODO: Don't animate the resized widget, only the others
        Object.assign(resizedItem, {
          colspan: (resizedItem.colspan || 1) + colspanDelta,
          rowspan: (resizedItem.rowspan || 1) + rowspanDelta,
        });
        this.items = [...this.items];
      });
    }
  }

  /**
   * Fired when the dragging of a widget ends.
   *
   * @event dashboard-dragend
   * @param {Object} originalEvent The native dragend event
   */
}

defineCustomElement(Dashboard);

export { Dashboard };
