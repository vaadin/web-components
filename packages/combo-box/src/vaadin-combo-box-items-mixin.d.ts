/**
 * @license
 * Copyright (c) 2015 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { ComboBoxBaseMixinClass } from './vaadin-combo-box-base-mixin.js';

export type ComboBoxAutoSelectMode = 'exact-match' | 'first-match' | 'single-match';

export declare function ComboBoxItemsMixin<TItem, T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ComboBoxBaseMixinClass> & Constructor<ComboBoxItemsMixinClass<TItem>> & T;

export declare class ComboBoxItemsMixinClass<TItem> {
  /**
   * Controls which item is selected when committing the value while
   * a filter is typed, for example on blur, Enter press, or outside click:
   *
   * - `exact-match` (default): select an item only if its label matches the filter exactly.
   * - `first-match`: select the first matching item, giving preference to an exact match.
   * - `single-match`: select the matching item only if there is exactly one.
   *
   * Matching is case-insensitive. The item to be selected is highlighted
   * in the dropdown while typing. Auto-selection is not performed when
   * the filter is empty or when `allowCustomValue` is enabled.
   * @attr {exact-match|first-match|single-match} auto-select-mode
   */
  autoSelectMode: ComboBoxAutoSelectMode;

  /**
   * A full set of items to filter the visible options from.
   * The items can be of either `String` or `Object` type.
   */
  items: TItem[] | undefined;

  /**
   * A subset of items, filtered based on the user input. Filtered items
   * can be assigned directly to omit the internal filtering functionality.
   * The items can be of either `String` or `Object` type.
   */
  filteredItems: TItem[] | undefined;

  /**
   * Filtering string the user has typed into the input field.
   */
  filter: string;

  /**
   * A function that is used to generate the label for dropdown
   * items based on the item. Receives one argument:
   * - `item` The item to generate the label for.
   */
  itemLabelGenerator: ((item: TItem) => string) | undefined;

  /**
   * Path for label of the item. If `items` is an array of objects, the
   * `itemLabelPath` is used to fetch the displayed string label for each
   * item.
   *
   * The item label is also used for matching items when processing user
   * input, i.e., for filtering and selecting items.
   * @attr {string} item-label-path
   */
  itemLabelPath: string;

  /**
   * Path for the value of the item. If `items` is an array of objects, the
   * `itemValuePath:` is used to fetch the string value for the selected
   * item.
   *
   * The item value is used in the `value` property of the combo box,
   * to provide the form value.
   * @attr {string} item-value-path
   */
  itemValuePath: string;
}
