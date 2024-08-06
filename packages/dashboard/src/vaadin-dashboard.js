/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-dashboard-widget.js';
import './vaadin-dashboard-layout.js';
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';
import { generateUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

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
class Dashboard extends ResizeMixin(ElementMixin(ThemableMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-dashboard';
  }

  static get properties() {
    return {
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
    return html`<vaadin-dashboard-layout
      >${Array.from({ length: this.__widgetCount }).map(
        (_, index) => html`<slot name="widget-${index}"></slot></vaadin-dashboard-layout>`,
      )}</vaadin-dashboard-layout
    >`;
  }

  ready() {
    super.ready();
    this.__updateColumnCount();

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
        this.dispatchEvent(new CustomEvent('dashboard-dragend', { bubbles: true, composed: true }));
      }
      this.__draggedWidget = null;
      this.__resizedWidget = null;
      this.__resizeStartX = null;
      this.__resizeStartY = null;
    });

    this.__childWidgetsChanged();
    new MutationObserver(() => this.__childWidgetsChanged()).observe(this, { childList: true });
  }

  __childWidgetsChanged() {
    const widgets = [...this.children]
      .filter((child) => child instanceof widgetClass)
      .sort(
        (a, b) =>
          (a.order !== undefined ? a.order : Number.MAX_SAFE_INTEGER) -
          (b.order !== undefined ? b.order : Number.MAX_SAFE_INTEGER),
      );

    widgets.forEach((child, index) => {
      child.order = index;
      // eslint-disable-next-line logical-assignment-operators
      child.colspan = child.colspan || 1;
      // eslint-disable-next-line logical-assignment-operators
      child.rowspan = child.rowspan || 1;
      // TODO: Add view transition names dynamically when needed
      child.style.viewTransitionName = `widget-${generateUniqueId()}`;
    });

    this.__widgetCount = widgets.length;
  }

  __onReorderDragover(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';

    const targetWidget = event.target;
    if (targetWidget instanceof widgetClass === false) {
      return;
    }
    if (targetWidget.order === this.__draggedWidget.order) {
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
        [targetWidget.order, this.__draggedWidget.order] = [this.__draggedWidget.order, targetWidget.order];
        this.dispatchEvent(new CustomEvent('layout-changed', { bubbles: true, composed: true }));
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

    const deltaX = event.clientX - this.__resizeStartX;
    const deltaY = event.clientY - this.__resizeStartY;

    const gridWidth = this.getBoundingClientRect().width;
    const columnCount = getComputedStyle(this).gridTemplateColumns.split(' ').length;
    const maxColumnWidth =
      parseFloat(getComputedStyle(this).getPropertyValue('--max-col-width')) || gridWidth / columnCount;
    const columnWidth = Math.min(gridWidth / columnCount, maxColumnWidth);

    let colspanDelta = 0;
    if (deltaX > columnWidth / 2) {
      colspanDelta = 1;
      this.__resizeStartX += columnWidth;
    } else if (deltaX < -columnWidth / 2) {
      if (this.__resizedWidget.colspan > 1) {
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
      if (this.__resizedWidget.rowspan > 1) {
        rowspanDelta = -1;
        this.__resizeStartY -= rowHeight;
      }
    }

    if (colspanDelta || rowspanDelta) {
      this.__startViewTransition(() => {
        // TODO: Don't animate the resized widget, only the others
        Object.assign(this.__resizedWidget, {
          colspan: (this.__resizedWidget.colspan || 1) + colspanDelta,
          rowspan: (this.__resizedWidget.rowspan || 1) + rowspanDelta,
        });

        this.dispatchEvent(new CustomEvent('layout-changed', { bubbles: true, composed: true }));
      });
    }
  }

  /**
   * @protected
   * @override
   */
  _onResize() {
    this.__updateColumnCount();
  }

  __updateColumnCount() {
    const width = this.offsetWidth;
    const minColWidth = getComputedStyle(this).getPropertyValue('--min-col-width');
    const defaultMinColWidth = getComputedStyle(this).getPropertyValue('--_dashboard-default-min-col-width');

    // TODO: Pixels assumed
    const minColWidthPx = parseInt(minColWidth) || parseInt(defaultMinColWidth);
    const colCount = Math.floor(width / minColWidthPx);

    this.style.setProperty('--_dashboard-column-count', colCount);
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
