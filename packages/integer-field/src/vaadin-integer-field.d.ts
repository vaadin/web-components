/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { NumberField } from '@vaadin/number-field/src/vaadin-number-field.js';

/**
 * Fired when the user commits a value change.
 */
export type IntegerFieldChangeEvent = Event & {
  target: IntegerField;
};

/**
 * Fired when the `invalid` property changes.
 */
export type IntegerFieldInvalidChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `value` property changes.
 */
export type IntegerFieldValueChangedEvent = CustomEvent<{ value: string }>;

/**
 * Fired whenever the field is validated.
 */
export type IntegerFieldValidatedEvent = CustomEvent<{ valid: boolean }>;

export interface IntegerFieldCustomEventMap {
  'invalid-changed': IntegerFieldInvalidChangedEvent;

  'value-changed': IntegerFieldValueChangedEvent;

  validated: IntegerFieldValidatedEvent;
}

export interface IntegerFieldEventMap extends HTMLElementEventMap, IntegerFieldCustomEventMap {
  change: IntegerFieldChangeEvent;
}

/**
 * `<vaadin-integer-field>` is an input field web component that only accepts entering integer numbers.
 *
 * ```html
 * <vaadin-integer-field label="X"></vaadin-integer-field>
 * ```
 *
 * ### Styling
 *
 * `<vaadin-integer-field>` provides the same set of shadow DOM parts and state attributes as `<vaadin-text-field>`.
 * See [`<vaadin-text-field>`](#/elements/vaadin-text-field) for the styling documentation.
 *
 * In addition to `<vaadin-text-field>` parts, the following parts are available for theming:
 *
 * Part name         | Description
 * ------------------|-------------------------
 * `increase-button` | Increase ("plus") button
 * `decrease-button` | Decrease ("minus") button
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/custom-theme/styling-components) documentation.
 *
 * @fires {Event} input - Fired when the value is changed by the user: on every typing keystroke, and the value is cleared using the clear button.
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 * @fires {CustomEvent} validated - Fired whenever the field is validated.
 */
declare class IntegerField extends NumberField {
  addEventListener<K extends keyof IntegerFieldEventMap>(
    type: K,
    listener: (this: IntegerField, ev: IntegerFieldEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof IntegerFieldEventMap>(
    type: K,
    listener: (this: IntegerField, ev: IntegerFieldEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-integer-field': IntegerField;
  }
}

export { IntegerField };
