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
 * Flushes pending DOM read and write callbacks, executing and removing them
 * from the queues. Reads are executed before writes. When called without
 * arguments, flushes all pending tasks. When called with an element, only
 * flushes tasks scheduled for that element.
 *
 * @param {HTMLElement} [element] - If provided, only flush tasks scheduled for this element.
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
 * Cancels pending DOM read and write callbacks, removing them from the queues
 * without executing. When called with an element, only cancels tasks scheduled
 * for that element.
 *
 * @param {HTMLElement} [element] - If provided, only cancel tasks scheduled for this element.
 */
export function cancel(element) {
  readTaskQueue = readTaskQueue.filter((entry) => !matchesFilter(entry, element));
  writeTaskQueue = writeTaskQueue.filter((entry) => !matchesFilter(entry, element));
}

/**
 * Schedules DOM read and/or write callbacks for the given element. Reads are
 * batched and executed before writes to avoid layout thrashing.
 *
 * @param {HTMLElement} element - The element associated with these tasks.
 * @param {{ read?: Function, write?: Function }} callbacks - The read and/or write callbacks to schedule.
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
