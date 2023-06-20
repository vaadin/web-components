/**
 * @license
 * Copyright (c) 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * Check if two paths match
 *
 * @param {string} path1
 * @param {string} path2
 */
export function matchPaths(path1, path2) {
  const base = document.baseURI;
  return new URL(path1, base).pathname === new URL(path2, base).pathname;
}
