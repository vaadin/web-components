/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import './vaadin-dashboard-widget.js';
import './vaadin-dashboard-section.js';
import { html, LitElement, render } from 'lit';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { css, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { getElementItem, getItemsArrayOfItem } from './vaadin-dashboard-helpers.js';
import { DashboardLayoutMixin } from './vaadin-dashboard-layout-mixin.js';
import { hasWidgetWrappers } from './vaadin-dashboard-styles.js';
import { WidgetReorderController } from './widget-reorder-controller.js';
import { WidgetResizeController } from './widget-resize-controller.js';

/**
 * A responsive, grid-based dashboard layout component
 *
 * @fires {CustomEvent} dashboard-item-drag-reorder - Fired when an items will be reordered by dragging
 * @fires {CustomEvent} dashboard-item-reorder-start - Fired when item reordering starts
 * @fires {CustomEvent} dashboard-item-reorder-end - Fired when item reordering ends
 * @fires {CustomEvent} dashboard-item-drag-resize - Fired when an item will be resized by dragging
 * @fires {CustomEvent} dashboard-item-resize-start - Fired when item resizing starts
 * @fires {CustomEvent} dashboard-item-resize-end - Fired when item resizing ends
 * @fires {CustomEvent} dashboard-item-removed - Fired when an item is removed
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes DashboardLayoutMixin
 * @mixes ThemableMixin
 */
class Dashboard extends ControllerMixin(DashboardLayoutMixin(ElementMixin(ThemableMixin(PolylitMixin(LitElement))))) {
  static get is() {
    return 'vaadin-dashboard';
  }

  static get cvdlName() {
    return 'vaadin-dashboard';
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host([editable]) {
          --_vaadin-dashboard-widget-actions-display: block;
        }

        #grid[resizing] {
          -webkit-user-select: none;
          user-select: none;
        }
      `,
      hasWidgetWrappers,
    ];
  }

  static get properties() {
    return {
      /**
       * An array containing the items of the dashboard
       * @type {!Array<!DashboardItem> | null | undefined}
       */
      items: {
        type: Array,
      },

      /**
       * Custom function for rendering a widget for each dashboard item.
       * Placing something else than a widget in the cell is not supported.
       * Receives three arguments:
       *
       * - `root` The container for the widget.
       * - `dashboard` The reference to the `<vaadin-dashboard>` element.
       * - `model` The object with the properties related with the rendered
       *   item, contains:
       *   - `model.item` The item.
       *
       * @type {DashboardRenderer | null | undefined}
       */
      renderer: {
        type: Function,
      },

      /**
       * Whether the dashboard is editable.
       */
      editable: {
        type: Boolean,
        reflectToAttribute: true,
      },
    };
  }

  static get observers() {
    return ['__itemsOrRendererChanged(items, renderer)'];
  }

  constructor() {
    super();
    this.__widgetReorderController = new WidgetReorderController(this);
    this.__widgetResizeController = new WidgetResizeController(this);
    this.addEventListener('item-remove', (e) => this.__itemRemove(e));
  }

  /** @protected */
  ready() {
    super.ready();
    this.addController(this.__widgetReorderController);
    this.addController(this.__widgetResizeController);
  }

  /** @protected */
  render() {
    return html`<div id="grid"><slot></slot></div>`;
  }

  /** @private */
  __itemsOrRendererChanged(items, renderer) {
    render(this.__renderItemCells(items || []), this);

    this.querySelectorAll('vaadin-dashboard-widget-wrapper').forEach((cell) => {
      if (cell.firstElementChild && cell.firstElementChild.localName === 'vaadin-dashboard-section') {
        return;
      }
      if (cell.__item.component instanceof HTMLElement) {
        if (cell.__item.component.parentElement !== cell) {
          cell.textContent = '';
          cell.appendChild(cell.__item.component);
        }
      } else if (renderer) {
        renderer(cell, this, { item: cell.__item });
      } else {
        cell.innerHTML = '';
      }
    });
  }

  /** @private */
  __renderItemCells(items) {
    return items.map((item) => {
      const itemDragged = this.__widgetReorderController.draggedItem === item;
      const style = `
        ${item.colspan ? `--vaadin-dashboard-item-colspan: ${item.colspan};` : ''}
        ${item.rowspan ? `--vaadin-dashboard-item-rowspan: ${item.rowspan};` : ''}
        ${itemDragged ? '--_vaadin-dashboard-item-placeholder-display: block;' : ''}
      `.trim();

      if (item.items) {
        const itemHasComponent = item.component instanceof HTMLElement;
        if (itemHasComponent) {
          render(this.__renderItemCells(item.items), item.component);
        }

        return html`<vaadin-dashboard-widget-wrapper .__item="${item}" style="${style}">
          ${itemHasComponent
            ? item.component
            : html` <vaadin-dashboard-section
                .sectionTitle="${item.title}"
                ?highlight="${this.__widgetReorderController.draggedItem}"
              >
                ${this.__renderItemCells(item.items)}
              </vaadin-dashboard-section>`}
        </vaadin-dashboard-widget-wrapper>`;
      }

      return html`<vaadin-dashboard-widget-wrapper .__item="${item}" style="${style}">
      </vaadin-dashboard-widget-wrapper>`;
    });
  }

  /** @private */
  __itemRemove(e) {
    e.stopImmediatePropagation();
    const item = getElementItem(e.target);
    const items = getItemsArrayOfItem(item, this.items);
    items.splice(items.indexOf(item), 1);
    this.items = [...this.items];
    this.dispatchEvent(
      new CustomEvent('dashboard-item-removed', { cancelable: true, detail: { item, items: this.items } }),
    );
  }

  /**
   * Fired when item reordering starts
   *
   * @event dashboard-item-reorder-start
   */

  /**
   * Fired when item reordering ends
   *
   * @event dashboard-item-reorder-end
   */

  /**
   * Fired when an items will be reordered by dragging
   *
   * @event dashboard-item-drag-reorder
   */

  /**
   * Fired when item resizing starts
   *
   * @event dashboard-item-resize-start
   */

  /**
   * Fired when item resizing ends
   *
   * @event dashboard-item-resize-end
   */

  /**
   * Fired when an item will be resized by dragging
   *
   * @event dashboard-item-drag-resize
   */

  /**
   * Fired when an item is removed
   *
   * @event dashboard-item-removed
   */
}

defineCustomElement(Dashboard);

export { Dashboard };
