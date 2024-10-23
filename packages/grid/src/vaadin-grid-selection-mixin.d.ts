/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

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

  /**
   * A function to check whether a specific item in the grid may be
   * selected or deselected by the user. Used by the selection column to
   * conditionally enable to disable checkboxes for individual items. This
   * function does not prevent programmatic selection/deselection of
   * items. Changing the function does not modify the currently selected
   * items.
   *
   * Configuring this function hides the select all checkbox of the grid
   * selection column, which means users can not select or deselect all
   * items anymore, nor do they get feedback on whether all items are
   * selected or not.
   *
   * Receives an item instance and should return a boolean indicating
   * whether users may change the selection state of that item.
   *
   * @param item The item object
   * @return Whether the item is selectable
   */
  isItemSelectable: (item: TItem) => boolean;
}
