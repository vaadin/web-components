/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

const ARIA_REFERENCE_PROPERTIES = {
  'aria-describedby': 'ariaDescribedByElements',
  'aria-labelledby': 'ariaLabelledByElements',
};

/**
 * Adds the element to the target's `ariaDescribedByElements` or
 * `ariaLabelledByElements` property, based on the given attribute.
 * Unlike ID references, element references also work across shadow roots.
 *
 * @param {HTMLElement} target
 * @param {'aria-describedby' | 'aria-labelledby'} attr
 * @param {HTMLElement} element
 */
export function addAriaElementReference(target, attr, element) {
  const property = ARIA_REFERENCE_PROPERTIES[attr];
  const elements = new Set(target[property]);
  elements.add(element);
  target[property] = [...elements];
}

/**
 * Removes the element from the target's `ariaDescribedByElements` or
 * `ariaLabelledByElements` property, based on the given attribute.
 * When the last element is removed, the property is reset to `null`
 * so it no longer overrides the content attribute.
 *
 * @param {HTMLElement} target
 * @param {'aria-describedby' | 'aria-labelledby'} attr
 * @param {HTMLElement} element
 */
export function removeAriaElementReference(target, attr, element) {
  const property = ARIA_REFERENCE_PROPERTIES[attr];
  const elements = new Set(target[property]);
  elements.delete(element);
  target[property] = elements.size > 0 ? [...elements] : null;
}
