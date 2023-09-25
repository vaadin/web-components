import { Cache, type CacheContext } from '../../../src/data-provider-controller/cache.js';
import type { DataProviderCallback } from '../../../src/data-provider-controller/data-provider-controller.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const cache: Cache = new Cache({ isExpanded: (_item) => true }, 1000, 50);

// Constructor
assertType<
  new (context: CacheContext, size: number, pageSize: number, parentCache?: Cache, parentCacheIndex?: number) => void
>(Cache);

// Properties
assertType<number>(cache.size);
assertType<number>(cache.pageSize);
assertType<unknown[]>(cache.items);
assertType<boolean>(cache.isLoading);
assertType<unknown | undefined>(cache.parentItem);
assertType<Cache[]>(cache.subCaches);
assertType<Map<number, DataProviderCallback>>(cache.pendingRequests);

// Methods
assertType<(page: number, items: unknown[]) => void>(cache.setPage);
assertType<() => void>(cache.recalculateEffectiveSize);
assertType<(index: number) => number>(cache.getFlatIndex);
assertType<(index: number) => Cache | undefined>(cache.getSubCache);
assertType<(index: number) => void>(cache.removeSubCache);
assertType<(index: number) => Cache>(cache.createSubCache);
assertType<() => void>(cache.removeSubCaches);
