/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-lit-time-picker-item.js';
import './vaadin-lit-time-picker-overlay.js';
import './vaadin-lit-time-picker-scroller.js';
import { css, html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ComboBoxMixin } from '@vaadin/combo-box/src/vaadin-combo-box-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * An element used internally by `<vaadin-time-picker>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ComboBoxMixin
 * @mixes ThemableMixin
 * @private
 */
class TimePickerComboBox extends ComboBoxMixin(ThemableMixin(PolylitMixin(LitElement))) {
  static get is() {
    return 'vaadin-time-picker-combo-box';
  }

  static get styles() {
    return css`
      :host([opened]) {
        pointer-events: auto;
      }
    `;
  }

  static get properties() {
    return {
      positionTarget: {
        type: Object,
      },
    };
  }

  /**
   * Tag name prefix used by scroller and items.
   * @protected
   * @return {string}
   */
  get _tagNamePrefix() {
    return 'vaadin-time-picker';
  }

  /**
   * Reference to the clear button element.
   * @protected
   * @return {!HTMLElement}
   */
  get clearElement() {
    return this.querySelector('[part="clear-button"]');
  }

  /** @protected */
  render() {
    return html`
      <slot></slot>

      <vaadin-time-picker-overlay
        id="overlay"
        .opened="${this._overlayOpened}"
        ?loading="${this.loading}"
        theme="${ifDefined(this._theme)}"
        .positionTarget="${this.positionTarget}"
        .restoreFocusNode="${this.inputElement}"
        no-vertical-overlap
      ></vaadin-time-picker-overlay>
    `;
  }
  /** @protected */
  ready() {
    super.ready();

    this.allowCustomValue = true;
    this._toggleElement = this.querySelector('.toggle-button');

    // See https://github.com/vaadin/vaadin-time-picker/issues/145
    this.setAttribute('dir', 'ltr');
  }
}

defineCustomElement(TimePickerComboBox);
