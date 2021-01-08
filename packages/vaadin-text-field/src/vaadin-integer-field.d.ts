import { NumberFieldElement } from './vaadin-number-field.js';

/**
 * `<vaadin-integer-field>` is a Web Component for integer field control in forms.
 *
 * ```html
 * <vaadin-integer-field label="Number">
 * </vaadin-integer-field>
 * ```
 *
 * @fires {Event} input - Fired when the value is changed by the user: on every typing keystroke, and the value is cleared using the clear button.
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 */
declare class IntegerFieldElement extends NumberFieldElement {
  _valueChanged(newVal: unknown | null, oldVal: unknown | null): void;

  _stepChanged(newVal: number, oldVal: number | undefined): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-integer-field': IntegerFieldElement;
  }
}

export { IntegerFieldElement };
