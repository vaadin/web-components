/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { addValueToAttribute, removeValueFromAttribute } from '@vaadin/component-base/src/dom-utils.js';

/**
 * A controller for managing ARIA attributes for a field element:
 * either the component itself or slotted `<input>` element.
 */
export class FieldAriaController {
  constructor(host) {
    this.host = host;
    this.__required = false;
  }

  /**
   * Sets a target element to which ARIA attributes are added.
   *
   * @param {HTMLElement} target
   */
  setTarget(target) {
    this.__target = target;
    this.__setAriaRequiredAttribute(this.__required);
    this.__setLabelIdToAriaAttribute(this.__labelId);
    this.__setErrorIdToAriaAttribute(this.__errorId);
    this.__setHelperIdToAriaAttribute(this.__helperId);
  }

  /**
   * Toggles the `aria-required` attribute on the target element
   * if the target is the host component (e.g. a field group).
   * Otherwise, it does nothing.
   *
   * @param {boolean} required
   */
  setRequired(required) {
    this.__setAriaRequiredAttribute(required);
    this.__required = required;
  }

  /**
   * Links the target element with a slotted label element
   * via the target's attribute `aria-labelledby`.
   *
   * To unlink the previous slotted label element, pass `null` as `labelId`.
   *
   * @param {string | null} labelId
   */
  setLabelId(labelId) {
    this.__setLabelIdToAriaAttribute(labelId, this.__labelId);
    this.__labelId = labelId;
  }

  /**
   * Links the target element with a slotted error element via the target's attribute:
   * - `aria-labelledby` if the target is the host component (e.g a field group).
   * - `aria-describedby` otherwise.
   *
   * To unlink the previous slotted error element, pass `null` as `errorId`.
   *
   * @param {string | null} errorId
   */
  setErrorId(errorId) {
    this.__setErrorIdToAriaAttribute(errorId, this.__errorId);
    this.__errorId = errorId;
  }

  /**
   * Links the target element with a slotted helper element via the target's attribute:
   * - `aria-labelledby` if the target is the host component (e.g a field group).
   * - `aria-describedby` otherwise.
   *
   * To unlink the previous slotted helper element, pass `null` as `helperId`.
   *
   * @param {string | null} helperId
   */
  setHelperId(helperId) {
    this.__setHelperIdToAriaAttribute(helperId, this.__helperId);
    this.__helperId = helperId;
  }

  /**
   * `true` if the target element is the host component itself, `false` otherwise.
   *
   * @return {boolean}
   * @private
   */
  get __isGroupField() {
    return this.__target === this.host;
  }

  /**
   * @param {string | null | undefined} labelId
   * @param {string | null | undefined} oldLabelId
   * @private
   */
  __setLabelIdToAriaAttribute(labelId, oldLabelId) {
    this.__setAriaAttributeId('aria-labelledby', labelId, oldLabelId);
  }

  /**
   * @param {string | null | undefined} errorId
   * @param {string | null | undefined} oldErrorId
   * @private
   */
  __setErrorIdToAriaAttribute(errorId, oldErrorId) {
    // For groups, add all IDs to aria-labelledby rather than aria-describedby -
    // that should guarantee that it's announced when the group is entered.
    if (this.__isGroupField) {
      this.__setAriaAttributeId('aria-labelledby', errorId, oldErrorId);
    } else {
      this.__setAriaAttributeId('aria-describedby', errorId, oldErrorId);
    }
  }

  /**
   * @param {string | null | undefined} helperId
   * @param {string | null | undefined} oldHelperId
   * @private
   */
  __setHelperIdToAriaAttribute(helperId, oldHelperId) {
    // For groups, add all IDs to aria-labelledby rather than aria-describedby -
    // that should guarantee that it's announced when the group is entered.
    if (this.__isGroupField) {
      this.__setAriaAttributeId('aria-labelledby', helperId, oldHelperId);
    } else {
      this.__setAriaAttributeId('aria-describedby', helperId, oldHelperId);
    }
  }

  /**
   * @param {boolean} required
   * @private
   */
  __setAriaRequiredAttribute(required) {
    if (!this.__target) {
      return;
    }

    if (['input', 'textarea'].includes(this.__target.localName)) {
      // Native <input> or <textarea>, required is enough
      return;
    }

    if (required) {
      this.__target.setAttribute('aria-required', 'true');
    } else {
      this.__target.removeAttribute('aria-required');
    }
  }

  /**
   * @param {string | null | undefined} newId
   * @param {string | null | undefined} oldId
   * @private
   */
  __setAriaAttributeId(attr, newId, oldId) {
    if (!this.__target) {
      return;
    }

    if (oldId) {
      removeValueFromAttribute(this.__target, attr, oldId);
    }

    if (newId) {
      addValueToAttribute(this.__target, attr, newId);
    }
  }
}
