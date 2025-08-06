/**
 * @license
 * Copyright (c) 2015 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { comboBoxScrollerStyles } from './styles/vaadin-combo-box-scroller-base-styles.js';
import { ComboBoxScrollerMixin } from './vaadin-combo-box-scroller-mixin.js';

/**
 * An element used internally by `<vaadin-combo-box>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ComboBoxScrollerMixin
 * @private
 */
export class ComboBoxScroller extends ComboBoxScrollerMixin(PolylitMixin(LitElement)) {
  static get is() {
    return 'vaadin-combo-box-scroller';
  }

  static get styles() {
    return comboBoxScrollerStyles;
  }

  /** @protected */
  render() {
    return html`
      <div id="selector">
        <slot></slot>
      </div>
    `;
  }
}

defineCustomElement(ComboBoxScroller);
