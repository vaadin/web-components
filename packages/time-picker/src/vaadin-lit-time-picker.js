/**
 * @license
 * Copyright (c) 2018 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/input-container/src/vaadin-lit-input-container.js';
import './vaadin-lit-time-picker-combo-box.js';
import { css, html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { inputFieldShared } from '@vaadin/field-base/src/styles/input-field-shared-styles.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { TimePickerMixin } from './vaadin-time-picker-mixin.js';

/**
 * LitElement based version of `<vaadin-time-picker>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
class TimePicker extends TimePickerMixin(ThemableMixin(ElementMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-time-picker';
  }

  static get styles() {
    return [
      inputFieldShared,
      css`
        /* See https://github.com/vaadin/vaadin-time-picker/issues/145 */
        :host([dir='rtl']) [part='input-field'] {
          direction: ltr;
        }

        :host([dir='rtl']) [part='input-field'] ::slotted(input)::placeholder {
          direction: rtl;
          text-align: left;
        }

        [part~='toggle-button'] {
          cursor: pointer;
        }
      `,
    ];
  }

  /** @protected */
  render() {
    return html`
      <div class="vaadin-time-picker-container">
        <div part="label">
          <slot name="label"></slot>
          <span part="required-indicator" aria-hidden="true" @click="${this.focus}"></span>
        </div>

        <vaadin-time-picker-combo-box
          id="comboBox"
          .filteredItems="${this.__dropdownItems}"
          .value="${this._comboBoxValue}"
          .opened="${this.opened}"
          .disabled="${this.disabled}"
          .readonly="${this.readonly}"
          .clearButtonVisible="${this.clearButtonVisible}"
          .autoOpenDisabled="${this.autoOpenDisabled}"
          .overlayClass="${this.overlayClass}"
          .positionTarget="${this._inputContainer}"
          theme="${ifDefined(this._theme)}"
          @value-changed="${this.__onComboBoxValueChanged}"
          @opened-changed="${this.__onComboBoxOpenedChanged}"
          @change="${this.__onComboBoxChange}"
          @has-input-value-changed="${this.__onComboBoxHasInputValueChanged}"
        >
          <vaadin-input-container
            part="input-field"
            .readonly="${this.readonly}"
            .disabled="${this.disabled}"
            .invalid="${this.invalid}"
            theme="${ifDefined(this._theme)}"
          >
            <slot name="prefix" slot="prefix"></slot>
            <slot name="input"></slot>
            <div id="clearButton" part="clear-button" slot="suffix" aria-hidden="true"></div>
            <div id="toggleButton" class="toggle-button" part="toggle-button" slot="suffix" aria-hidden="true"></div>
          </vaadin-input-container>
        </vaadin-time-picker-combo-box>

        <div part="helper-text">
          <slot name="helper"></slot>
        </div>

        <div part="error-message">
          <slot name="error-message"></slot>
        </div>
      </div>

      <slot name="tooltip"></slot>
    `;
  }

  /** @private */
  __onComboBoxOpenedChanged(event) {
    this.opened = event.detail.value;
  }

  /** @private */
  __onComboBoxValueChanged(event) {
    this._comboBoxValue = event.detail.value;
  }
}

defineCustomElement(TimePicker);

export { TimePicker };
