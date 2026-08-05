/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { LabelMixinClass } from './label-mixin.js';
import type { ValidateMixinClass } from './validate-mixin.js';

/**
 * A mixin to provide common field logic: label, error message and helper text.
 */
export declare function FieldMixin<T extends Constructor<HTMLElement>>(
  superclass: T,
): Constructor<FieldMixinClass> & Constructor<LabelMixinClass> & Constructor<ValidateMixinClass> & T;

export declare class FieldMixinClass {
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

  /**
   * String used to label the component for screen reader users.
   *
   * @attr {string} accessible-name
   */
  accessibleName: string | null | undefined;

  /**
   * A space-separated list of IDs referencing the elements that
   * label the component for screen reader users.
   *
   * @attr {string} accessible-name-ref
   */
  accessibleNameRef: string | null | undefined;

  /**
   * A space-separated list of IDs referencing the elements that
   * describe the component for screen reader users. The referenced
   * elements are announced in addition to the helper text and
   * the error message.
   *
   * @attr {string} accessible-description-ref
   */
  accessibleDescriptionRef: string | null | undefined;

  /**
   * A target element to which ARIA attributes are set.
   */
  protected ariaTarget: HTMLElement;

  protected readonly _errorNode: HTMLElement;

  protected readonly _helperNode?: HTMLElement;
}
