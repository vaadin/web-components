/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

/**
 * A mixin providing common functionality for making content collapsible,
 * used by `<vaadin-details>` and `<vaadin-accordion-panel>` elements.
 */
export declare function CollapsibleMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<CollapsibleMixinClass> & T;

export declare class CollapsibleMixinClass {
  /**
   * If true, the collapsible content is visible.
   */
  opened: boolean;

  /**
   * List of elements assigned to the default `<slot>`
   * that represent the collapsible content.
   */
  protected _contentElements: HTMLElement[];
}
