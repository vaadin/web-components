/**
 * @license
 * Copyright (c) 2025 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
let readTaskQueue = [];
let writeTaskQueue = [];

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
export function flush(element) {
  const readTasks = [];
  const writeTasks = [];

  writeTaskQueue = writeTaskQueue.filter((entry) => {
    if (matchesFilter(entry, element)) {
      writeTasks.push(entry);
      return false;
    }
    return true;
  });

  readTaskQueue = readTaskQueue.filter((entry) => {
    if (matchesFilter(entry, element)) {
      readTasks.push(entry);
      return false;
    }
    return true;
  });

  [...readTasks, ...writeTasks].forEach(({ callback }) => callback());
}

/**
 * Cancels pending DOM write callbacks, removing them from the queue without executing.
 * When called with an element, only cancels writes for that element.
 *
 * @param {HTMLElement} [element] - If provided, only cancel writes scheduled for this element.
 */
export function cancel(element) {
  readTaskQueue = readTaskQueue.filter((entry) => !matchesFilter(entry, element));
  writeTaskQueue = writeTaskQueue.filter((entry) => !matchesFilter(entry, element));
}

/**
 * Schedules a DOM write callback to be executed in the next animation frame.
 * If a write with the same element and id already exists, it is replaced.
 *
 * @param {HTMLElement} element - The element associated with this write.
 * @param {{ read?: Function, write?: Function }} callbacks - The read and write callbacks to schedule.
 */
export function schedule(element, { read, write }) {
  if (read) {
    readTaskQueue.push({ element, callback: read });
  }

  if (write) {
    writeTaskQueue.push({ element, callback: write });
  }

  if (readTaskQueue.length >= 1 || writeTaskQueue.length >= 1) {
    setTimeout(() => flush());
  }
}
