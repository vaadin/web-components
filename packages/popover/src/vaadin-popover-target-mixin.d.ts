/**
 * @license
 * Copyright (c) 2024 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

/**
 * A mixin providing popover target functionality.
 */
export declare function PopoverTargetMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<PopoverTargetMixinClass> & T;

export declare class PopoverTargetMixinClass {
  /**
   * The id of the element to be used as `target` value.
   * The element should be in the DOM by the time when
   * the attribute is set, otherwise a warning is shown.
   */
  for: string | undefined;

  /**
   * Reference to the DOM element used both to trigger the overlay
   * by user interaction and to visually position it on the screen.
   *
   * Defaults to an element referenced with `for` attribute, in
   * which case it must be located in the same shadow scope.
   */
  target: HTMLElement | undefined;

  protected _addTargetListeners(target: HTMLElement): void;

  protected _removeTargetListeners(target: HTMLElement): void;
}
