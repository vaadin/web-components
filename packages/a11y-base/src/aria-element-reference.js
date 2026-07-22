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
 * Adds an element to the list of elements referenced by the given ARIA
 * attribute on the target element, using ARIA element reflection properties
 * (`ariaDescribedByElements`, `ariaLabelledByElements`). Unlike ID references,
 * element references also work when the target element is in a shadow root
 * and the referenced element is in a containing tree scope.
 *
 * @param {HTMLElement} target
 * @param {string} attr the ARIA attribute, `aria-describedby` or `aria-labelledby`
 * @param {HTMLElement} element the element to add to the reference list
 */
export function addAriaElementReference(target, attr, element) {
  const property = ARIA_REFERENCE_PROPERTIES[attr];
  if (!property) {
    return;
  }
  const elements = new Set(target[property]);
  elements.add(element);
  target[property] = [...elements];
}

/**
 * Removes an element from the list of elements referenced by the given ARIA
 * attribute on the target element. When the list becomes empty, the property
 * is reset to `null` so that it no longer overrides the corresponding
 * content attribute.
 *
 * @param {HTMLElement} target
 * @param {string} attr the ARIA attribute, `aria-describedby` or `aria-labelledby`
 * @param {HTMLElement} element the element to remove from the reference list
 */
export function removeAriaElementReference(target, attr, element) {
  const property = ARIA_REFERENCE_PROPERTIES[attr];
  if (!property) {
    return;
  }
  const elements = new Set(target[property]);
  elements.delete(element);
  target[property] = elements.size > 0 ? [...elements] : null;
}
