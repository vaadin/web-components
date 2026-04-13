/**
 * @license
 * Copyright (c) 2025 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
let writeQueue = [];

function matchesFilter(entry, element, id) {
  if (!element) {
    return true;
  }
  if (element && entry.element !== element) {
    return false;
  }
  if (id && entry.id !== id) {
    return false;
  }
  return true;
}

/**
 * Flushes pending DOM write callbacks, executing and removing them from the queue.
 * When called without arguments, flushes all pending writes. When called with
 * an element, only flushes writes for that element. The `id` option further
 * narrows the match to a specific write within the element.
 *
 * @param {HTMLElement} [element] - If provided, only flush writes scheduled for this element.
 * @param {{ id: string }} [options] - If provided, only flush writes with a matching id.
 */
export function flushWrites(element, options = {}) {
  const { id } = options;

  const entries = [];
  writeQueue = writeQueue.filter((entry) => {
    if (matchesFilter(entry, element, id)) {
      entries.push(entry);
      return false;
    }
    return true;
  });

  entries.forEach(({ callback }) => callback());
}

/**
 * Cancels pending DOM write callbacks, removing them from the queue without executing.
 * When called with an element, only cancels writes for that element. The `id` option
 * further narrows the match to a specific write within the element.
 *
 * @param {HTMLElement} [element] - If provided, only cancel writes scheduled for this element.
 * @param {{ id: string }} [options] - If provided, only cancel writes with a matching id.
 */
export function cancelWrites(element, options = {}) {
  const { id } = options;
  writeQueue = writeQueue.filter((entry) => !matchesFilter(entry, element, id));
}

/**
 * Schedules a DOM write callback to be executed in the next animation frame.
 * If a write with the same element and id already exists, it is replaced.
 *
 * @param {HTMLElement} element - The element associated with this write.
 * @param {Function} callback - The callback to execute.
 * @param {{ id: string }} [options] - Optional id to deduplicate writes.
 */
export function scheduleWrite(element, callback, options = {}) {
  const { id } = options;
  cancelWrites(element, { id });

  writeQueue.push({ element, id, callback });

  if (writeQueue.length <= 1) {
    requestAnimationFrame(() => flushWrites());
  }
}
