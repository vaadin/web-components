import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';

import { CustomFieldMixin } from './vaadin-custom-field-mixin.js';

import { CustomFieldEventMap } from './interfaces';

/**
 * `<vaadin-custom-field>` is a Web Component providing field wrapper functionality.
 *
 * ```
 * <vaadin-custom-field label="Appointment time">
 *   <vaadin-date-picker></vaadin-date-picker>
 *   <vaadin-time-picker></vaadin-time-picker>
 * </vaadin-custom-field>
 * ```
 *
 * ### Styling
 *
 * You may set the attribute `disabled` or `readonly` on this component to make the label styles behave the same
 * way as they would on a `<vaadin-text-field>` which is disabled or readonly.
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------------|----------------
 * `label` | The label element
 * `error-message` | The error message element
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description | Part name
 * -------------|-------------|------------
 * `has-label`  | Set when the field has a label | :host
 * `has-helper` | Set when the element has helper text or slot | :host
 * `has-error-message` | Set when the element has an error message, regardless if the field is valid or not | :host
 * `invalid`    | Set when the field is invalid | :host
 * `focused`    | Set when the field contains focus | :host
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @fires {Event} change - Fired when the user commits a value change for any of the internal inputs.
 * @fires {Event} internal-tab - Fired on Tab keydown triggered from the internal inputs, meaning focus will not leave the inputs.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 */
declare class CustomFieldElement extends ElementMixin(ThemableMixin(CustomFieldMixin(HTMLElement))) {
  /**
   * String used for the label element.
   */
  label: string;

  /**
   * The name of the control, which is submitted with the form data.
   */
  name: string | null | undefined;

  /**
   * Specifies that the user must fill in a value.
   */
  required: boolean | null | undefined;

  /**
   * The value of the field. When wrapping several inputs, it will contain `\t`
   * (Tab character) as a delimiter indicating parts intended to be used as the
   * corresponding inputs values. Use the [`i18n`](#/elements/vaadin-custom-field#property-i18n)
   * property to customize this behavior.
   */
  value: string | null | undefined;

  /**
   * This property is set to true when the control value is invalid.
   */
  invalid: boolean;

  /**
   * Error to show when the input value is invalid.
   * @attr {string} error-message
   */
  errorMessage: string;

  /**
   * String used for the helper text.
   * @attr {string} helper-text
   */
  helperText: string | null;

  /**
   * Returns true if `value` is valid.
   * `<iron-form>` uses this to check the validity or all its elements.
   *
   * @returns True if the value is valid.
   */
  validate(): boolean;

  /**
   * Returns true if the current inputs values satisfy all constraints (if any)
   */
  checkValidity(): boolean;

  addEventListener<K extends keyof CustomFieldEventMap>(
    type: K,
    listener: (this: CustomFieldElement, ev: CustomFieldEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof CustomFieldEventMap>(
    type: K,
    listener: (this: CustomFieldElement, ev: CustomFieldEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-custom-field': CustomFieldElement;
  }
}

export { CustomFieldElement };
