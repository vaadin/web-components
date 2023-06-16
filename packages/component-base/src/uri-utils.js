/**
 * @license
 * Copyright (c) 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * Check if a path matches to any within an array of paths
 *
 * @param {string} pathToMatch
 * @param {Array<String>} paths
 */
export function isMatchingPath(pathToMatch, paths) {
  if (!paths || (!pathToMatch && pathToMatch !== '')) {
    return false;
  }
  const normalizedPathToMatch = new URL(pathToMatch, document.baseURI).pathname;
  return paths.some((path) => normalizedPathToMatch === new URL(path, document.baseURI).pathname);
}
