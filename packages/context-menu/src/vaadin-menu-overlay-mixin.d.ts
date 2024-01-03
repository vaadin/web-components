/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { OverlayFocusMixinClass } from '@vaadin/overlay/src/vaadin-overlay-focus-mixin.js';
import type { PositionMixinClass } from '@vaadin/overlay/src/vaadin-overlay-position-mixin.js';

export declare function MenuOverlayMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<MenuOverlayMixinClass> & Constructor<OverlayFocusMixinClass> & Constructor<PositionMixinClass> & T;

export declare class MenuOverlayMixinClass {
  protected readonly parentOverlay: HTMLElement | undefined;

  /**
   * Returns the adjusted boundaries of the overlay.
   */
  getBoundaries(): { xMax: number; xMin: number; yMax: number };

  /**
   * Returns the first element in the overlay content.
   */
  getFirstChild(): HTMLElement;
}
