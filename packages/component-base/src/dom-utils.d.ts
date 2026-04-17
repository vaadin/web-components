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
 */
export function getAncestorRootNodes(node: Node): Node[];

/**
 * Returns the list of flattened elements for the given `node`.
 * This list consists of a node's children and, for any children that are
 * `<slot>` elements, the expanded flattened list of `assignedElements`.
 */
export function getFlattenedElements(node: Node): Element[];

/**
 * Traverses the given node and its parents, including those that are across
 * the shadow root boundaries, until it finds a node that matches the selector.
 */
export function getClosestElement(selector: string, node: Node): Node | null;

/**
 * Takes a string with values separated by space and returns a set the values
 */
export function deserializeAttributeValue(value: string): Set<string>;

/**
 * Takes a set of string values and returns a string with values separated by space
 */
export function serializeAttributeValue(values: Set<string>): string;

/**
 * Sets the attribute to the given value, or removes the attribute when the
 * value is falsy (e.g. `null`, `undefined`, `false` or an empty string).
 */
export function setOrRemoveAttribute(
  element: HTMLElement,
  attr: string,
  value: string | boolean | null | undefined,
): void;

/**
 * Adds one or more values to an attribute containing space-delimited values.
 * If no values remain, the whole attribute is removed.
 */
export function addValuesToAttribute(element: HTMLElement, attr: string, valuesToAdd: string | string[]): void;

/**
 * Removes one or more values from an attribute containing space-delimited values.
 * If no values remain, the whole attribute is removed.
 */
export function removeValuesFromAttribute(element: HTMLElement, attr: string, valuesToRemove: string | string[]): void;

/**
 * Returns true if the given node is an empty text node, false otherwise.
 */
export function isEmptyTextNode(node: Node): boolean;

/**
 * Reorders the children of the given container in-place according to the
 * given comparator. The currently focused child, if any, is used as an
 * anchor to preserve focus and avoid scroll jumps while reordering.
 *
 * Each child is moved only if it's not already in the right position
 * relative to its neighbors.
 */
export function reorderElements(container: Element, comparator: (a: Element, b: Element) => number): void;
