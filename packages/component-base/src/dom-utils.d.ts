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

/**
 * Returns an array of ancestor root nodes for the given node.
 *
 * A root node is either a document node or a document fragment node (Shadow Root).
 * The array is collected by a bottom-up DOM traversing that starts with the given node
 * and involves both the light DOM and ancestor shadow DOM trees.
 */
export function getAncestorRootNodes(node: Node): Node[];

/**
 * Adds a value to an attribute containing space-delimited values.
 */
export function addValueToAttribute(element: HTMLElement, attr: string, value: string): void;

/**
 * Removes a value from an attribute containing space-delimited values.
 * If the value is the last one, the whole attribute is removed.
 */
export function removeValueFromAttribute(element: HTMLElement, attr: string, value: string): void;

/**
 * Returns true if the given node is an empty text node, false otherwise.
 */
export function isEmptyTextNode(node: Node): boolean;
