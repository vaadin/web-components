/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ValidateMixin } from '@vaadin/field-base/src/validate-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { DatePickerMixin } from './vaadin-date-picker-mixin.js';
export { DatePickerDate, DatePickerI18n } from './vaadin-date-picker-mixin.js';

/**
 * Fired when the user commits a value change.
 */
export type DatePickerLightChangeEvent = Event & {
  target: DatePickerLight;
};

/**
 * Fired when the `opened` property changes.
 */
export type DatePickerLightOpenedChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `invalid` property changes.
 */
export type DatePickerLightInvalidChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `value` property changes.
 */
export type DatePickerLightValueChangedEvent = CustomEvent<{ value: string }>;

/**
 * Fired whenever the field is validated.
 */
export type DatePickerLightValidatedEvent = CustomEvent<{ valid: boolean }>;

export interface DatePickerLightCustomEventMap {
  'opened-changed': DatePickerLightOpenedChangedEvent;

  'invalid-changed': DatePickerLightInvalidChangedEvent;

  'value-changed': DatePickerLightValueChangedEvent;

  validated: DatePickerLightValidatedEvent;
}

export interface DatePickerLightEventMap extends HTMLElementEventMap, DatePickerLightCustomEventMap {
  change: DatePickerLightChangeEvent;
}

/**
 * `<vaadin-date-picker-light>` is a customizable version of the `<vaadin-date-picker>` providing
 * only the scrollable month calendar view and leaving the input field definition to the user.
 *
 * To create a custom input field, you need to add a child element which has a two-way
 * data-bindable property representing the input value. The property name is expected
 * to be `bindValue` by default. See the example below for a simplest possible example
 * using an `<input>` element.
 *
 * ```html
 * <vaadin-date-picker-light attr-for-value="value">
 *   <input class="input">
 * </vaadin-date-picker-light>
 * ```
 *
 * ### Styling
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * In addition to `<vaadin-date-picker-light>` itself, the following
 * internal components are themable:
 *
 * - `<vaadin-date-picker-overlay>`
 * - `<vaadin-date-picker-overlay-content>`
 * - `<vaadin-month-calendar>`
 *
 * Note: the `theme` attribute value set on `<vaadin-date-picker-light>`
 * is propagated to the internal themable components listed above.
 *
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 * @fires {CustomEvent} validated - Fired whenever the field is validated.
 */
declare class DatePickerLight extends ThemableMixin(DatePickerMixin(ValidateMixin(HTMLElement))) {
  /**
   * Name of the two-way data-bindable property representing the
   * value of the custom input field.
   */
  attrForValue: string;

  addEventListener<K extends keyof DatePickerLightEventMap>(
    type: K,
    listener: (this: DatePickerLight, ev: DatePickerLightEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof DatePickerLightEventMap>(
    type: K,
    listener: (this: DatePickerLight, ev: DatePickerLightEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-date-picker-light': DatePickerLight;
  }
}

export { DatePickerLight };
