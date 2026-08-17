/**
 * @license
 * Copyright (c) 2015 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { ComboBoxBaseMixinClass } from './vaadin-combo-box-base-mixin.js';

export type ComboBoxAutoFocusPartialMatch = 'first-match' | 'none' | 'only-match';

export declare function ComboBoxItemsMixin<TItem, T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ComboBoxBaseMixinClass> & Constructor<ComboBoxItemsMixinClass<TItem>> & T;

export declare class ComboBoxItemsMixinClass<TItem> {
  /**
   * Controls whether an item whose label partially matches the typed
   * filter is automatically focused. The focused item is highlighted
   * in the dropdown while typing and is selected when committing the
   * value, for example on blur, Enter press, or outside click:
   *
   * - `none` (default): do not focus partial matches.
   * - `first-match`: focus the first item in the filtered results.
   * - `only-match`: focus the item when filtering narrows the results to a single item.
   *
   * An item whose label matches the filter exactly is always focused,
   * regardless of this property. Matching is case-insensitive. A partial
   * match is not focused when `allowCustomValue` is enabled.
   *
   * @attr {none|first-match|only-match} auto-focus-partial-match
   */
  autoFocusPartialMatch: ComboBoxAutoFocusPartialMatch;

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
