/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { InputFieldMixin } from './input-field-mixin.js';
import { PatternMixin } from './pattern-mixin.js';

/**
 * A mixin to provide validation constraints for vaadin-text-field and related components.
 */
declare function TextFieldMixin<T extends new (...args: any[]) => {}>(base: T): T & TextFieldMixinConstructor;

interface TextFieldMixinConstructor {
  new (...args: any[]): TextFieldMixin;
}

interface TextFieldMixin extends InputFieldMixin, PatternMixin {
  /**
   * Maximum number of characters (in Unicode code points) that the user can enter.
   */
  maxlength: number | null | undefined;

  /**
   * Minimum number of characters (in Unicode code points) that the user can enter.
   */
  minlength: number | null | undefined;

  /**
   * Returns true if the current input value satisfies all constraints (if any).
   */
  checkValidity(): boolean;
}

export { TextFieldMixin, TextFieldMixinConstructor };
