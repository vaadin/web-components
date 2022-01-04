/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * @param {string} value
 * @return {Set<string>}
 */
function deserializeAttributeValue(value) {
  if (!value) {
    return new Set();
  }

  return new Set(value.split(' '));
}

/**
 * @param {Set<string>} values
 * @return {string}
 */
function serializeAttributeValue(values) {
  return [...values].join(' ');
}

/**
 * Adds a value to an attribute containing space-delimited values.
 *
 * @param {HTMLElement} element
 * @param {string} attr
 * @param {string} value
 */
export function addValueToAttribute(element, attr, value) {
  const values = deserializeAttributeValue(element.getAttribute(attr));
  values.add(value);
  element.setAttribute(attr, serializeAttributeValue(values));
}

/**
 * Removes a value from an attribute containing space-delimited values.
 * If the value is the last one, the whole attribute is removed.
 *
 * @param {HTMLElement} element
 * @param {string} attr
 * @param {string} value
 */
export function removeValueFromAttribute(element, attr, value) {
  const values = deserializeAttributeValue(element.getAttribute(attr));
  values.delete(value);
  if (values.size === 0) {
    element.removeAttribute(attr);
    return;
  }
  element.setAttribute(attr, serializeAttributeValue(values));
}
