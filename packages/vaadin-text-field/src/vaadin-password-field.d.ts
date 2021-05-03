import { TextFieldElement } from './vaadin-text-field.js';

/**
 * `<vaadin-password-field>` is a Web Component for password field control in forms.
 *
 * ```html
 * <vaadin-password-field label="Password">
 * </vaadin-password-field>
 * ```
 *
 * ### Styling
 *
 * See [`<vaadin-text-field>`](#/elements/vaadin-text-field) for the styling documentation.
 *
 * In addition to vaadin-text-field parts, here's the list of vaadin-password-field specific parts
 *
 * Part name       | Description
 * ----------------|----------------------------------------------------
 * `reveal-button` | The eye icon which toggles the password visibility
 *
 * In addition to vaadin-text-field state attributes, here's the list of vaadin-password-field specific attributes
 *
 * Attribute    | Description | Part name
 * -------------|-------------|------------
 * `password-visible` | Set when the password is visible | :host
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @fires {Event} input - Fired when the value is changed by the user: on every typing keystroke, and the value is cleared using the clear button.
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 */
declare class PasswordFieldElement extends TextFieldElement {
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

  _onChange(e: Event): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-password-field': PasswordFieldElement;
  }
}

export { PasswordFieldElement };
