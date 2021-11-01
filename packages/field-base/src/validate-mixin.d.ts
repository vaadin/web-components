/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Constructor } from '@open-wc/dedupe-mixin';

export declare class ValidateHost {
  /**
   * Set to true when the field is invalid.
   */
  invalid: boolean;

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
}

/**
 * A mixin to provide required state and validation logic.
 */
export declare function ValidateMixin<T extends Constructor<HTMLElement>>(
  base: T
): T & Constructor<ValidateHost> & Pick<typeof ValidateHost, keyof typeof ValidateHost>;
