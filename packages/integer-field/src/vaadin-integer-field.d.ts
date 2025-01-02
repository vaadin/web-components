/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
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
 * Fired when the user commits an unparsable value change and there is no change event.
 */
export type IntegerFieldUnparsableChangeEvent = CustomEvent;

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
  'unparsable-change': IntegerFieldUnparsableChangeEvent;

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
 * unparsable => unparsable | -
 *
 * Note, there is currently no way to detect unparsable => unparsable changes because the browser
 * doesn't provide access to unparsable values of native [type=number] inputs.
 *
 * @fires {Event} input - Fired when the value is changed by the user: on every typing keystroke, and the value is cleared using the clear button.
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {Event} unparsable-change - Fired when the user commits an unparsable value change and there is no change event.
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
