/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

/**
 * A mixin providing common form-item functionality.
 */
export declare function FormItemMixin<T extends Constructor<HTMLElement>>(base: T): Constructor<FormItemMixinClass> & T;

export declare class FormItemMixinClass {
  /**
   * Returns a target element to add ARIA attributes to for a field.
   *
   * - For Vaadin field components, the method returns an element
   * obtained through the `ariaTarget` property defined in `FieldMixin`.
   * - In other cases, the method returns the field element itself.
   */
  protected _getFieldAriaTarget(field: HTMLElement): HTMLElement;
}
