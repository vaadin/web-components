/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-dashboard-section.js';
import { css, html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * Dashboard layout element
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ResizeMixin
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
class DashboardLayout extends ResizeMixin(ElementMixin(ThemableMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-dashboard-layout';
  }

  static get styles() {
    return css`
      :host {
        display: grid;
        --_dashboard-default-min-col-width: 200px;
        --_dashboard-default-max-col-width: 400px;
        --_dashboard-row-height: 200px;
        --_dashboard-min-col-width: var(--min-col-width, var(--_dashboard-default-min-col-width));
        --_dashboard-max-col-width: var(--max-col-width, var(--_dashboard-default-max-col-width));
        grid-template-columns: repeat(
          auto-fill,
          minmax(var(--_dashboard-min-col-width), var(--_dashboard-max-col-width))
        );
        grid-auto-columns: minmax(var(--_dashboard-min-col-width), var(--_dashboard-max-col-width));
        grid-auto-rows: minmax(var(--_dashboard-row-height), auto);
        gap: 16px;
      }

      :host([dense]) {
        /* grid-auto-flow: row dense; */
        grid-auto-flow: dense;
      }

      ::slotted(*:not(vaadin-dashboard-section)) {
        grid-column: span min(var(--_dashboard-widget-colspan, 1), var(--_dashboard-column-count));
        grid-row: span var(--_dashboard-widget-rowspan, 1);
      }
    `;
  }

  static get properties() {
    return {
      dense: {
        type: Boolean,
        reflectToAttribute: true,
      },
    };
  }

  /** @protected */
  render() {
    return html`<slot></slot>`;
  }

  /**
   * @protected
   * @override
   */
  _onResize() {
    this.__updateColumnCount();
  }

  __updateColumnCount() {
    this.style.removeProperty('--_dashboard-column-count');
    const columnCount = getComputedStyle(this).gridTemplateColumns.split(' ').length;

    this.style.setProperty('--_dashboard-column-count', columnCount);
  }
}

defineCustomElement(DashboardLayout);

export { DashboardLayout };
