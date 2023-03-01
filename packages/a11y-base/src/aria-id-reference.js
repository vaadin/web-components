/**
 * @license
 * Copyright (c) 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { addValueToAttribute, removeValueFromAttribute } from '@vaadin/component-base/src/dom-utils.js';

function setAriaIDReference(target, attr, newId, oldId) {
  if (!target) {
    return;
  }

  if (oldId) {
    removeValueFromAttribute(target, attr, oldId);
  }

  if (newId) {
    // TODO: indicate that provided attribute value is managed by this helper,
    // to distinguish user-originated attribute value from the generated one.
    // Consider using a flag or storing the target in `WeakMap` or `WeakSet`.

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
 * Update `aria-labelledby` attribute value on the given element.
 *
 * @param {HTMLElement} target
 * @param {string} newId
 * @param {string} oldId
 */
export function setAriaLabelledBy(target, newId, oldId) {
  setAriaIDReference(target, 'aria-labelledby', newId, oldId);
}
