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
