/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Constructor } from '@open-wc/dedupe-mixin';
import { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';
import { SlotMixinClass } from '@vaadin/component-base/src/slot-mixin.js';
import { LabelMixinClass } from './label-mixin.js';
import { ValidateMixinClass } from './validate-mixin.js';

/**
 * A mixin to provide common field logic: label, error message and helper text.
 */
export declare function FieldMixin<T extends Constructor<HTMLElement>>(
  superclass: T
): T &
  Constructor<ControllerMixinClass> &
  Constructor<FieldMixinClass> &
  Constructor<LabelMixinClass> &
  Constructor<SlotMixinClass> &
  Constructor<ValidateMixinClass>;

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

  protected _updateErrorMessage(invalid: boolean, errorMessage: string | null | undefined): void;

  protected _requiredChanged(required: boolean): void;

  protected _helperIdChanged(helperId: string): void;

  protected _invalidChanged(invalid: boolean): void;
}
