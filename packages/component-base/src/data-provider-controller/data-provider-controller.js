/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Cache } from './cache.js';
import { getFlatIndexByPath, getFlatIndexContext } from './helpers.js';

export class DataProviderController extends EventTarget {
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

  get effectiveSize() {
    return this.rootCache.effectiveSize;
  }

  /** @private */
  get __cacheContext() {
    return { isExpanded: this.isExpanded };
  }

  isLoading() {
    return this.rootCache.isLoading;
  }

  setSize(size) {
    this.size = size;
    this.rootCache.size = size;
    this.recalculateEffectiveSize();
  }

  setPageSize(pageSize) {
    this.pageSize = pageSize;
    this.clearCache();
  }

  setDataProvider(dataProvider) {
    this.dataProvider = dataProvider;
    this.clearCache();
  }

  recalculateEffectiveSize() {
    this.rootCache.recalculateEffectiveSize();
  }

  clearCache() {
    this.rootCache = this.__createRootCache();
  }

  getFlatIndexContext(flatIndex) {
    return getFlatIndexContext(this.rootCache, flatIndex);
  }

  getFlatIndexByPath(path) {
    return getFlatIndexByPath(this.rootCache, path);
  }

  ensureFlatIndexLoaded(flatIndex) {
    const { cache, page, item } = this.getFlatIndexContext(flatIndex);

    if (!item) {
      this.__loadCachePage(cache, page);
    }
  }

  ensureFlatIndexHierarchy(flatIndex) {
    const { cache, item, index } = this.getFlatIndexContext(flatIndex);

    if (item && this.isExpanded(item) && !cache.getSubCache(index)) {
      const subCache = cache.createSubCache(index);
      this.__loadCachePage(subCache, 0);
    }
  }

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
