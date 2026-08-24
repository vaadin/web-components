/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * Keys that are not copied while merging, as assigning them would modify
 * `Object.prototype` instead of the merge target, and so affect every
 * object in the application.
 */
const IGNORED_KEYS = ['__proto__', 'constructor', 'prototype'];

const hasOwnProperty = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

const isPlainObject = (value) => {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};

/**
 * Merges `source` into `target`. With `partial`, the source is treated as an
 * object that may provide only some of the properties: nullish values are
 * skipped and arrays are copied instead of shared.
 */
function merge(target, source, partial) {
  if (!isPlainObject(target) || !isPlainObject(source)) {
    return target;
  }

  Object.keys(source).forEach((key) => {
    if (IGNORED_KEYS.includes(key)) {
      return;
    }

    const value = source[key];

    if (isPlainObject(value)) {
      // Only merge into an own plain object, so that the merge can never
      // continue into an object inherited from the prototype chain.
      if (!hasOwnProperty(target, key) || !isPlainObject(target[key])) {
        target[key] = {};
      }

      merge(target[key], value, partial);
    } else if (partial && Array.isArray(value)) {
      target[key] = [...value];
    } else if (!partial || (value !== undefined && value !== null)) {
      target[key] = value;
    }
  });

  return target;
}

/**
 * Recursively copies own properties of `source` into `target` and returns
 * `target`. Plain objects are merged, other values are assigned as they are.
 * An object is plain when it inherits from `Object.prototype` or from nothing,
 * so values such as a `Date` or a class instance are assigned, not merged.
 *
 * Merges a single source. Use `deepMergePartials()` to merge several objects,
 * or to merge objects that only provide some of the properties.
 *
 * Both arguments are expected to be plain objects. When either of them is not,
 * `target` is returned without changes.
 *
 * Keys that would modify `Object.prototype`, such as `__proto__`, are ignored.
 *
 * @param {object} target the object to merge into, modified in place
 * @param {object} source the object to copy the properties from
 * @return {object} the `target` object
 */
export function deepMerge(target, source) {
  return merge(target, source, false);
}

/**
 * Recursively merges partial objects into `target` in order and returns
 * `target`, so that a later source overrides an earlier one.
 *
 * Values that are `null` or `undefined` are skipped, so a source that only
 * provides some of the properties does not remove the others. Arrays are
 * copied, so that the result shares no object or array with any of the
 * sources and can not be modified through them.
 *
 * Sources that are not plain objects are ignored. When `target` is not a plain
 * object, it is returned without changes.
 *
 * Keys that would modify `Object.prototype`, such as `__proto__`, are ignored.
 *
 * @param {object} target the object to merge into, modified in place
 * @param {...object} sources the objects to copy the properties from
 * @return {object} the `target` object
 */
export function deepMergePartials(target, ...sources) {
  sources.forEach((source) => merge(target, source, true));

  return target;
}
