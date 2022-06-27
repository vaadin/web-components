/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

let uniqueId = 0;

let keyIdMap = {};

/**
 * Resets the unique id counter.
 *
 * @return {void}
 */
export function resetUniqueId() {
  uniqueId = 0;
  keyIdMap = {};
}

/**
 * Returns a unique integer id.
 *
 * @return {number}
 */
export function generateUniqueId() {
  // eslint-disable-next-line no-plusplus
  return uniqueId++;
}

/**
 * Returns a unique integer id.
 *
 * @param {string} key
 * @return {number}
 */
export function generateIdForKey(key) {
  const nextId = keyIdMap[key] === undefined ? 0 : keyIdMap[key] + 1;
  keyIdMap[key] = nextId;
  return nextId;
}
