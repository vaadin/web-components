/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
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
        grid-auto-rows: var(--_dashboard-row-height);
        gap: 16px;
      }

      :host([dense]) {
        /* grid-auto-flow: row dense; */
        grid-auto-flow: dense;
      }

      ::slotted(*) {
        grid-column: span min(var(--_dashboard-widget-colspan, 1), var(--_dashboard-column-count));
        grid-row: span var(--_dashboard-widget-rowspan, 1);
      }
    `;
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
    const width = this.offsetWidth;
    const minColWidth = getComputedStyle(this).getPropertyValue('--min-col-width');
    const defaultMinColWidth = getComputedStyle(this).getPropertyValue('--_dashboard-default-min-col-width');

    // TODO: Pixels assumed
    const minColWidthPx = parseInt(minColWidth) || parseInt(defaultMinColWidth);
    const colCount = Math.floor(width / minColWidthPx);

    this.style.setProperty('--_dashboard-column-count', colCount);
  }
}

defineCustomElement(DashboardLayout);

export { DashboardLayout };
