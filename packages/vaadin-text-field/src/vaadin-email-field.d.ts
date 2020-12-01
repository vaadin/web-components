import { TextFieldElement } from './vaadin-text-field.js';

/**
 * `<vaadin-email-field>` is a Web Component for email field control in forms.
 *
 * ```html
 * <vaadin-email-field label="Email">
 * </vaadin-email-field>
 * ```
 *
 * ### Styling
 *
 * See vaadin-text-field.html for the styling documentation
 *
 * See [ThemableMixin – how to apply styles for shadow parts](https://github.com/vaadin/vaadin-themable-mixin/wiki)
 *
 * @fires {CustomEvent<boolean>} invalid-changed
 * @fires {CustomEvent<string>} value-changed
 */
declare class EmailFieldElement extends TextFieldElement {
  _createConstraintsObserver(): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-email-field': EmailFieldElement;
  }
}

export { EmailFieldElement };
