/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { ComboBoxScrollerMixin } from '@vaadin/combo-box/src/vaadin-combo-box-scroller-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { timePickerScrollerStyles } from './styles/vaadin-time-picker-scroller-base-styles.js';

/**
 * An element used internally by `<vaadin-time-picker>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ComboBoxScrollerMixin
 * @private
 */
export class TimePickerScroller extends ComboBoxScrollerMixin(PolylitMixin(LitElement)) {
  static get is() {
    return 'vaadin-time-picker-scroller';
  }

  static get styles() {
    return timePickerScrollerStyles;
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

defineCustomElement(TimePickerScroller);
