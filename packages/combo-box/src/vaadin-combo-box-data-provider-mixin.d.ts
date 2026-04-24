/**
 * @license
 * Copyright (c) 2015 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

export type ComboBoxDataProviderCallback<TItem> = (items: TItem[], size?: number) => void;

export interface ComboBoxDataProviderParams {
  page: number;
  pageSize: number;
  filter: string;
}

export type ComboBoxDataProvider<TItem> = (
  params: ComboBoxDataProviderParams,
  callback: ComboBoxDataProviderCallback<TItem>,
) => void;

export declare function ComboBoxDataProviderMixin<TItem, T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ComboBoxDataProviderMixinClass<TItem>> & T;

export declare class ComboBoxDataProviderMixinClass<TItem> {
  /**
   * Number of items fetched at a time from the dataprovider.
   * @attr {number} page-size
   */
  pageSize: number;

  /**
   * Total number of items.
   */
  size: number | undefined;

  /**
   * Function that provides items lazily. Receives arguments `params`, `callback`
   *
   * `params.page` Requested page index
   *
   * `params.pageSize` Current page size
   *
   * `params.filter` Currently applied filter
   *
   * `callback(items, size)` Callback function with arguments:
   *   - `items` Current page of items
   *   - `size` Total number of items.
   */
  dataProvider: ComboBoxDataProvider<TItem> | null | undefined;

  /**
   * Clears the cached pages and reloads data from dataprovider when needed.
   */
  clearCache(): void;

  /**
   * Scrolls the dropdown to the item at the given index and sets it as the
   * focused (highlighted) item. Safe to call before the dropdown is opened
   * or while the data provider is loading: the call is queued and executed
   * once the overlay is open and not loading.
   *
   * Because this sets the focused item, closing the dropdown without an
   * explicit selection change (e.g. via outside click or blur) will commit
   * the focused item as `selectedItem`. In the typical use case (scroll to
   * the currently selected item) this is a no-op; callers scrolling to a
   * different index should be aware of this behavior.
   *
   * @param index Index of the item to scroll to
   */
  scrollToIndex(index: number): void;
}
