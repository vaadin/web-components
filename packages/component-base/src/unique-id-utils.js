/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */

let uniqueId = 0;

/**
 * Resets the unique id counter.
 *
 * @return {void}
 */
export function resetUniqueId() {
  uniqueId = 0;
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
