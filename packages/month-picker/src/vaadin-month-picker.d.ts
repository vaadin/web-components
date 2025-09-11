/**
 * @license
 * Copyright (c) 2025 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { InputControlMixin } from '@vaadin/field-base/src/input-control-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { MonthPickerMixin } from './vaadin-month-picker-mixin.js';

export { MonthPickerI18n } from './vaadin-month-picker-mixin.js';

/**
 * Fired when the user commits a value change.
 */
export type MonthPickerChangeEvent = Event & {
  target: MonthPicker;
};

/**
 * Fired when the user commits an unparsable value change and there is no
 * change event.
 */
export type MonthPickerUnparsableChangeEvent = CustomEvent;

/**
 * Fired when the `opened` property changes.
 */
export type MonthPickerOpenedChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `invalid` property changes.
 */
export type MonthPickerInvalidChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `value` property changes.
 */
export type MonthPickerValueChangedEvent = CustomEvent<{ value: string }>;

/**
 * Fired whenever the field is validated.
 */
export type MonthPickerValidatedEvent = CustomEvent<{ valid: boolean }>;

export interface MonthPickerCustomEventMap {
  'opened-changed': MonthPickerOpenedChangedEvent;

  'invalid-changed': MonthPickerInvalidChangedEvent;

  'value-changed': MonthPickerValueChangedEvent;

  'unparsable-change': MonthPickerUnparsableChangeEvent;

  validated: MonthPickerValidatedEvent;
}

export interface MonthPickerEventMap extends HTMLElementEventMap, MonthPickerCustomEventMap {
  change: MonthPickerChangeEvent;
}

/**
 * `<vaadin-month-picker>` is an input field that allows the user to select
 * a month and a year.
 *
 * ```html
 * <vaadin-month-picker label="Month"></vaadin-month-picker>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name            | Description
 * ---------------------|------------------------------------------------
 * `label`              | The label element wrapper.
 * `input-field`        | The element that wraps prefix, value and suffix.
 * `helper-text`        | The element that wraps the helper text.
 * `error-message`      | The element that wraps the error message.
 * `required-indicator` | The `required` state indicator element.
 * `clear-button`       | The clear button shown when the field has a value.
 * `toggle-button`      | The button that opens / closes the overlay.
 * `overlay`            | The overflow overlay panel (re-exported from the internal overlay).
 * `content`            | The inner wrapper inside the overlay.
 *
 * The following state attributes are available for styling:
 *
 * Attribute   | Description
 * ------------|---------------------------------------------------------
 * `opened`    | Set when the overlay is open.
 * `disabled`  | Set when the field is disabled.
 * `readonly`  | Set when the field is read-only.
 * `invalid`   | Set when the field has failed validation.
 * `focused`   | Set when the field has focus.
 * `focus-ring`| Set when the field is keyboard-focused.
 * `has-value` | Set when the field has a non-empty value.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} unparsable-change - Fired when the user commits an unparsable value change.
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 * @fires {CustomEvent} validated - Fired whenever the field is validated.
 */
declare class MonthPicker extends MonthPickerMixin(InputControlMixin(ThemableMixin(ElementMixin(HTMLElement)))) {
  addEventListener<K extends keyof MonthPickerEventMap>(
    type: K,
    listener: (this: MonthPicker, ev: MonthPickerEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof MonthPickerEventMap>(
    type: K,
    listener: (this: MonthPicker, ev: MonthPickerEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-month-picker': MonthPicker;
  }
}

export { MonthPicker };
