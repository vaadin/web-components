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
