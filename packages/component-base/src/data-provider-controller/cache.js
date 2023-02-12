/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

export class Cache {
  /**
   * @type {{ isExpanded: (item: unknown) => boolean }}
   */
  context;

  /**
   * The number of items.
   *
   * @type {number}
   */
  size = 0;

  /**
   * The number of items to display per page.
   *
   * @type {number}
   */
  pageSize;

  /**
   * An array of cached items.
   *
   * @type {object[]}
   */
  items = [];

  /**
   * A map where the key is a requested page and the value is a callback
   * that will be called with data once the request is complete.
   *
   * @type {Map<number, Function>}
   */
  pendingRequests = new Map();

  /**
   * A map where the key is the index of an item in the `items` array
   * and the value is a sub-cache associated with that item.
   *
   * Note, it's intentionally defined as an object instead of a Map
   * to ensure that Object.entries() returns an array with keys sorted
   * in alphabetical order, rather than the order they were added.
   *
   * @type {Record<number, Cache>}
   * @private
   */
  __subCacheByIndex = {};

  /**
   * The total number of items, including items from expanded sub-caches.
   *
   * @type {number}
   * @private
   */
  __effectiveSize = 0;

  /**
   * @param {Cache['context']} context
   * @param {number} pageSize
   * @param {number | undefined} size
   * @param {Cache | undefined} parentCache
   * @param {number | undefined} parentCacheIndex
   */
  constructor(context, pageSize, size, parentCache, parentCacheIndex) {
    this.context = context;
    this.pageSize = pageSize;
    this.size = size || 0;
    this.parentCache = parentCache;
    this.parentCacheIndex = parentCacheIndex;
    this.__effectiveSize = size || 0;
  }

  /**
   * An item in the parent cache that the current cache is associated with.
   *
   * @return {object | undefined}
   */
  get parentItem() {
    return this.parentCache && this.parentCache.items[this.parentCacheIndex];
  }

  /**
   * An array of sub-caches sorted in the same order as their associated items
   * appear in the `items` array.
   *
   * @return {Cache[]}
   */
  get subCaches() {
    return Object.values(this.__subCacheByIndex);
  }

  /**
   * Whether the cache or any of its descendant caches have pending requests.
   *
   * @return {boolean}
   */
  get isLoading() {
    if (this.pendingRequests.size > 0) {
      return true;
    }

    return this.subCaches.some((subCache) => subCache.isLoading);
  }

  /**
   * The total number of items, including items from expanded sub-caches.
   *
   * @return {number}
   */
  get effectiveSize() {
    return this.__effectiveSize;
  }

  /**
   * Recalculates the effective size for the cache and its descendant caches recursively.
   */
  recalculateEffectiveSize() {
    this.__effectiveSize =
      !this.parentItem || this.context.isExpanded(this.parentItem)
        ? this.size +
          this.subCaches.reduce((total, subCache) => {
            subCache.recalculateEffectiveSize();
            return total + subCache.effectiveSize;
          }, 0)
        : 0;
  }

  /**
   * Adds an array of items corresponding to the given page
   * to the `items` array.
   *
   * @param {number} page
   * @param {object[]} items
   */
  setPage(page, items) {
    const startIndex = page * this.pageSize;
    items.forEach((item, i) => {
      this.items[startIndex + i] = item;
    });
  }

  /**
   * Retrieves the sub-cache associated with the item at the given index
   * in the `items` array.
   *
   * @param {number} index
   * @return {Cache | undefined}
   */
  getSubCache(index) {
    return this.__subCacheByIndex[index];
  }

  /**
   * Removes the sub-cache associated with the item at the given index
   * in the `items` array.
   *
   * @param {number} index
   */
  removeSubCache(index) {
    delete this.__subCacheByIndex[index];
  }

  /**
   * Removes all sub-caches.
   */
  removeSubCaches() {
    this.__subCacheByIndex = {};
  }

  /**
   * Creates and associates a sub-cache for the item at the given index
   * in the `items` array.
   *
   * @param {number} index
   * @return {Cache}
   */
  createSubCache(index) {
    const subCache = new Cache(this.context, this.pageSize, 0, this, index);
    this.__subCacheByIndex[index] = subCache;
    return subCache;
  }

  /**
   * Retrieves the flattened index corresponding to the given index
   * of an item in the `items` array.
   *
   * @param {number} index
   * @return {number}
   */
  getFlatIndex(index) {
    const clampedIndex = Math.max(0, Math.min(this.size - 1, index));

    return this.subCaches.reduce((prev, subCache) => {
      const index = subCache.parentCacheIndex;
      return clampedIndex > index ? prev + subCache.effectiveSize : prev;
    }, clampedIndex);
  }
}
