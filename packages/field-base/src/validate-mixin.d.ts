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
   * When true, automatic validation is disabled and the field can be only
   * validated programmatically by calling `validate()` method.
   *
   * @attr {boolean} manual-validation
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
