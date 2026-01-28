/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

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
    .some((entry) => !!entry && entry.isDirectory);

  if (!containsFolders) {
    return Promise.resolve(dropEvent.dataTransfer.files ? Array.from(dropEvent.dataTransfer.files) : []);
  }

  const filePromises = Array.from(dropEvent.dataTransfer.items)
    .map((item) => item.webkitGetAsEntry())
    .filter((entry) => !!entry)
    .map(getFilesFromEntry);

  return Promise.all(filePromises).then((files) => files.flat());
}
