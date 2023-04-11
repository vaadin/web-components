/**
 * @license
 * Copyright (c) 2000 - 2023 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { Constructor } from '@open-wc/dedupe-mixin';

export declare function SelectionMixin<TItem, T extends Constructor<HTMLElement>>(
  base: T,
): T & Constructor<SelectionMixinClass<TItem>>;

export declare class SelectionMixinClass<TItem> {
  /**
   * An array that contains the selected items.
   */
  selectedItems: Array<TItem>;

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
