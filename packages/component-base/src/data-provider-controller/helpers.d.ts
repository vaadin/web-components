/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * Returns context for the given flattened index, including:
 * - the corresponding cache
 * - the associated item (if loaded)
 * - the corresponding index in the cache's items array.
 * - the page containing the index.
 * - the cache level
 */
export function getFlatIndexContext(
  cache: Cache,
  flatIndex: number,
  level: number,
): {
  cache: Cache;
  item: unknown | undefined;
  index: number;
  page: number;
  level: number;
};

/**
 * Returns context for the given flattened index, including:
 * - the corresponding cache
 * - the associated item (if loaded)
 * - the corresponding index in the cache's items array.
 * - the page containing the index.
 * - the cache level
 *
 * If no item with the given id is found, the method returns undefined.
 */
export function getItemContext(
  context: { itemId(id: unknown): boolean },
  cache: Cache,
  itemId: number,
  level: number,
  levelFlatIndex: number,
):
  | {
      level: number;
      item: unknown | undefined;
      index: number;
      page: number;
      flatIndex: number;
      cache: Cache;
      subCache: Cache | undefined;
    }
  | undefined;

/**
 * Recursively returns the globally flat index of the item the given indexes point to.
 * Each index in the array points to a sub-item of the previous index.
 * Using `Infinity` as an index will point to the last item on the level.
 */
export function getFlatIndexByPath(cache: Cache, path: number[], flatIndex: number): number;
