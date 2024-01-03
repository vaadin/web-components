/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

import type { Constructor } from '@open-wc/dedupe-mixin';

export declare function GridTreeColumnMixin<TItem, T extends Constructor<HTMLElement>>(
  superclass: T,
): Constructor<GridTreeColumnMixinClass<TItem>> & T;

export declare class GridTreeColumnMixinClass<TItem> {
  /**
   * JS Path of the property in the item used as text content for the tree toggle.
   */
  path: string | null | undefined;
}
