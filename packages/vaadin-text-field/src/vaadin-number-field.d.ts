import { TextFieldElement } from './vaadin-text-field.js';

/**
 * `<vaadin-number-field>` is a Web Component for number field control in forms.
 *
 * ```html
 * <vaadin-number-field label="Number">
 * </vaadin-number-field>
 * ```
 *
 * @fires {Event} input - Fired when the value is changed by the user: on every typing keystroke, and the value is cleared using the clear button.
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 */
declare class NumberFieldElement extends TextFieldElement {
  /**
   * Set to true to display value increase/decrease controls.
   * @attr {boolean} has-controls
   */
  hasControls: boolean;

  /**
   * The minimum value of the field.
   */
  min: number | null | undefined;

  /**
   * The maximum value of the field.
   */
  max: number | null | undefined;

  /**
   * Specifies the allowed number intervals of the field.
   */
  step: number;

  _createConstraintsObserver(): void;

  _valueChanged(newVal: unknown | null, oldVal: unknown | null): void;

  checkValidity(): boolean;

  _onKeyDown(e: KeyboardEvent): void;

  _stepChanged(newVal: number, oldVal: number | undefined): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-number-field': NumberFieldElement;
  }
}

export { NumberFieldElement };
