/**
 * @license
 * Copyright (c) 2019 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { CustomFieldMixin } from './vaadin-custom-field-mixin.js';

export { CustomFieldFormatValueFn, CustomFieldParseValueFn } from './vaadin-custom-field-mixin.js';

/**
 * Fired when the user commits a value change.
 */
export type CustomFieldChangeEvent = Event & {
  target: CustomField;
};

/**
 * Fired when the `invalid` property changes.
 */
export type CustomFieldInvalidChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `value` property changes.
 */
export type CustomFieldValueChangedEvent = CustomEvent<{ value: string }>;

/**
 * Fired whenever the field is validated.
 */
export type CustomFieldValidatedEvent = CustomEvent<{ valid: boolean }>;

export interface CustomFieldCustomEventMap {
  'invalid-changed': CustomFieldInvalidChangedEvent;

  'value-changed': CustomFieldValueChangedEvent;

  validated: CustomFieldValidatedEvent;
}

export interface CustomFieldEventMap extends HTMLElementEventMap, CustomFieldCustomEventMap {
  change: CustomFieldChangeEvent;
}

/**
 * `<vaadin-custom-field>` is a web component for wrapping multiple components as a single field.
 *
 * ```html
 * <vaadin-custom-field label="Appointment time">
 *   <vaadin-date-picker></vaadin-date-picker>
 *   <vaadin-time-picker></vaadin-time-picker>
 * </vaadin-custom-field>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name            | Description
 * ---------------------|----------------
 * `label`              | The slotted label element wrapper
 * `helper-text`        | The slotted helper text element wrapper
 * `error-message`      | The slotted error message element wrapper
 * `required-indicator` | The `required` state indicator element
 * `input-fields`       | The slotted input elements wrapper
 *
 * The following state attributes are available for styling:
 *
 * Attribute           | Description
 * --------------------|--------------------------------
 * `invalid`           | Set when the element is invalid
 * `focused`           | Set when the element is focused
 * `has-label`         | Set when the element has a label
 * `has-value`         | Set when the element has a value
 * `has-helper`        | Set when the element has helper text
 * `has-error-message` | Set when the element has an error message
 * `has-tooltip`       | Set when the element has a slotted tooltip
 *
 * You may also manually set `disabled` or `readonly` attribute on this component to make the label
 * part look visually the same as on a `<vaadin-text-field>` when it is disabled or readonly.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {Event} change - Fired when the user commits a value change for any of the internal inputs.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 * @fires {CustomEvent} validated - Fired whenever the field is validated.
 */
declare class CustomField extends CustomFieldMixin(ThemableMixin(ElementMixin(HTMLElement))) {
  addEventListener<K extends keyof CustomFieldEventMap>(
    type: K,
    listener: (this: CustomField, ev: CustomFieldEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof CustomFieldEventMap>(
    type: K,
    listener: (this: CustomField, ev: CustomFieldEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-custom-field': CustomField;
  }
}

export { CustomField };
