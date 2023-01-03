/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

/**
 * A mixin that forwards CSS class names to the internal overlay element
 * by setting the `overlayClass` property or `overlay-class` attribute.
 */
export declare function OverlayClassMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<OverlayClassMixinClass> & T;

export declare class OverlayClassMixinClass {
  /**
   * A space-delimited list of CSS class names to set on the overlay element.
   * This property does not affect other CSS class names set manually via JS.
   *
   * @attr {string} overlay-class
   */
  overlayClass: string;

  /**
   * An overlay element on which CSS class names are set.
   */
  protected _overlayElement: HTMLElement;
}
