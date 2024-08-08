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
 * Dashboard section element
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
class DashboardSection extends ElementMixin(ThemableMixin(PolylitMixin(LitElement))) {
  static get is() {
    return 'vaadin-dashboard-section';
  }

  static get styles() {
    return css`
      :host {
        display: grid;
        grid-column: 1 / calc(var(--_dashboard-column-count) + 1);
        gap: 16px;
        grid-template-columns: subgrid;
        grid-auto-rows: minmax(var(--_dashboard-row-height), auto);
        padding-top: 40px;
        position: relative;
      }

      ::slotted(*:not(vaadin-dashboard-section)) {
        grid-column: span min(var(--widget-colspan, 1), var(--_dashboard-column-count));
        grid-row: span var(--widget-rowspan, 1);
      }

      ::slotted(vaadin-dashboard-cell) {
        display: contents;
      }

      .header {
        position: absolute;
        top: 0;
      }
    `;
  }

  static get properties() {
    return {
      title: {
        type: String,
      },
    };
  }

  /** @protected */
  render() {
    return html`<div class="header"><strong>${this.title}</strong></div> <slot></slot>`;
  }
}

defineCustomElement(DashboardSection);

export { DashboardSection };
