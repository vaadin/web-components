/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * Returns a tab-ordered array of focusable elements for a root element.
 * The resulting array will include the root element if it is focusable.
 *
 * The method traverses nodes in shadow DOM trees too if any.
 */
export declare function getFocusableElements(element: HTMLElement): HTMLElement[];

/**
 * Returns true if the element is focused, false otherwise.
 */
export declare function isElementFocused(element: HTMLElement): boolean;
