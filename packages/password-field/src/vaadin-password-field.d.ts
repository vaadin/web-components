/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotStylesMixin } from '@vaadin/field-base/src/slot-styles-mixin.js';
import { TextField } from '@vaadin/text-field/src/vaadin-text-field.js';

/**
 * Fired when the user commits a value change.
 */
export type PasswordFieldChangeEvent = Event & {
  target: PasswordField;
};

/**
 * Fired when the `invalid` property changes.
 */
export type PasswordFieldInvalidChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `value` property changes.
 */
export type PasswordFieldValueChangedEvent = CustomEvent<{ value: string }>;

export interface PasswordFieldCustomEventMap {
  'invalid-changed': PasswordFieldInvalidChangedEvent;

  'value-changed': PasswordFieldValueChangedEvent;
}

export interface PasswordFieldEventMap extends HTMLElementEventMap, PasswordFieldCustomEventMap {
  change: PasswordFieldChangeEvent;
}

/**
 * `<vaadin-password-field>` is an extension of `<vaadin-text-field>` component for entering passwords.
 *
 * ```html
 * <vaadin-password-field label="Password"></vaadin-password-field>
 * ```
 *
 * ### Styling
 *
 * `<vaadin-password-field>` provides the same set of shadow DOM parts and state attributes as `<vaadin-text-field>`.
 * See [`<vaadin-text-field>`](#/elements/vaadin-text-field) for the styling documentation.
 *
 * In addition to `<vaadin-text-field>` parts, the following parts are available for theming:
 *
 * Part name       | Description
 * ----------------|----------------------------------------------------
 * `reveal-button` | The eye icon which toggles the password visibility
 *
 * In addition to `<vaadin-text-field>` state attributes, the following state attributes are available for theming:
 *
 * Attribute          | Description
 * -------------------|---------------------------------
 * `password-visible` | Set when the password is visible
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @fires {Event} input - Fired when the value is changed by the user: on every typing keystroke, and the value is cleared using the clear button.
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 */
declare class PasswordField extends SlotStylesMixin(TextField) {
  /**
   * Set to true to hide the eye icon which toggles the password visibility.
   * @attr {boolean} reveal-button-hidden
   */
  revealButtonHidden: boolean;

  /**
   * True if the password is visible ([type=text]).
   * @attr {boolean} password-visible
   */
  readonly passwordVisible: boolean;

  /**
   * An object with translated strings used for localization.
   * It has the following structure and default values:
   *
   * ```
   * {
   *   // Translation of the reveal icon button accessible label
   *   reveal: 'Show password'
   * }
   * ```
   */
  i18n: { reveal: string };

  addEventListener<K extends keyof PasswordFieldEventMap>(
    type: K,
    listener: (this: PasswordField, ev: PasswordFieldEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof PasswordFieldEventMap>(
    type: K,
    listener: (this: PasswordField, ev: PasswordFieldEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-password-field': PasswordField;
  }
}

export { PasswordField };
