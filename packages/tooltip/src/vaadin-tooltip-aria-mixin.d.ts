/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

/**
 * A mixin providing linking of the tooltip content to the tooltip target
 * elements using the `aria-describedby` or `aria-labelledby` attribute.
 *
 * Targets in the same root as the tooltip are linked by the content element
 * ID. ID references only resolve within a single tree scope, so targets in
 * other roots are linked with ARIA element references instead.
 */
export declare function TooltipAriaMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<TooltipAriaMixinClass> & T;

export declare class TooltipAriaMixinClass {
  /**
   * Element used to link with the ARIA attribute controlled by the
   * `ariaLinkMode` property. Supports array of multiple elements.
   * When not set, defaults to `target`.
   */
  ariaTarget: HTMLElement | HTMLElement[] | null | undefined;

  /**
   * Controls which ARIA attribute is used to link the target element(s)
   * with the tooltip content. Supported values:
   *
   * - `aria-describedby` - links the tooltip as a description.
   * - `aria-labelledby` - links the tooltip as an accessible name.
   * - `none` - does not add any ARIA linking attribute.
   *
   * Defaults to `aria-describedby`.
   *
   * @attr {string} aria-link-mode
   */
  ariaLinkMode: 'aria-describedby' | 'aria-labelledby' | 'none';
}
