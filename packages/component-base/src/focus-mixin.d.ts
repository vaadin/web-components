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

/**
 * A mixin to handle `focused` and `focus-ring` attributes based on focus.
 */
export declare function FocusMixin<T extends Constructor<HTMLElement>>(base: T): Constructor<FocusMixinClass> & T;

export declare class FocusMixinClass {
  protected readonly _keyboardActive: boolean;

  /**
   * Override to change how focused and focus-ring attributes are set.
   */
  protected _setFocused(focused: boolean): void;

  /**
   * Override to define if the field receives focus based on the event.
   */
  protected _shouldSetFocus(event: FocusEvent): boolean;

  /**
   * Override to define if the field loses focus based on the event.
   */
  protected _shouldRemoveFocus(event: FocusEvent): boolean;
}
