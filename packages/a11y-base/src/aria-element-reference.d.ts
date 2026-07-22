/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * Adds an element to the list of elements referenced by the given ARIA
 * attribute on the target element, using ARIA element reflection properties
 * (`ariaDescribedByElements`, `ariaLabelledByElements`). Unlike ID references,
 * element references also work when the target element is in a shadow root
 * and the referenced element is in a containing tree scope.
 */
export function addAriaElementReference(
  target: HTMLElement,
  attr: 'aria-describedby' | 'aria-labelledby',
  element: HTMLElement,
): void;

/**
 * Removes an element from the list of elements referenced by the given ARIA
 * attribute on the target element. When the list becomes empty, the property
 * is reset to `null` so that it no longer overrides the corresponding
 * content attribute.
 */
export function removeAriaElementReference(
  target: HTMLElement,
  attr: 'aria-describedby' | 'aria-labelledby',
  element: HTMLElement,
): void;
