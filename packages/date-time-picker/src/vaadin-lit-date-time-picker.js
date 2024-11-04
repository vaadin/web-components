/**
 * @license
 * Copyright (c) 2019 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/date-picker/src/vaadin-lit-date-picker.js';
import '@vaadin/time-picker/src/vaadin-lit-time-picker.js';
import { css, html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { inputFieldShared } from '@vaadin/field-base/src/styles/input-field-shared-styles.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { DateTimePickerMixin } from './vaadin-date-time-picker-mixin.js';

/**
 * LitElement based version of `<vaadin-date-time-picker>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
class DateTimePicker extends DateTimePickerMixin(ThemableMixin(ElementMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-date-time-picker';
  }

  static get styles() {
    return [
      inputFieldShared,
      css`
        .vaadin-date-time-picker-container {
          --vaadin-field-default-width: auto;
        }

        .slots {
          display: flex;
          --vaadin-field-default-width: 12em;
        }

        .slots ::slotted([slot='date-picker']) {
          min-width: 0;
          flex: 1 1 auto;
        }

        .slots ::slotted([slot='time-picker']) {
          min-width: 0;
          flex: 1 1.65 auto;
        }
      `,
    ];
  }

  /** @protected */
  render() {
    return html`
      <div class="vaadin-date-time-picker-container">
        <div part="label" @click="${this.focus}">
          <slot name="label"></slot>
          <span part="required-indicator" aria-hidden="true"></span>
        </div>

        <div class="slots">
          <slot name="date-picker" id="dateSlot"></slot>
          <slot name="time-picker" id="timeSlot"></slot>
        </div>

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
}

defineCustomElement(DateTimePicker);

export { DateTimePicker };
