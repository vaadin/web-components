/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Constructor } from '@open-wc/dedupe-mixin';

export declare function SelectionMixin<TItem, T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<SelectionMixinClass<TItem>> & T;

export declare class SelectionMixinClass<TItem> {
  /**
   * An array that contains the selected items.
   */
  selectedItems: TItem[];

  /**
   * Selects the given item.
   *
   * @param item The item object
   */
  selectItem(item: TItem): void;

  /**
   * Deselects the given item if it is already selected.
   *
   * @param item The item object
   */
  deselectItem(item: TItem): void;
}
