/**
 * @license
 * Copyright (c) 2015 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { ComboBoxItemRenderer } from './vaadin-combo-box-item-mixin.js';

export declare function ComboBoxScrollerMixin<TItem, TOwner, T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ComboBoxScrollerMixinClass<TItem, TOwner>> & T;

export declare class ComboBoxScrollerMixinClass<TItem, TOwner> {
  /**
   * Index of an item that has focus outline and is scrolled into view.
   * The actual focus still remains in the input field.
   */
  focusedIndex: number;

  /**
   * Path for the id of the item, used to detect whether the item is selected.
   */
  itemIdPath: string | null | undefined;

  /**
   * A full set of items to filter the visible options from.
   * Set to an empty array when combo-box is not opened.
   */
  items: TItem[];

  /**
   * Set to true while combo-box fetches new page from the data provider.
   */
  loading: boolean;

  /**
   * Whether the combo-box is currently opened or not. If set to false,
   * calling `scrollIntoView` does not have any effect.
   */
  opened: boolean;

  /**
   * Reference to the owner (combo-box owner), used by the item elements.
   */
  owner: TOwner;

  /**
   * Set true to prevent the overlay from opening automatically.
   * @attr {boolean} auto-open-disabled
   */
  renderer: ComboBoxItemRenderer<TItem, TOwner> | null | undefined;

  /**
   * The selected item from the `items` array.
   */
  selectedItem: TItem;

  /**
   * Used to propagate the `theme` attribute from the host element.
   */
  theme: string;

  /**
   * Function used to set a label for every combo-box item.
   */
  getItemLabel: (item: TItem) => string;

  /**
   * Requests an update for the virtualizer to re-render items.
   */
  requestContentUpdate(): void;

  /**
   * Scrolls an item at given index into view and adjusts `scrollTop`
   * so that the element gets fully visible on Arrow Down key press.
   */
  scrollIntoView(index: number): void;

  protected _isItemSelected(item: TItem, selectedItem: TItem, itemIdPath: string | null | undefined): void;

  protected _updateElement(el: HTMLElement, index: number): void;
}
