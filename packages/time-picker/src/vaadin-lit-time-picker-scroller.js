/**
 * @license
 * Copyright (c) 2015 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, html, LitElement } from 'lit';
import { ComboBoxScrollerMixin } from '@vaadin/combo-box/src/vaadin-combo-box-scroller-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';

/**
 * An element used internally by `<vaadin-time-picker>`. Not intended to be used separately.
 *
 * @extends HTMLElement
 * @mixes ComboBoxScrollerMixin
 * @private
 */
export class TimePickerScroller extends ComboBoxScrollerMixin(PolylitMixin(LitElement)) {
  static get is() {
    return 'vaadin-time-picker-scroller';
  }

  static get styles() {
    return css`
      :host {
        display: block;
        min-height: 1px;
        overflow: auto;

        /* Fixes item background from getting on top of scrollbars on Safari */
        transform: translate3d(0, 0, 0);

        /* Enable momentum scrolling on iOS */
        -webkit-overflow-scrolling: touch;

        /* Fixes scrollbar disappearing when 'Show scroll bars: Always' enabled in Safari */
        box-shadow: 0 0 0 white;
      }

      #selector {
        border-width: var(--_vaadin-time-picker-items-container-border-width);
        border-style: var(--_vaadin-time-picker-items-container-border-style);
        border-color: var(--_vaadin-time-picker-items-container-border-color, transparent);
        position: relative;
      }
    `;
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
