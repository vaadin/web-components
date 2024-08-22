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
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { css, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { DashboardLayoutMixin } from './vaadin-dashboard-layout-mixin.js';

/**
 * A responsive, grid-based dashboard layout component
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes DashboardLayoutMixin
 * @mixes ThemableMixin
 */
class Dashboard extends DashboardLayoutMixin(ElementMixin(ThemableMixin(PolylitMixin(LitElement)))) {
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
        ::slotted(vaadin-dashboard-cell) {
          display: contents;
        }
      `,
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
    };
  }

  static get observers() {
    return ['__itemsOrRendererChanged(items, renderer)'];
  }

  /** @protected */
  render() {
    return html`<slot></slot>`;
  }

  /** @private */
  __itemsOrRendererChanged(items, renderer) {
    render(this.__renderItemCells(items || []), this);

    this.querySelectorAll('vaadin-dashboard-cell').forEach((cell) => {
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
      if (item.items) {
        return html`<vaadin-dashboard-section
          .__item="${item}"
          .sectionTitle="${item.title || ''}"
          .items="${item.items}"
        >
          ${this.__renderItemCells(item.items)}
        </vaadin-dashboard-section>`;
      }

      return html`<vaadin-dashboard-cell
        .__item="${item}"
        style="--vaadin-dashboard-item-colspan: ${item.colspan};"
      ></vaadin-dashboard-cell>`;
    });
  }
}

defineCustomElement(Dashboard);

export { Dashboard };
