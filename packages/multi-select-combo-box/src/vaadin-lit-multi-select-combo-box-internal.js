/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-lit-multi-select-combo-box-item.js';
import './vaadin-lit-multi-select-combo-box-overlay.js';
import './vaadin-lit-multi-select-combo-box-scroller.js';
import { css, html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { MultiSelectComboBoxInternalMixin } from './vaadin-multi-select-combo-box-internal-mixin.js';

/**
 * An element used internally by `<vaadin-multi-select-combo-box>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes MultiSelectComboBoxInternalMixin
 * @mixes ThemableMixin
 * @private
 */
class MultiSelectComboBoxInternal extends MultiSelectComboBoxInternalMixin(ThemableMixin(PolylitMixin(LitElement))) {
  static get is() {
    return 'vaadin-multi-select-combo-box-internal';
  }

  static get styles() {
    return css`
      :host([opened]) {
        pointer-events: auto;
      }
    `;
  }

  /** @protected */
  render() {
    return html`
      <slot></slot>

      <vaadin-multi-select-combo-box-overlay
        id="overlay"
        .opened="${this._overlayOpened}"
        ?loading="${this.loading}"
        theme="${ifDefined(this._theme)}"
        .positionTarget="${this._target}"
        no-vertical-overlap
        .restoreFocusNode="${this.inputElement}"
      ></vaadin-multi-select-combo-box-overlay>
    `;
  }
}

defineCustomElement(MultiSelectComboBoxInternal);
