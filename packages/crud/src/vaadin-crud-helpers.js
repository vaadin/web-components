/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { get, set } from '@polymer/polymer/lib/utils/path.js';

/**
 * Convenience utility for capitalizing a string, with
 * replacing non-alphanumeric characters with spaces.
 *
 * @param {string} path
 * @return {string}
 */
export function capitalize(path) {
  return path
    .toLowerCase()
    .replace(/([^\w]+)/gu, ' ')
    .trim()
    .replace(/^./u, (c) => c.toUpperCase());
}

/**
 * Convenience utility for reading a value from a path.
 *
 * @param {string} path
 * @param {Object} obj
 * @return {*}
 */
export function getProperty(path, obj) {
  return get(obj, path);
}

/**
 * Convenience utility for setting a value to a path.
 *
 * Note, if any part in the path is undefined, this
 * function initializes it with an empty object.
 *
 * @param {string} path
 * @param {*} value
 * @param {Object} obj
 */
export function setProperty(path, value, obj) {
  if (obj && path) {
    path
      .split('.')
      .slice(0, -1)
      .reduce((o, p) => {
        // Create an object
        if (!o[p]) {
          o[p] = {};
        }
        return o[p];
      }, obj);

    set(obj, path, value);
  }
}

export function isValidEditorPosition(editorPosition) {
  return ['bottom', 'aside'].includes(editorPosition);
}
