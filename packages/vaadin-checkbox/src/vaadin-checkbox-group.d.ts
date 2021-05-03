import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

import { DirMixin } from '@vaadin/vaadin-element-mixin/vaadin-dir-mixin.js';

import { CheckboxElement } from './vaadin-checkbox.js';

/**
 * Fired when the `invalid` property changes.
 */
export type CheckboxGroupInvalidChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `value` property changes.
 */
export type CheckboxGroupValueChangedEvent = CustomEvent<{ value: Array<string> }>;

export interface CheckboxGroupElementEventMap {
  'invalid-changed': CheckboxGroupInvalidChangedEvent;

  'value-changed': CheckboxGroupValueChangedEvent;
}

export interface CheckboxGroupEventMap extends HTMLElementEventMap, CheckboxGroupElementEventMap {}

/**
 * `<vaadin-checkbox-group>` is a Polymer element for grouping vaadin-checkboxes.
 *
 * ```html
 * <vaadin-checkbox-group label="Preferred language of contact:">
 *  <vaadin-checkbox value="en">English</vaadin-checkbox>
 *  <vaadin-checkbox value="fr">Français</vaadin-checkbox>
 *  <vaadin-checkbox value="de">Deutsch</vaadin-checkbox>
 * </vaadin-checkbox-group>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------------|----------------
 * `label` | The label element
 * `group-field` | The element that wraps checkboxes
 * `error-message` | The error message element
 *
 * The following state attributes are available for styling:
 *
 * Attribute  | Description | Part name
 * -----------|-------------|------------
 * `disabled`   | Set when the checkbox group and its children are disabled. | :host
 * `focused` | Set when the checkbox group contains focus | :host
 * `has-label` | Set when the element has a label | :host
 * `has-value` | Set when the element has a value | :host
 * `has-helper` | Set when the element has helper text or slot | :host
 * `has-error-message` | Set when the element has an error message, regardless if the field is valid or not | :host
 * `required` | Set when the element is required | :host
 * `invalid` | Set when the element is invalid | :host
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 */
declare class CheckboxGroupElement extends ThemableMixin(DirMixin(HTMLElement)) {
  /**
   * The current disabled state of the checkbox group. True if group and all internal checkboxes are disabled.
   */
  disabled: boolean | null | undefined;

  /**
   * String used for the label element.
   */
  label: string | null | undefined;

  /**
   * Value of the checkbox group.
   * Note: toggling the checkboxes modifies the value by creating new
   * array each time, to override Polymer dirty-checking for arrays.
   * You can still use Polymer array mutation methods to update the value.
   */
  value: string[];

  /**
   * Error to show when the input value is invalid.
   * @attr {string} error-message
   */
  errorMessage: string | null | undefined;

  /**
   * String used for the helper text.
   * @attr {string} helper-text
   */
  helperText: string | null;

  /**
   * Specifies that the user must fill in a value.
   */
  required: boolean | null | undefined;

  /**
   * This property is set to true when the control value is invalid.
   */
  invalid: boolean;

  /**
   * Returns true if `value` is valid.
   *
   * @returns True if the value is valid.
   */
  validate(): boolean;

  _addCheckboxToValue(value: string): void;

  _removeCheckboxFromValue(value: string): void;

  _changeSelectedCheckbox(checkbox: CheckboxElement | null): void;

  _containsFocus(): boolean;

  _setFocused(focused: boolean): void;

  addEventListener<K extends keyof CheckboxGroupEventMap>(
    type: K,
    listener: (this: CheckboxGroupElement, ev: CheckboxGroupEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof CheckboxGroupEventMap>(
    type: K,
    listener: (this: CheckboxGroupElement, ev: CheckboxGroupEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-checkbox-group': CheckboxGroupElement;
  }
}

export { CheckboxGroupElement };
