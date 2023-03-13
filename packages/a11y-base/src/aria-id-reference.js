/**
 * @license
 * Copyright (c) 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import {
  addValueToAttribute,
  deserializeAttributeValue,
  removeValueFromAttribute,
  serializeAttributeValue,
} from '@vaadin/component-base/src/dom-utils.js';

const attributeToTargets = new Map();

/**
 * Gets or creates a Set with the stored values for each element controlled by this helper
 *
 * @param {string} attr the attribute name used as key in the map
 *
 * @returns {WeakMap<HTMLElement, Set<string>} a weak map with the stored values for the elements being controlled by the helper
 */
function getAttrMap(attr) {
  if (!attributeToTargets.has(attr)) {
    attributeToTargets.set(attr, new WeakMap());
  }
  return attributeToTargets.get(attr);
}

/**
 * Cleans the values set on the attribute to the given element.
 * It also stores the current values in the map, if `storeValue` is `true`.
 *
 * @param {HTMLElement} target
 * @param {string} attr the attribute to be cleared
 * @param {boolean} storeValue whether or not the current value of the attribute should be stored on the map
 * @returns
 */
function cleanAriaIDReference(target, attr) {
  if (!target) {
    return;
  }

  target.removeAttribute(attr);
}

/**
 * Storing values of the accessible attributes in a Set inside of the WeakMap.
 *
 * @param {HTMLElement} target
 * @param {string} attr the attribute to be stored
 */
function storeAriaIDReference(target, attr) {
  if (!target || !attr) {
    return;
  }
  const attributeMap = getAttrMap(attr);
  const values = deserializeAttributeValue(target.getAttribute(attr));
  attributeMap.set(target, new Set(values));
}

/**
 * Restores the generated values of the attribute to the given element.
 *
 * @param {HTMLElement} target
 * @param {string} attr
 */
function restoreGeneratedAriaIDReference(target, attr) {
  if (!target || !attr) {
    return;
  }
  addValueToAttribute(target, attr, serializeAttributeValue(getAttrMap(attr).get(target)));
}

function setAriaIDReference(target, attr, newId, oldId, fromUser = false) {
  if (!target) {
    return;
  }

  const attributeMap = getAttrMap(attr);
  const storedValues = attributeMap.get(target);

  if (!fromUser && !!storedValues) {
    // If there's any stored values, it means the attribute is being handled by the user
    // Replace the "oldId" with "newId" on the stored values set and leave
    storedValues.delete(oldId);
    storedValues.add(newId);
    return;
  }

  if (fromUser) {
    if (!storedValues) {
      // If it's called from user and there's no stored values for the attribute,
      // then store the current value
      storeAriaIDReference(target, attr);
    } else if (!newId) {
      // If called from user with newId == null, it means the attribute will no longer
      // be in control of the user and the stored values should be restored
      // Removing the entry on the map for this target
      attributeMap.delete(target);
    }

    // TODO update comment
    // If it's from user, then clear the attribute value before setting newId
    cleanAriaIDReference(target, attr);
  }

  removeValueFromAttribute(target, attr, oldId);

  const attributeValue = !newId ? serializeAttributeValue(storedValues) : newId;
  if (attributeValue) {
    addValueToAttribute(target, attr, attributeValue);
  }
}

/**
 * Restore the generated `aria-describedby` attribute value on the given element.
 *
 * @param {HTMLElement} target
 */
export function restoreGeneratedAriaDescribedBy(target) {
  restoreGeneratedAriaIDReference(target, 'aria-describedby');
}

/**
 * Removes the current `aria-describedby` attribute value on the given element.
 *
 * @param {HTMLElement} target
 */
export function removeAriaDescribedBy(target) {
  const attr = 'aria-describedby';
  storeAriaIDReference(target, attr);
  cleanAriaIDReference(target, attr);
}

/**
 * Update `aria-describedby` attribute value on the given element.
 *
 * @param {HTMLElement} target
 * @param {string} newId
 * @param {string} oldId
 */
export function setAriaDescribedBy(target, newId, oldId, fromUser) {
  setAriaIDReference(target, 'aria-describedby', newId, oldId, fromUser);
}

/**
 * Restore the generated `aria-labelledby` attribute value on the given element.
 *
 * @param {HTMLElement} target
 */
export function restoreGeneratedAriaLabelledBy(target) {
  restoreGeneratedAriaIDReference(target, 'aria-labelledby');
}

/**
 * Removes the current `aria-labelledby` attribute value on the given element.
 *
 * @param {HTMLElement} target
 */
export function removeAriaLabelledBy(target) {
  const attr = 'aria-labelledby';
  storeAriaIDReference(target, attr);
  cleanAriaIDReference(target, attr);
}

/**
 * Update `aria-labelledby` attribute value on the given element.
 *
 * @param {HTMLElement} target
 * @param {string} newId
 * @param {string} oldId
 */
export function setAriaLabelledBy(target, newId, oldId, fromUser) {
  setAriaIDReference(target, 'aria-labelledby', newId, oldId, fromUser);
}
