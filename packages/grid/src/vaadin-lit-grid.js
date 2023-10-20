/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-lit-grid-column.js';
import { html, LitElement } from 'lit';
import { isIOS, isSafari } from '@vaadin/component-base/src/browser-utils.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { GridMixin } from './vaadin-grid-mixin.js';
import { gridStyles } from './vaadin-grid-styles.js';

/**
 * LitElement based version of `<vaadin-grid>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment not intended for publishing to npm.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
class Grid extends GridMixin(ElementMixin(ThemableMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-grid';
  }

  static get styles() {
    return gridStyles;
  }

  /** @protected */
  render() {
    return html`
      <div
        id="scroller"
        safari="${isSafari}"
        ios="${isIOS}"
        ?loading="${this.loading}"
        column-reordering-allowed="${this.columnReorderingAllowed}"
      >
        <table id="table" role="treegrid" aria-multiselectable="true" tabindex="0">
          <caption id="sizer" part="row"></caption>
          <thead id="header" role="rowgroup"></thead>
          <tbody id="items" role="rowgroup"></tbody>
          <tfoot id="footer" role="rowgroup"></tfoot>
        </table>

        <div part="reorder-ghost"></div>
      </div>

      <slot name="tooltip"></slot>

      <div id="focusexit" tabindex="0"></div>
    `;
  }
}

defineCustomElement(Grid);

export { Grid };
