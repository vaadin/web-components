/**
 * @license
 * Copyright (c) 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * @param {string} pathToMatch
 * @param {string} itemPath
 * @param {string} itemPathAliases
 */
export function isMatchingPath(pathToMatch, itemPath, itemPathAliases) {
  const sanitizedPathToMatch = pathToMatch.startsWith('/') ? pathToMatch.substring(1) : pathToMatch;
  const sanitizedItemPath = itemPath.startsWith('/') ? itemPath.substring(1) : itemPath;
  // Try matching the item path
  if (sanitizedPathToMatch === sanitizedItemPath) {
    return true;
  }
  // Try matching the item path aliases given they exist
  if (itemPathAliases || itemPathAliases === '') {
    return itemPathAliases.split(',').some((alias) => {
      const sanitizedAlias = alias.startsWith('/') ? alias.substring(1) : alias;
      return sanitizedPathToMatch === sanitizedAlias;
    });
  }
  return false;
}

export function getCurrentRelativePath() {
  const path = document.location.pathname;
  const hasBaseUri = !path.startsWith('/') && document.baseURI !== document.location.href;
  if (hasBaseUri) {
    const basePath = new URL(document.baseURI).pathname;
    // Strip base part from the path
    if (path.startsWith(basePath)) {
      return path.substring(basePath.length);
    }
  }
  return path;
}
