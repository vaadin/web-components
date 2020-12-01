import { NumberFieldElement } from './vaadin-number-field.js';

/**
 * `<vaadin-integer-field>` is a Web Component for integer field control in forms.
 *
 * ```html
 * <vaadin-integer-field label="Number">
 * </vaadin-integer-field>
 * ```
 *
 * @fires {CustomEvent<boolean>} invalid-changed
 * @fires {CustomEvent<string>} value-changed
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
