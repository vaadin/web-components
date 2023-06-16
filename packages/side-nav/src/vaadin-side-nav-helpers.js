/**
 * @license
 * Copyright (c) 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/** @private */
function __sanitizePath(path) {
  let sanitizedPath = path.trim();
  if (sanitizedPath.startsWith('/')) {
    sanitizedPath = sanitizedPath.substring(1);
  }
  return sanitizedPath.trim();
}

/** @private */
function __pathExists(path) {
  return path || path === '';
}

/**
 * @param {string} pathToMatch
 * @param {string} itemPath
 * @param {string} itemPathAliases
 */
export function isMatchingPath(pathToMatch, itemPath, itemPathAliases) {
  if (!__pathExists(pathToMatch) || !__pathExists(itemPath)) {
    return false;
  }
  const sanitizedPathToMatch = __sanitizePath(pathToMatch);
  // Try matching the item path
  if (sanitizedPathToMatch === __sanitizePath(itemPath)) {
    return true;
  }
  // Try matching the item path aliases given they exist
  if (__pathExists(itemPathAliases)) {
    return itemPathAliases.split(',').some((alias) => sanitizedPathToMatch === __sanitizePath(alias));
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
