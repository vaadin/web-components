/**
 * @license
 * Copyright (c) 2015 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { ComboBoxBaseMixinClass } from './vaadin-combo-box-base-mixin.js';

export type ComboBoxPartialMatchMode = 'first-match' | 'none' | 'only-match';

export declare function ComboBoxItemsMixin<TItem, T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ComboBoxBaseMixinClass> & Constructor<ComboBoxItemsMixinClass<TItem>> & T;

export declare class ComboBoxItemsMixinClass<TItem> {
  /**
   * Controls which item is automatically set to be selected, for
   * example on Enter, when the typed filter only partially matches
   * its label. The item that will be selected is highlighted in the
   * dropdown while typing:
   *
   * - `none` (default): an item is automatically set to be selected only when the filter matches its label exactly.
   * - `first-match`: the first item in the filtered results is automatically set to be selected.
   * - `only-match`: the item is automatically set to be selected when filtering narrows the results to a single item.
   *
   * In general, an exact match is always set to be selected and takes
   * precedence over partial matches, regardless of the mode.
   *
   * A partial match is only applied while the dropdown is open. For
   * example, when auto-open is disabled with `autoOpenDisabled`, typing
   * does not highlight a match or set it to be selected until the
   * dropdown is opened.
   *
   * This feature cannot be used together with custom values, because a
   * partial match is also a valid custom value. A partial match is not
   * applied when custom values are allowed with `allowCustomValue`.
   *
   * @attr {none|first-match|only-match} partial-match-mode
   */
  partialMatchMode: ComboBoxPartialMatchMode;

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
