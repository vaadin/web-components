/**
 * @license
 * Copyright (c) 2019 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { FocusMixin } from '@vaadin/component-base/src/focus-mixin.js';
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

export interface CustomFieldCustomEventMap {
  'invalid-changed': CustomFieldInvalidChangedEvent;

  'value-changed': CustomFieldValueChangedEvent;
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
 * `disabled`          | Set when the element is disabled          | :host
 * `invalid`           | Set when the element is invalid           | :host
 * `focused`           | Set when the element is focused           | :host
 * `has-label`         | Set when the element has a label          | :host
 * `has-value`         | Set when the element has a value          | :host
 * `has-helper`        | Set when the element has helper text      | :host
 * `has-error-message` | Set when the element has an error message | :host
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @fires {Event} change - Fired when the user commits a value change for any of the internal inputs.
 * @fires {Event} internal-tab - Fired on Tab keydown triggered from the internal inputs, meaning focus will not leave the inputs.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 */
declare class CustomField extends FieldMixin(FocusMixin(ThemableMixin(ElementMixin(HTMLElement)))) {
  /**
   * Array of available input nodes
   */
  readonly inputs: HTMLElement[] | undefined;

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
   */
  i18n: CustomFieldI18n;

  /**
   * The name of the control, which is submitted with the form data.
   */
  name: string | null | undefined;

  /**
   * The value of the field. When wrapping several inputs, it will contain `\t`
   * (Tab character) as a delimiter indicating parts intended to be used as the
   * corresponding inputs values. Use the [`i18n`](#/elements/vaadin-custom-field#property-i18n)
   * property to customize this behavior.
   */
  value: string | null | undefined;

  /**
   * Returns true if the current inputs values satisfy all constraints (if any).
   */
  checkValidity(): boolean;

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
