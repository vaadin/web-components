/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * Recursively copies own properties of `source` into `target` and returns
 * `target`. Plain objects are merged, other values are assigned as they are.
 *
 * Merges a single source. Use `deepMergePartials()` to merge several objects,
 * or to merge objects that only provide some of the properties.
 *
 * Both arguments are expected to be plain objects. When either of them is not,
 * `target` is returned without changes.
 *
 * Keys that would modify `Object.prototype`, such as `__proto__`, are ignored.
 */
export function deepMerge<T extends object>(target: T, source: object): T;

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
 */
export function deepMergePartials<T extends object>(target: T, ...sources: object[]): T;
