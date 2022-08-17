/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * Returns an array of ancestor root nodes for the given node.
 *
 * A root node is either a document node or a document fragment node (Shadow Root).
 * The array is collected by a bottom-up DOM traversing that starts with the given node
 * and involves both the light DOM and ancestor shadow DOM trees.
 *
 * @param {Node} node
 * @return {Node[]}
 */
export function getAncestorRootNodes(node) {
  const result = [];

  while (node) {
    if (node.nodeType === Node.DOCUMENT_NODE) {
      result.push(node);
      break;
    }

    if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      result.push(node);
      node = node.host;
      continue;
    }

    if (node.assignedSlot) {
      node = node.assignedSlot;
      continue;
    }

    node = node.parentNode;
  }

  return result;
}

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
