/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';
import type { LabelMixinClass } from './label-mixin.js';
import type { ValidateMixinClass } from './validate-mixin.js';

/**
 * A mixin to provide common field logic: label, error message and helper text.
 */
export declare function FieldMixin<T extends Constructor<HTMLElement>>(
  superclass: T,
): Constructor<ControllerMixinClass> &
  Constructor<FieldMixinClass> &
  Constructor<LabelMixinClass> &
  Constructor<ValidateMixinClass> &
  T;

export declare class FieldMixinClass {
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
   * Error message to show when the field is invalid.
   *
   * @attr {string} error-message
   */
  errorMessage: string | null | undefined;

  protected readonly _errorNode: HTMLElement;

  protected readonly _helperNode?: HTMLElement;

  protected _helperTextChanged(helperText: string | null | undefined): void;

  protected _ariaTargetChanged(target: HTMLElement): void;

  protected _requiredChanged(required: boolean): void;

  protected _invalidChanged(invalid: boolean): void;
}
