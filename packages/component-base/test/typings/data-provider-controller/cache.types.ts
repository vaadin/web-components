import { Cache, type CacheContext } from '../../../src/data-provider-controller/cache.js';
import type { DataProviderCallback } from '../../../src/data-provider-controller/data-provider-controller.js';

const assertType = <TExpected>(actual: TExpected) => actual;

interface TestItem {
  foo: string;
}

const cacheContext: CacheContext<TestItem> = { isExpanded: (_item) => true };
const cache: Cache<TestItem> = new Cache<TestItem>(cacheContext, 1000, 50);

// Constructor
assertType<
  new <TItem>(
    context: CacheContext<TItem>,
    size: number,
    pageSize: number,
    parentCache?: Cache<TItem>,
    parentCacheIndex?: number,
  ) => void
>(Cache);

// Properties
assertType<number>(cache.size);
assertType<number>(cache.pageSize);
assertType<unknown[]>(cache.items);
assertType<boolean>(cache.isLoading);
assertType<unknown | undefined>(cache.parentItem);
assertType<Array<Cache<TestItem>>>(cache.subCaches);
assertType<Map<number, DataProviderCallback<TestItem>>>(cache.pendingRequests);

// Methods
assertType<(page: number, items: unknown[]) => void>(cache.setPage);
assertType<() => void>(cache.recalculateEffectiveSize);
assertType<(index: number) => number>(cache.getFlatIndex);
assertType<(index: number) => Cache<TestItem> | undefined>(cache.getSubCache);
assertType<(index: number) => void>(cache.removeSubCache);
assertType<(index: number) => Cache<TestItem>>(cache.createSubCache);
assertType<() => void>(cache.removeSubCaches);
