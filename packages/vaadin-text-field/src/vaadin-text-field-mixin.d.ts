import { TextFieldAutoCorrect, TextFieldAutoCapitalize } from './interfaces';

declare function TextFieldMixin<T extends new (...args: any[]) => {}>(base: T): T & TextFieldMixinConstructor;

interface TextFieldMixinConstructor {
  new (...args: any[]): TextFieldMixin;
}

interface TextFieldMixin {
  readonly focusElement: HTMLElement | null | undefined;

  readonly inputElement: HTMLElement | null | undefined;

  readonly _slottedTagName: string;

  /**
   * Whether the value of the control can be automatically completed by the browser.
   * List of available options at:
   * https://developer.mozilla.org/en/docs/Web/HTML/Element/input#attr-autocomplete
   */
  autocomplete: string | null | undefined;

  /**
   * This is a property supported by Safari that is used to control whether
   * autocorrection should be enabled when the user is entering/editing the text.
   * Possible values are:
   * on: Enable autocorrection.
   * off: Disable autocorrection.
   */
  autocorrect: TextFieldAutoCorrect | undefined;

  /**
   * This is a property supported by Safari and Chrome that is used to control whether
   * autocapitalization should be enabled when the user is entering/editing the text.
   * Possible values are:
   * characters: Characters capitalization.
   * words: Words capitalization.
   * sentences: Sentences capitalization.
   * none: No capitalization.
   */
  autocapitalize: TextFieldAutoCapitalize | undefined;

  /**
   * Specify that the value should be automatically selected when the field gains focus.
   */
  autoselect: boolean;

  /**
   * Set to true to display the clear icon which clears the input.
   * @attr {boolean} clear-button-visible
   */
  clearButtonVisible: boolean;

  /**
   * Error to show when the input value is invalid.
   * @attr {string} error-message
   */
  errorMessage: string;

  /**
   * Object with translated strings used for localization. Has
   * the following structure and default values:
   *
   * ```
   * {
   *   // Translation of the clear icon button accessible label
   *   clear: 'Clear'
   * }
   * ```
   */
  i18n: { clear: string };

  /**
   * String used for the label element.
   */
  label: string;

  /**
   * String used for the helper text.
   * @attr {string} helper-text
   */
  helperText: string | null;

  /**
   * Maximum number of characters (in Unicode code points) that the user can enter.
   */
  maxlength: number | null | undefined;

  /**
   * Minimum number of characters (in Unicode code points) that the user can enter.
   */
  minlength: number | null | undefined;

  /**
   * The name of the control, which is submitted with the form data.
   */
  name: string | null | undefined;

  /**
   * A hint to the user of what can be entered in the control.
   */
  placeholder: string | null | undefined;

  /**
   * This attribute indicates that the user cannot modify the value of the control.
   */
  readonly: boolean | null | undefined;

  /**
   * Specifies that the user must fill in a value.
   */
  required: boolean | null | undefined;

  /**
   * The initial value of the control.
   * It can be used for two-way data binding.
   */
  value: string;

  /**
   * This property is set to true when the control value is invalid.
   */
  invalid: boolean;

  /**
   * When set to true, user is prevented from typing a value that
   * conflicts with the given `pattern`.
   * @attr {boolean} prevent-invalid-input
   */
  preventInvalidInput: boolean | null | undefined;

  /**
   * A pattern matched against individual characters the user inputs.
   * When set, the field will prevent:
   * - `keyDown` events if the entered key doesn't match `/^_enabledCharPattern$/`
   * - `paste` events if the pasted text doesn't match `/^_enabledCharPattern*$/`
   * - `drop` events if the dropped text doesn't match `/^_enabledCharPattern*$/`
   *
   * For example, to enable entering only numbers and minus signs,
   * `_enabledCharPattern = "[\\d-]"`
   */
  _enabledCharPattern: string | null | undefined;

  _createConstraintsObserver(): void;

  _onChange(e: Event): void;

  _valueChanged(newVal: unknown | null, oldVal: unknown | null): void;

  _constraintsChanged(
    required: boolean | undefined,
    minlength: number | undefined,
    maxlength: string | undefined,
    pattern: any
  ): void;

  /**
   * Returns true if the current input value satisfies all constraints (if any)
   */
  checkValidity(): boolean;

  /**
   * Returns true if `value` is valid.
   *
   * @returns True if the value is valid.
   */
  validate(): boolean;

  clear(): void;

  _onKeyDown(e: KeyboardEvent): void;
}

export { TextFieldMixin, TextFieldMixinConstructor };
