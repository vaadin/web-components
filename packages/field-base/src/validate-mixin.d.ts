/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

/**
 * A mixin to provide required state and validation logic.
 */
export declare function ValidateMixin<T extends Constructor<HTMLElement>>(base: T): Constructor<ValidateMixinClass> & T;

export declare class ValidateMixinClass {
  /**
   * Set to true when the field is invalid.
   */
  invalid: boolean;

  /**
   * Set to true to enable manual validation mode. In this mode, automatic constraint
   * validation is disabled, allowing you to control the validation process by yourself.
   * The field can still be validated programmatically by calling the `validate()` method.
   * To check the validity without changing the invalid state, use the `checkValidity()` method.
   * This mode also allows you to manipulate the `invalid` property directly without getting
   * conflicts with the built-in constraint validation.
   */
  manualValidation: boolean;

  /**
   * Specifies that the user must fill in a value.
   */
  required: boolean;

  /**
   * Returns true if field is valid, and sets `invalid` based on the field validity.
   */
  validate(): boolean;

  /**
   * Returns true if the field value satisfies all constraints (if any).
   */
  checkValidity(): boolean;

  protected _requestValidation(): void;
}
