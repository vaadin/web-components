/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Constructor } from '@open-wc/dedupe-mixin';

export declare function MultiSelectComboBoxMixin<TItem, T extends Constructor<HTMLElement>>(
  base: T
): T & Constructor<MultiSelectComboBoxMixinClass<TItem>>;

export declare class MultiSelectComboBoxMixinClass<TItem> {
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
