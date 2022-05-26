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
