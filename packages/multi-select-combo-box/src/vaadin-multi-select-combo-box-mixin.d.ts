/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Constructor } from '@open-wc/dedupe-mixin';

export type MultiSelectComboBoxCompactModeLabelGenerator<TItem> = (items: Array<TItem>) => string;

export declare function MultiSelectComboBoxMixin<TItem, T extends Constructor<HTMLElement>>(
  base: T
): T & Constructor<MultiSelectComboBoxMixinClass<TItem>>;

export declare class MultiSelectComboBoxMixinClass<TItem> {
  /**
   * When true, the component does not render tokens for every selected value.
   * Instead, only the number of currently selected items is shown.
   * @attr {boolean} compact-mode
   */
  compactMode: boolean;

  /**
   * Custom function for generating the display label when in compact mode.
   *
   * This function receives the array of selected items and should return
   * a string value that will be used as the display label.
   */
  compactModeLabelGenerator: MultiSelectComboBoxCompactModeLabelGenerator<TItem>;

  /**
   * A full set of items to filter the visible options from.
   * The items can be of either `String` or `Object` type.
   */
  items: Array<TItem> | undefined;

  /**
   * The item property used for a visual representation of the item.
   * @attr {string} item-label-path
   */
  itemLabelPath: string;
}
