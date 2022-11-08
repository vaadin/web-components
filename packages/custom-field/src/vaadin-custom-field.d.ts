/**
 * @license
 * Copyright (c) 2019 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { FocusMixin } from '@vaadin/component-base/src/focus-mixin.js';
import { KeyboardMixin } from '@vaadin/component-base/src/keyboard-mixin.js';
import { FieldMixin } from '@vaadin/field-base/src/field-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export type CustomFieldParseValueFn = (value: string) => unknown[];

export type CustomFieldFormatValueFn = (inputValues: unknown[]) => string;

export interface CustomFieldI18n {
  parseValue: CustomFieldParseValueFn;

  formatValue: CustomFieldFormatValueFn;
}

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

/**
 * Fired on Tab keydown triggered from the internal inputs, meaning focus will not leave the inputs.
 */
export type CustomFieldInternalTabEvent = Event & {
  target: CustomField;
};

export interface CustomFieldCustomEventMap {
  'invalid-changed': CustomFieldInvalidChangedEvent;

  'value-changed': CustomFieldValueChangedEvent;

  'internal-tab': CustomFieldInternalTabEvent;

  validated: CustomFieldValidatedEvent;
}

export interface CustomFieldEventMap extends HTMLElementEventMap, CustomFieldCustomEventMap {
  change: CustomFieldChangeEvent;
}

/**
 * `<vaadin-custom-field>` is a web component for wrapping multiple components as a single field.
 *
 * ```
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
 *
 * The following state attributes are available for styling:
 *
 * Attribute           | Description                               | Part name
 * --------------------|-------------------------------------------|------------
 * `invalid`           | Set when the element is invalid           | :host
 * `focused`           | Set when the element is focused           | :host
 * `has-label`         | Set when the element has a label          | :host
 * `has-value`         | Set when the element has a value          | :host
 * `has-helper`        | Set when the element has helper text      | :host
 * `has-error-message` | Set when the element has an error message | :host
 *
 * You may also manually set `disabled` or `readonly` attribute on this component to make the label
 * part look visually the same as on a `<vaadin-text-field>` when it is disabled or readonly.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/custom-theme/styling-components) documentation.
 *
 * @fires {Event} change - Fired when the user commits a value change for any of the internal inputs.
 * @fires {Event} internal-tab - Fired on Tab keydown triggered from the internal inputs, meaning focus will not leave the inputs.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 * @fires {CustomEvent} validated - Fired whenever the field is validated.
 */
declare class CustomField extends FieldMixin(FocusMixin(KeyboardMixin(ThemableMixin(ElementMixin(HTMLElement))))) {
  /**
   * Array of available input nodes
   */
  readonly inputs: HTMLElement[] | undefined;

  /**
   * A function to format the values of the individual fields contained by
   * the custom field into a single component value. The function receives
   * an array of all values of the individual fields in the order of their
   * presence in the DOM, and must return a single component value.
   * This function is called each time a value of an internal field is
   * changed.
   *
   * Example:
   * ```js
   * customField.formatValue = (fieldValues) => {
   *   return fieldValues.join("-");
   * }
   * ```
   */
  formatValue: CustomFieldFormatValueFn | undefined;

  /**
   * A function to parse the component value into values for the individual
   * fields contained by the custom field. The function receives the
   * component value, and must return an array of values for the individual
   * fields in the order of their presence in the DOM.
   * The function is called each time the value of the component changes.
   *
   * Example:
   * ```js
   * customField.parseValue = (componentValue) => {
   *   return componentValue.split("-");
   * }
   * ```
   */
  parseValue: CustomFieldParseValueFn | undefined;

  /**
   * The object used to localize this component.
   * To change the default localization, replace the entire
   * _i18n_ object or just the property you want to modify.
   *
   * The object has the following JSON structure:
   *
   * ```
   * {
   *   // A function to format given `Array` as
   *   // component value. Array is list of all internal values
   *   // in the order of their presence in the DOM
   *   // This function is called each time the internal input
   *   // value is changed.
   *   formatValue: inputValues => {
   *     // returns a representation of the given array of values
   *     // in the form of string with delimiter characters
   *   },
   *
   *   // A function to parse the given value to an `Array` in the format
   *   // of the list of all internal values
   *   // in the order of their presence in the DOM
   *   // This function is called when value of the
   *   // custom field is set.
   *   parseValue: value => {
   *     // returns the array of values from parsed value string.
   *   }
   * }
   * ```
   * @deprecated Since 23.3
   * Use the [`formatValue`](#/elements/vaadin-custom-field#property-formatValue)
   * and [`parseValue`](#/elements/vaadin-custom-field#property-parseValue) properties instead
   */
  i18n: CustomFieldI18n;

  /**
   * The name of the control, which is submitted with the form data.
   */
  name: string | null | undefined;

  /**
   * The value of the field. When wrapping several inputs, it will contain `\t`
   * (Tab character) as a delimiter indicating parts intended to be used as the
   * corresponding inputs values.
   * Use the [`formatValue`](#/elements/vaadin-custom-field#property-formatValue)
   * and [`parseValue`](#/elements/vaadin-custom-field#property-parseValue)
   * properties to customize this behavior.
   */
  value: string | null | undefined;

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
