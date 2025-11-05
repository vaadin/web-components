/**
 * @license
 * Copyright (c) 2019 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/date-picker/src/vaadin-date-picker.js';
import '@vaadin/time-picker/src/vaadin-time-picker.js';
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { inputFieldShared } from '@vaadin/field-base/src/styles/input-field-shared-styles.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { dateTimePickerStyles } from './styles/vaadin-date-time-picker-base-styles.js';
import { DateTimePickerMixin } from './vaadin-date-time-picker-mixin.js';

/**
 * `<vaadin-date-time-picker>` is a Web Component providing a date time selection field.
 *
 * ```html
 * <vaadin-date-time-picker value="2019-09-16T15:00"></vaadin-date-time-picker>
 * ```
 *
 * ```js
 * dateTimePicker.value = '2019-09-16T15:00';
 * ```
 *
 * When the selected `value` is changed, a `value-changed` event is triggered.
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name            | Description
 * ---------------------|----------------
 * `label`              | The slotted label element wrapper
 * `input-fields`       | The date and time pickers wrapper
 * `helper-text`        | The slotted helper text element wrapper
 * `error-message`      | The slotted error message element wrapper
 * `required-indicator` | The `required` state indicator element
 *
 * The following state attributes are available for styling:
 *
 * Attribute           | Description
 * --------------------|---------------------------------
 * `disabled`          | Set when the element is disabled
 * `focused`           | Set when the element is focused
 * `focus-ring`        | Set when the element is keyboard focused
 * `readonly`          | Set when the element is readonly
 * `invalid`           | Set when the element is invalid
 * `has-label`         | Set when the element has a label
 * `has-value`         | Set when the element has a value
 * `has-helper`        | Set when the element has helper text
 * `has-error-message` | Set when the element has an error message
 * `has-tooltip`       | Set when the element has a slotted tooltip
 *
 * ### Internal components
 *
 * The following components are created by `<vaadin-date-time-picker>` and placed in light DOM:
 *
 * - [`<vaadin-date-picker>`](#/elements/vaadin-date-picker).
 * - [`<vaadin-time-picker>`](#/elements/vaadin-time-picker).
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * ### Change events
 *
 * Depending on the nature of the value change that the user attempts to commit e.g. by pressing Enter,
 * the component can fire either a `change` event or an `unparsable-change` event:
 *
 * Value change             | Event
 * :------------------------|:------------------
 * empty => parsable        | change
 * empty => unparsable      | unparsable-change
 * parsable => empty        | change
 * parsable => parsable     | change
 * parsable => unparsable   | change
 * unparsable => empty      | unparsable-change
 * unparsable => parsable   | change
 * unparsable => unparsable | unparsable-change
 * incomplete => empty      | unparsable-change
 * incomplete => parsable   | change
 * incomplete => unparsable | unparsable-change
 * empty => incomplete      | unparsable-change
 * parsable => incomplete   | change
 * unparsable => incomplete | unparsable-change
 *
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {Event} unparsable-change - Fired when the user commits an unparsable or incomplete value change and there is no change event.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 * @fires {CustomEvent} validated - Fired whenever the field is validated.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 * @mixes DateTimePickerMixin
 */
class DateTimePicker extends DateTimePickerMixin(
  ThemableMixin(ElementMixin(PolylitMixin(LumoInjectionMixin(LitElement)))),
) {
  static get is() {
    return 'vaadin-date-time-picker';
  }

  static get styles() {
    return [inputFieldShared, dateTimePickerStyles];
  }

  /** @protected */
  render() {
    return html`
      <div class="vaadin-date-time-picker-container">
        <div part="label" @click="${this.focus}">
          <slot name="label"></slot>
          <span part="required-indicator" aria-hidden="true"></span>
        </div>

        <div part="input-fields">
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
