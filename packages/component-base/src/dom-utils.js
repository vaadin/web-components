/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
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
 * Returns the list of flattened elements for the given `node`.
 * This list consists of a node's children and, for any children that are
 * `<slot>` elements, the expanded flattened list of `assignedElements`.
 *
 * @param {Node} node
 * @return {Element[]}
 */
export function getFlattenedElements(node) {
  const result = [];
  let elements;
  if (node.localName === 'slot') {
    elements = node.assignedElements();
  } else {
    result.push(node);
    elements = [...node.children];
  }
  elements.forEach((elem) => result.push(...getFlattenedElements(elem)));
  return result;
}

/**
 * Traverses the given node and its parents, including those that are across
 * the shadow root boundaries, until it finds a node that matches the selector.
 *
 * @param {string} selector The CSS selector to match against
 * @param {Node} node The starting node for the traversal
 * @return {Node | null} The closest matching element, or null if no match is found
 */
export function getClosestElement(selector, node) {
  if (!node) {
    return null;
  }

  return node.closest?.(selector) || getClosestElement(selector, node.getRootNode().host);
}

/**
 * Takes a string with values separated by space and returns a set the values
 *
 * @param {string} value
 * @return {Set<string>}
 */
export function deserializeAttributeValue(value) {
  return new Set(value ? value.split(' ').filter(Boolean) : []);
}

/**
 * Takes a set of string values and returns a string with values separated by space
 *
 * @param {Set<string>} values
 * @return {string}
 */
export function serializeAttributeValue(values) {
  return values ? [...values].join(' ') : '';
}

/**
 * Sets the attribute to the given value, or removes the attribute when the
 * value is falsy (e.g. `null`, `undefined`, `false` or an empty string).
 *
 * @param {HTMLElement} element
 * @param {string} attr
 * @param {string | boolean | null | undefined} value
 */
export function setOrRemoveAttribute(element, attr, value) {
  if (value) {
    element.setAttribute(attr, value);
  } else {
    element.removeAttribute(attr);
  }
}

/**
 * Normalizes values passed to `addValuesToAttribute` and `removeValuesFromAttribute`
 * into a set of values. Both a single string and every array entry may contain
 * multiple values separated by space.
 *
 * @param {string | string[] | null | undefined} values
 * @return {Set<string>}
 */
function normalizeAttributeValues(values) {
  return deserializeAttributeValue(Array.isArray(values) ? values.join(' ') : values);
}

/**
 * Adds one or more values to an attribute containing space-delimited values.
 * If no values remain, the whole attribute is removed.
 *
 * @param {HTMLElement} element
 * @param {string} attr
 * @param {string | string[]} valuesToAdd a string or an array of strings with values separated by space
 */
export function addValuesToAttribute(element, attr, valuesToAdd) {
  valuesToAdd = normalizeAttributeValues(valuesToAdd);

  const values = deserializeAttributeValue(element.getAttribute(attr));
  valuesToAdd.forEach((value) => values.add(value));

  setOrRemoveAttribute(element, attr, serializeAttributeValue(values));
}

/**
 * Removes one or more values from an attribute containing space-delimited values.
 * If no values remain, the whole attribute is removed.
 *
 * @param {HTMLElement} element
 * @param {string} attr
 * @param {string | string[]} valuesToRemove a string or an array of strings with values separated by space
 */
export function removeValuesFromAttribute(element, attr, valuesToRemove) {
  valuesToRemove = normalizeAttributeValues(valuesToRemove);

  const values = deserializeAttributeValue(element.getAttribute(attr));
  valuesToRemove.forEach((value) => values.delete(value));

  setOrRemoveAttribute(element, attr, serializeAttributeValue(values));
}

/**
 * Returns true if the given node is an empty text node, false otherwise.
 *
 * @param {Node} node
 * @return {boolean}
 */
export function isEmptyTextNode(node) {
  return node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '';
}

/**
 * Returns true if the given node has content of its own: an element with
 * children, a defined custom element — which may render content in its
 * shadow root — or a node with non-empty text.
 *
 * @param {Node | null | undefined} node
 * @return {boolean}
 */
export function hasNodeContent(node) {
  if (!node) {
    return false;
  }

  return Boolean(
    (node.nodeType === Node.ELEMENT_NODE && (customElements.get(node.localName) || node.children.length > 0)) ||
    node.textContent?.trim(),
  );
}
