/**
 * @license
 * Copyright (c) 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * Check if two paths can be resolved as URLs
 * with the same origin and pathname.
 *
 * @param {string} path1
 * @param {string} path2
 */
export function matchPaths(path1, path2) {
  const base = document.baseURI;
  const url1 = new URL(path1, base);
  const url2 = new URL(path2, base);
  return url1.origin === url2.origin && url1.pathname === url2.pathname;
}
