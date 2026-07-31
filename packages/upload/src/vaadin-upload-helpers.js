/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * Format the given number of bytes with the units defined by the i18n object,
 * or with the custom `formatSize` function if the i18n object provides one.
 *
 * @param {number} bytes - The size in bytes
 * @param {Object} i18n - The effective i18n object
 * @returns {string} - The formatted size
 * @private
 */
function formatSize(bytes, i18n) {
  if (typeof i18n.formatSize === 'function') {
    return i18n.formatSize(bytes);
  }

  // https://wiki.ubuntu.com/UnitsPolicy
  const base = i18n.units.sizeBase || 1000;
  const unit = Math.trunc(Math.log(bytes) / Math.log(base));
  const dec = Math.max(0, Math.min(3, unit - 1));
  const size = Number.parseFloat((bytes / base ** unit).toFixed(dec));
  return `${size} ${i18n.units.size[unit]}`;
}

/** @private */
function splitTimeByUnits(time) {
  const unitSizes = [60, 60, 24, Infinity];
  const timeValues = [0];

  for (let i = 0; i < unitSizes.length && time > 0; i++) {
    timeValues[i] = time % unitSizes[i];
    time = Math.floor(time / unitSizes[i]);
  }

  return timeValues;
}

/**
 * Format the given time in seconds as a 'HH:MM:SS' string, or with the
 * custom `formatTime` function if the i18n object provides one.
 *
 * @param {number} seconds - The time in seconds
 * @param {Object} i18n - The effective i18n object
 * @returns {string} - The formatted time
 * @private
 */
function formatTime(seconds, i18n) {
  const split = splitTimeByUnits(seconds);
  if (typeof i18n.formatTime === 'function') {
    return i18n.formatTime(seconds, split);
  }

  // Fill HH:MM:SS with leading zeros
  while (split.length < 3) {
    split.push(0);
  }

  return split
    .reverse()
    .map((number) => {
      return (number < 10 ? '0' : '') + number;
    })
    .join(':');
}

/** @private */
function formatFileProgress(file, i18n) {
  const remainingTime =
    file.loaded > 0 ? i18n.uploading.remainingTime.prefix + file.remainingStr : i18n.uploading.remainingTime.unknown;

  return `${file.totalStr}: ${file.progress}% (${remainingTime})`;
}

/** @private */
function getFileStatus(file, i18n) {
  if (file.held && !file.error) {
    // File is queued and waiting
    return i18n.uploading.status.held;
  }
  if (file.stalled) {
    // File upload is stalled
    return i18n.uploading.status.stalled;
  }
  if (file.uploading && file.indeterminate && !file.held) {
    // File is uploading but progress is indeterminate (connecting or processing)
    return file.progress === 100 ? i18n.uploading.status.processing : i18n.uploading.status.connecting;
  }
  if (file.uploading && file.progress < 100 && file.total) {
    // File is uploading with known progress
    return formatFileProgress(file, i18n);
  }
  return file.status;
}

/**
 * Update the human-readable status and size strings of the given file
 * based on its upload state, using the given i18n object for formatting.
 *
 * @param {Object} file - The file to update
 * @param {Object} i18n - The effective i18n object
 * @private
 */
export function updateFileStatus(file, i18n) {
  // Always set size-related strings when total is available
  if (file.total) {
    file.totalStr = formatSize(file.total, i18n);
    file.loadedStr = formatSize(file.loaded || 0, i18n);
    // TODO: Remove elapsedStr in next major version - it's not used by vaadin-upload-file
    if (file.elapsed != null) {
      file.elapsedStr = formatTime(file.elapsed, i18n);
    }
    if (file.remaining != null) {
      file.remainingStr = formatTime(file.remaining, i18n);
    }
  }

  // Apply status message based on file state
  file.status = getFileStatus(file, i18n);
}

/**
 * Get the files from the drop event. The dropped items may contain a
 * combination of files and directories. If a dropped item is a directory,
 * it will be recursively traversed to get all files.
 *
 * @param {DragEvent} dropEvent - The drop event
 * @returns {Promise<File[]>} - The files from the drop event
 * @private
 */
export function getFilesFromDropEvent(dropEvent) {
  async function getFilesFromEntry(entry) {
    if (entry.isFile) {
      return new Promise((resolve) => {
        entry.file(resolve, () => resolve([]));
      });
    } else if (entry.isDirectory) {
      const reader = entry.createReader();
      const entries = await new Promise((resolve) => {
        reader.readEntries(resolve, () => resolve([]));
      });
      const files = await Promise.all(entries.map(getFilesFromEntry));
      return files.flat();
    }
  }

  const containsFolders = Array.from(dropEvent.dataTransfer.items)
    .filter((item) => !!item)
    .filter((item) => typeof item.webkitGetAsEntry === 'function')
    .map((item) => item.webkitGetAsEntry())
    .some((entry) => !!entry?.isDirectory);

  if (!containsFolders) {
    return Promise.resolve(dropEvent.dataTransfer.files ? Array.from(dropEvent.dataTransfer.files) : []);
  }

  const filePromises = Array.from(dropEvent.dataTransfer.items)
    .map((item) => item.webkitGetAsEntry())
    .filter((entry) => !!entry)
    .map(getFilesFromEntry);

  return Promise.all(filePromises).then((files) => files.flat());
}
