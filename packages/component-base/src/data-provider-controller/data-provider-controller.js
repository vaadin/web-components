/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Cache } from './cache.js';
import { getFlatIndexByPath, getFlatIndexContext } from './helpers.js';

/**
 * A controller that stores and manages items loaded with a data provider callback.
 */
export class DataProviderController extends EventTarget {
  /**
   * A callback that returns data based on the passed params such as
   * `page`, `pageSize`, `parentItem`, etc.
   *
   * @type {(params: object, callback: Function) => void}
   */
  dataProvider;

  /**
   * A number of items in the root cache.
   *
   * @type {number}
   */
  size;

  /**
   * A number of items to display per page.
   *
   * @type {number}
   */
  pageSize;

  /**
   * A function that determines when an item is expanded.
   *
   * @type {(item: unknown) => boolean}
   */
  isExpanded;

  constructor(host, { size, pageSize, isExpanded, dataProvider, dataProviderParams }) {
    super();
    this.host = host;
    this.size = size;
    this.pageSize = pageSize;
    this.isExpanded = isExpanded;
    this.dataProvider = dataProvider;
    this.dataProviderParams = dataProviderParams;
    this.rootCache = this.__createRootCache();
  }

  /**
   * The total number of items, including items from expanded sub-caches.
   */
  get effectiveSize() {
    return this.rootCache.effectiveSize;
  }

  /** @private */
  get __cacheContext() {
    return { isExpanded: this.isExpanded };
  }

  /**
   * Whether the root cache or any of its decendant caches have pending requests.
   *
   * @return {boolean}
   */
  isLoading() {
    return this.rootCache.isLoading;
  }

  /**
   * Sets the size for the root cache and recalculates the effective size.
   *
   * @param {number} size
   */
  setSize(size) {
    this.size = size;
    this.rootCache.size = size;
    this.recalculateEffectiveSize();
  }

  /**
   * Sets the page size and clears the cache.
   *
   * @param {number} pageSize
   */
  setPageSize(pageSize) {
    this.pageSize = pageSize;
    this.clearCache();
  }

  /**
   * Sets the data provider callback and clears the cache.
   *
   * @type {Function}
   */
  setDataProvider(dataProvider) {
    this.dataProvider = dataProvider;
    this.clearCache();
  }

  /**
   * Recalculates the effective size.
   */
  recalculateEffectiveSize() {
    this.rootCache.recalculateEffectiveSize();
  }

  /**
   * Clears the cache.
   */
  clearCache() {
    this.rootCache = this.__createRootCache();
  }

  /**
   * Returns context for the given flattened index, including:
   * - the corresponding cache
   * - the associated item (if loaded)
   * - the corresponding index in the cache's items array.
   * - the page containing the index.
   * - the cache level
   */
  getFlatIndexContext(flatIndex) {
    return getFlatIndexContext(this.rootCache, flatIndex);
  }

  /**
   * Returns the flattened index for the item that the given indexes point to.
   * Each index in the path array points to a sub-item of the previous index.
   * Using `Infinity` as an index will point to the last item on the level.
   *
   * @param {number[]} path
   * @return {number}
   */
  getFlatIndexByPath(path) {
    return getFlatIndexByPath(this.rootCache, path);
  }

  /**
   * Requests the data provider to load the page with the item corresponding
   * to the given flattened index into the corresponding cache.
   * If the item is already loaded, the method returns immediatelly.
   *
   * @param {number} flatIndex
   */
  ensureFlatIndexLoaded(flatIndex) {
    const { cache, page, item } = this.getFlatIndexContext(flatIndex);

    if (!item) {
      this.__loadCachePage(cache, page);
    }
  }

  /**
   * Creates a sub-cache for the item corresponding to the given flattened index and
   * requests the data provider to load the first page into the created sub-cache.
   * If the sub-cache already exists, the method returns immediatelly.
   *
   * @param {number} flatIndex
   */
  ensureFlatIndexHierarchy(flatIndex) {
    const { cache, item, index } = this.getFlatIndexContext(flatIndex);

    if (item && this.isExpanded(item) && !cache.getSubCache(index)) {
      const subCache = cache.createSubCache(index);
      this.__loadCachePage(subCache, 0);
    }
  }

  /**
   * Loads the first page into the root cache.
   */
  loadFirstPage() {
    this.__loadCachePage(this.rootCache, 0);
  }

  /** @private */
  __createRootCache() {
    return new Cache(this.__cacheContext, this.pageSize, this.size);
  }

  /** @private */
  __loadCachePage(cache, page) {
    if (!this.dataProvider || cache.pendingRequests.has(page)) {
      return;
    }

    const params = {
      page,
      pageSize: this.pageSize,
      parentItem: cache.parentItem,
      ...this.dataProviderParams(),
    };

    const callback = (items, size) => {
      if (size !== undefined) {
        cache.size = size;
      } else if (params.parentItem) {
        cache.size = items.length;
      }

      cache.setPage(page, items);

      this.recalculateEffectiveSize();

      this.dispatchEvent(new CustomEvent('page-received'));

      cache.pendingRequests.delete(page);

      this.dispatchEvent(new CustomEvent('page-loaded'));
    };

    cache.pendingRequests.set(page, callback);

    this.dispatchEvent(new CustomEvent('page-requested'));

    this.dataProvider(params, callback);
  }
}
