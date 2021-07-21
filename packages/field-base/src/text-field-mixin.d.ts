/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { InputFieldMixin } from './input-field-mixin.js';

/**
 * A mixin to provide validation constraints for vaadin-text-field and related components.
 */
declare function TextFieldMixin<T extends new (...args: any[]) => {}>(base: T): T & TextFieldMixinConstructor;

interface TextFieldMixinConstructor {
  new (...args: any[]): TextFieldMixin;
}

interface TextFieldMixin extends InputFieldMixin {
  /**
   * Maximum number of characters (in Unicode code points) that the user can enter.
   */
  maxlength: number | null | undefined;

  /**
   * Minimum number of characters (in Unicode code points) that the user can enter.
   */
  minlength: number | null | undefined;

  /**
   * A regular expression that the value is checked against.
   * The pattern must match the entire value, not just some subset.
   */
  pattern: string | null | undefined;

  /**
   * When set to true, user is prevented from typing a value that
   * conflicts with the given `pattern`.
   * @attr {boolean} prevent-invalid-input
   */
  preventInvalidInput: boolean | null | undefined;

  /**
   * Returns true if the current input value satisfies all constraints (if any).
   */
  checkValidity(): boolean;
}

export { TextFieldMixin, TextFieldMixinConstructor };
