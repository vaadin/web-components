import { SideNavItem } from './vaadin-side-nav-item.js';
/**
 * @license
 * Copyright (c) 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * @param {string} path
 * @param {SideNavItem} item
 */
export function doesPathMatchItem(path, item) {
  const sanitizedPathToMatch = path.startsWith('/') ? path.substring(1) : path;
  const sanitizedItemPath = item.path.startsWith('/') ? item.path.substring(1) : item.path;
  // Try matching the item path
  if (sanitizedPathToMatch === sanitizedItemPath) {
    return true;
  }
  // Try matching the item path aliases given they exist
  if (item.pathAliases || item.pathAliases === '') {
    return item.pathAliases.split(',').some((alias) => {
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
