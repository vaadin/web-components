/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { LabelMixin } from './label-mixin.js';
import { ValidateMixin } from './validate-mixin.js';

/**
 * A mixin to provide common field logic: label, error message and helper text.
 */
declare function FieldMixin<T extends new (...args: any[]) => {}>(base: T): T & FieldMixinConstructor;

interface FieldMixinConstructor {
  new (...args: any[]): FieldMixin;
}

interface FieldMixin extends LabelMixin, ValidateMixin {
  /**
   * A target element to which ARIA attributes are set.
   */
  ariaTarget: HTMLElement;

  /**
   * String used for the helper text.
   *
   * @attr {string} helper-text
   */
  helperText: string | null | undefined;

  /**
   * Error to show when the field is invalid.
   *
   * @attr {string} error-message
   */
  errorMessage: string;
}

export { FieldMixin, FieldMixinConstructor };
