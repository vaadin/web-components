/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { VirtualListDefaultItem } from './vaadin-virtual-list.js';

export declare function VirtualListSelectionMixin<TItem, T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<TItem> & T;

export declare class VirtualListSelectionMixinClass<TItem = VirtualListDefaultItem> {
  /**
   * Selection mode for the virtual list. Available modes are: `single` and `multi`.
   */
  selectionMode?: 'single' | 'multi';

  /**
   * Path to an item sub-property that identifies the item.
   * @attr {string} item-id-path
   */
  itemIdPath: string | null | undefined;

  /**
   * An array that contains the selected items.
   */
  selectedItems: TItem[];

  /**
   * A function that generates accessible names for virtual list items.
   */
  itemAccessibleNameGenerator?: (item: TItem) => string;
}
