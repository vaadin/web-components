/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

export declare function OverlayStackMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<OverlayStackMixinClass> & T;

export declare class OverlayStackMixinClass {
  /**
   * Returns true if this is the last one in the opened overlays stack.
   */
  protected readonly _last: boolean;

  /**
   * Brings the overlay as visually the frontmost one.
   */
  bringToFront(): void;
}
