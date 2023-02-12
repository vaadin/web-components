/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * Retreives information for the given flattened index, including:
 * - the corresponding cache
 * - the associated item (if loaded)
 * - the corresponding index in the cache's items array.
 * - the page containing the index.
 * - the cache level
 *
 * @param {import('./cache.js').Cache} cache
 * @param {number} flatIndex
 * @return {{ cache: Cache, item: object | undefined, index: number, page: number, level: number }}
 */
export function getFlatIndexContext(cache, flatIndex, level = 0) {
  let levelIndex = flatIndex;

  for (const subCache of cache.subCaches) {
    const index = subCache.parentCacheIndex;
    if (levelIndex <= index) {
      break;
    } else if (levelIndex <= index + subCache.effectiveSize) {
      return getFlatIndexContext(subCache, levelIndex - index - 1, level + 1);
    }
    levelIndex -= subCache.effectiveSize;
  }

  return {
    cache,
    item: cache.items[levelIndex],
    index: levelIndex,
    page: Math.floor(levelIndex / cache.pageSize),
    level,
  };
}

/**
 * Recursively returns the globally flat index of the item the given indexes point to.
 * Each index in the array points to a sub-item of the previous index.
 * Using `Infinity` as an index will point to the last item on the level.
 *
 * @param {!ItemCache} cache
 * @param {!Array<number>} indexes
 * @param {number} flatIndex
 * @return {number}
 */
export function getFlatIndexByPath(cache, [levelIndex, ...subIndexes], flatIndex = 0) {
  if (levelIndex === Infinity) {
    // Treat Infinity as the last index on the level
    levelIndex = cache.size - 1;
  }

  const flatIndexOnLevel = cache.getFlatIndex(levelIndex);
  const subCache = cache.getSubCache(levelIndex);
  if (subCache && subCache.effectiveSize > 0 && subIndexes.length) {
    return getFlatIndexByPath(subCache, subIndexes, flatIndex + flatIndexOnLevel + 1);
  }
  return flatIndex + flatIndexOnLevel;
}
