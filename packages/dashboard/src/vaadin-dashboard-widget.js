/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * @fires {CustomEvent} order-changed - Fired when the `order` property changes.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
class DashboardWidget extends ElementMixin(ThemableMixin(PolylitMixin(LitElement))) {
  static get is() {
    return 'vaadin-dashboard-widget';
  }

  static get styles() {
    return css`
      :host {
        display: block;
        border: 1px solid gray;
        background-color: #bae1ff;
        position: relative;
      }

      .resizer {
        position: absolute;
        bottom: 0;
        inset-inline-end: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: se-resize;
      }

      :host([dragging]) {
        border: 3px dashed gray;
        background-color: white !important;
        color: transparent;
      }
    `;
  }

  static get properties() {
    return {
      /**
       * The title of the widget.
       */
      title: {
        type: String,
      },

      colspan: {
        type: Number,
        observer: '__colspanChanged',
        notify: true,
      },

      rowspan: {
        type: Number,
        observer: '__rowspanChanged',
        notify: true,
      },

      order: {
        type: Number,
        notify: true,
        observer: '__orderChanged',
      },
    };
  }

  /** @protected */
  render() {
    return html`
      <div class="resizer" draggable="true">&#x2198;</div>
      <div class="header">
        <h2>${this.title}</h2>
      </div>
      <div class="content">
        <slot></slot>
        <div>cspan: ${this.colspan || 1}</div>
        <div>rspan: ${this.rowspan || 1}</div>
      </div>
    `;
  }

  ready() {
    super.ready();
    this.draggable = true;
    this.tabIndex = 0;
  }

  __colspanChanged(colspan) {
    this.style.setProperty('--_dashboard-widget-colspan', colspan);
  }

  __rowspanChanged(rowspan) {
    this.style.setProperty('--_dashboard-widget-rowspan', rowspan);
  }

  __orderChanged(order) {
    this.slot = `widget-${order}`;
  }
}

defineCustomElement(DashboardWidget);

export { DashboardWidget };
