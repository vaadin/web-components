/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Cache } from './cache.js';
import type { DataProviderCallback, DataProviderController } from './data-provider-controller.js';

type CacheContext = { isExpanded: DataProviderController['isExpanded'] };

/**
 * A class that stores items with their associated sub-caches.
 */
export class Cache {
  /**
   * A context object.
   */
  context: CacheContext;

  /**
   * The number of items.
   */
  size: number;

  /**
   * The number of items to display per page.
   */
  pageSize: number;

  /**
   * An array of cached items.
   */
  items: unknown[];

  /**
   * A map where the key is a requested page and the value is a callback
   * that will be called with data once the request is complete.
   */
  pendingRequests: Map<number, DataProviderCallback>;

  /**
   * An item in the parent cache that the current cache is associated with.
   */
  get parentItem(): unknown | undefined;

  /**
   * An array of sub-caches sorted in the same order as their associated items
   * appear in the `items` array.
   */
  get subCaches(): Cache[];

  /**
   * Whether the cache or any of its descendant caches have pending requests.
   */
  get isLoading(): boolean;

  /**
   * The total number of items, including items from expanded sub-caches.
   */
  get effectiveSize(): number;

  constructor(
    context: CacheContext,
    pageSize: number,
    size: number,
    parentCache: Cache | undefined,
    parentCacheIndex: number | undefined,
  ): void;

  /**
   * Recalculates the effective size for the cache and its descendant caches recursively.
   */
  recalculateEffectiveSize(): void;

  /**
   * Adds an array of items corresponding to the given page
   * to the `items` array.
   */
  setPage(page: number, items: unknown[]): void;

  /**
   * Retrieves the sub-cache associated with the item at the given index
   * in the `items` array.
   */
  getSubCache(index: number): Cache | undefined;

  /**
   * Removes the sub-cache associated with the item at the given index
   * in the `items` array.
   */
  removeSubCache(index: number): void;

  /**
   * Removes all sub-caches.
   */
  removeSubCaches(): void;

  /**
   * Creates and associates a sub-cache for the item at the given index
   * in the `items` array.
   */
  createSubCache(index: number): Cache;

  /**
   * Retrieves the flattened index corresponding to the given index
   * of an item in the `items` array.
   */
  getFlatIndex(index: number): number;
}
