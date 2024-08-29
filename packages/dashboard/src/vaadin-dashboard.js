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
import { DashboardLayoutMixin } from './vaadin-dashboard-layout-mixin.js';
import { hasWidgetWrappers } from './vaadin-dashboard-styles.js';
import { WidgetReorderController } from './widget-reorder-controller.js';

/**
 * A responsive, grid-based dashboard layout component
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
          --_vaadin-dashboard-widget-actions-visibility: visible;
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
  }

  /** @protected */
  ready() {
    super.ready();
    this.addController(this.__widgetReorderController);
  }

  /** @protected */
  render() {
    return html`<slot></slot>`;
  }

  /** @private */
  __itemsOrRendererChanged(items, renderer) {
    render(this.__renderItemCells(items || []), this);

    this.querySelectorAll('vaadin-dashboard-widget-wrapper').forEach((cell) => {
      if (cell.firstElementChild && cell.firstElementChild.localName === 'vaadin-dashboard-section') {
        return;
      }
      if (renderer) {
        renderer(cell, this, { item: cell.__item });
      } else {
        cell.innerHTML = '';
      }
    });
  }

  /** @private */
  __renderItemCells(items) {
    return items.map((item) => {
      const placeholderDisplay = this.__widgetReorderController.draggedItem === item ? 'block' : 'none';
      const style = `--vaadin-dashboard-item-colspan: ${item.colspan}; --_vaadin-dashboard-item-placeholder-display: ${placeholderDisplay};`;

      if (item.items) {
        return html`<vaadin-dashboard-widget-wrapper .__item="${item}" style="${style}">
          <vaadin-dashboard-section
            .sectionTitle="${item.title}"
            ?highlight="${this.__widgetReorderController.draggedItem}"
          >
            ${this.__renderItemCells(item.items)}
          </vaadin-dashboard-section>
        </vaadin-dashboard-widget-wrapper>`;
      }

      return html`<vaadin-dashboard-widget-wrapper .__item="${item}" style="${style}">
      </vaadin-dashboard-widget-wrapper>`;
    });
  }
}

defineCustomElement(Dashboard);

export { Dashboard };
