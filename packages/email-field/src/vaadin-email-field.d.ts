/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { TextField } from '@vaadin/text-field/src/vaadin-text-field.js';

/**
 * Fired when the user commits a value change.
 */
export type EmailFieldChangeEvent = Event & {
  target: EmailField;
};

/**
 * Fired when the `invalid` property changes.
 */
export type EmailFieldInvalidChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `value` property changes.
 */
export type EmailFieldValueChangedEvent = CustomEvent<{ value: string }>;

export interface EmailFieldCustomEventMap {
  'invalid-changed': EmailFieldInvalidChangedEvent;

  'value-changed': EmailFieldValueChangedEvent;
}

export interface EmailFieldEventMap extends HTMLElementEventMap, EmailFieldCustomEventMap {
  change: EmailFieldChangeEvent;
}

/**
 * `<vaadin-email-field>` is a Web Component for email field control in forms.
 *
 * ```html
 * <vaadin-email-field label="Email"></vaadin-email-field>
 * ```
 *
 * ### Styling
 *
 * `<vaadin-email-field>` provides the same set of shadow DOM parts and state attributes as `<vaadin-text-field>`.
 * See [`<vaadin-text-field>`](#/elements/vaadin-text-field) for the styling documentation.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @fires {Event} input - Fired when the value is changed by the user: on every typing keystroke, and the value is cleared using the clear button.
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 */
declare class EmailField extends TextField {
  addEventListener<K extends keyof EmailFieldEventMap>(
    type: K,
    listener: (this: EmailField, ev: EmailFieldEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof EmailFieldEventMap>(
    type: K,
    listener: (this: EmailField, ev: EmailFieldEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-email-field': EmailField;
  }
}

export { EmailField };
