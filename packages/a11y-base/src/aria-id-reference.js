/**
 * @license
 * Copyright (c) 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { addValueToAttribute, removeValueFromAttribute } from '@vaadin/component-base/src/dom-utils.js';

const attributeToTargets = new Map();

function setToString(set) {
  return [...set].join(' ');
}

function stringToSet(string) {
  return new Set((string ?? '').split(' '));
}

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
function cleanAriaIDReference(target, attr, storeValue = true) {
  if (!target) {
    return;
  }

  if (storeValue) {
    const attributeMap = getAttrMap(attr);
    const values = stringToSet(target.getAttribute(attr));
    attributeMap.set(target, new Set(values));
  }

  target.removeAttribute(attr);
}

/**
 * Restores the generated values of the attribute to the given element.
 *
 * @param {HTMLElement} target
 * @param {string} attr
 */
function restoreGeneratedAriaIDReference(target, attr) {
  addValueToAttribute(target, attr, setToString(getAttrMap(attr).get(target)));
}

function setAriaIDReference(target, attr, newId, oldId, fromUser = false) {
  if (!target) {
    return;
  }

  const attributeMap = getAttrMap(attr);
  const hasStoredValues = attributeMap.has(target);

  if (fromUser !== hasStoredValues) {
    if (hasStoredValues) {
      // If there's any stored values, it means the attribute is being handled by the user
      // Replace the "oldId" with "newId" on the stored values set and leave
      const storedValues = attributeMap.get(target);
      storedValues.delete(oldId);
      storedValues.add(newId);
    } else {
      // If there's no stored values and fromUser == true,
      // then store and clean the current attribute value and set the newId (if present)
      cleanAriaIDReference(target, attr, !hasStoredValues);
      if (newId) {
        addValueToAttribute(target, attr, newId);
      }
    }
    return;
  } else if (fromUser && !newId) {
    // If called from user and newId == null, then clean the atrribute value, and
    // restore the attribute value with the generated stored values
    const storedValues = attributeMap.get(target);
    cleanAriaIDReference(target, attr, false);
    addValueToAttribute(target, attr, setToString(storedValues));
    attributeMap.delete(target);
    return;
  }

  if (oldId) {
    removeValueFromAttribute(target, attr, oldId);
  }

  if (newId) {
    addValueToAttribute(target, attr, newId);
  }
}

/**
 * Update `aria-describedby` attribute value on the given element.
 *
 * @param {HTMLElement} target
 * @param {string} newId
 * @param {string} oldId
 */
export function setAriaDescribedBy(target, newId, oldId) {
  setAriaIDReference(target, 'aria-describedby', newId, oldId);
}

/**
 * Restore the generated `aria-labelledby` attribute value on the given element.
 *
 * @param {HTMLElement} target
 */
export function restoreGeneratedAriaLabellledBy(target) {
  restoreGeneratedAriaIDReference(target, 'aria-labelledby');
}

/**
 * Removes the current `aria-labelledby` attribute value on the given element.
 *
 * @param {HTMLElement} target
 */
export function removeAriaLabelledBy(target) {
  cleanAriaIDReference(target, 'aria-labelledby');
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
