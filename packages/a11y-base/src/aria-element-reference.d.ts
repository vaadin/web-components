/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * Adds the element to the target's `ariaDescribedByElements` or
 * `ariaLabelledByElements` property, based on the given attribute.
 * Unlike ID references, element references also work across shadow roots.
 */
export function addAriaElementReference(
  target: HTMLElement,
  attr: 'aria-describedby' | 'aria-labelledby',
  element: HTMLElement,
): void;

/**
 * Removes the element from the target's `ariaDescribedByElements` or
 * `ariaLabelledByElements` property, based on the given attribute.
 * When the last element is removed, the property is reset to `null`
 * so it no longer overrides the content attribute.
 */
export function removeAriaElementReference(
  target: HTMLElement,
  attr: 'aria-describedby' | 'aria-labelledby',
  element: HTMLElement,
): void;
