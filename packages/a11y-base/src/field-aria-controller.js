/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { removeAriaIDReference, restoreGeneratedAriaIDReference, setAriaIDReference } from './aria-id-reference.js';

/**
 * A controller for managing ARIA attributes for a field element:
 * either the component itself or slotted `<input>` element.
 */
export class FieldAriaController {
  /** @type {HTMLElement | undefined} */
  #target;

  /** @type {boolean} */
  #required = false;

  /** @type {string | null | undefined} */
  #label;

  /** @type {string | null | undefined} */
  #labelId;

  /** @type {string | null | undefined} */
  #labelIdFromUser;

  /** @type {string | null | undefined} */
  #errorId;

  /** @type {string | null | undefined} */
  #helperId;

  constructor(host) {
    this.host = host;
  }

  /**
   * Sets a target element to which ARIA attributes are added.
   *
   * @param {HTMLElement} target
   */
  setTarget(target) {
    this.#target = target;
    this.#setAriaRequiredAttribute(this.#required);
    // We need to make sure that value in #labelId is stored
    this.#setLabelIdToAriaAttribute(this.#labelId, this.#labelId);
    if (this.#labelIdFromUser != null) {
      this.#setLabelIdToAriaAttribute(this.#labelIdFromUser, this.#labelIdFromUser, true);
    }
    this.#setErrorIdToAriaAttribute(this.#errorId);
    this.#setHelperIdToAriaAttribute(this.#helperId);
    this.setAriaLabel(this.#label);
  }

  /**
   * Toggles the `aria-required` attribute on the target element
   * if the target is the host component (e.g. a field group).
   * Otherwise, it does nothing.
   *
   * @param {boolean} required
   */
  setRequired(required) {
    this.#setAriaRequiredAttribute(required);
    this.#required = required;
  }

  /**
   * Defines the `aria-label` attribute of the target element.
   *
   * To remove the attribute, pass `null` as `label`.
   *
   * @param {string | null | undefined} label
   */
  setAriaLabel(label) {
    this.#setAriaLabelToAttribute(label);
    this.#label = label;
  }

  /**
   * Links the target element with a slotted label element
   * via the target's attribute `aria-labelledby`.
   *
   * To unlink the previous slotted label element, pass `null` as `labelId`.
   *
   * @param {string | null} labelId
   */
  setLabelId(labelId, fromUser = false) {
    const oldLabelId = fromUser ? this.#labelIdFromUser : this.#labelId;
    this.#setLabelIdToAriaAttribute(labelId, oldLabelId, fromUser);
    if (fromUser) {
      this.#labelIdFromUser = labelId;
    } else {
      this.#labelId = labelId;
    }
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
    this.#setErrorIdToAriaAttribute(errorId, this.#errorId);
    this.#errorId = errorId;
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
    this.#setHelperIdToAriaAttribute(helperId, this.#helperId);
    this.#helperId = helperId;
  }

  /**
   * @param {string | null | undefined} label
   */
  #setAriaLabelToAttribute(label) {
    if (!this.#target) {
      return;
    }
    if (label) {
      removeAriaIDReference(this.#target, 'aria-labelledby');
      this.#target.setAttribute('aria-label', label);
    } else if (this.#label) {
      restoreGeneratedAriaIDReference(this.#target, 'aria-labelledby');
      this.#target.removeAttribute('aria-label');
    }
  }

  /**
   * @param {string | null | undefined} labelId
   * @param {string | null | undefined} oldLabelId
   * @param {boolean | null | undefined} fromUser
   */
  #setLabelIdToAriaAttribute(labelId, oldLabelId, fromUser) {
    setAriaIDReference(this.#target, 'aria-labelledby', { newId: labelId, oldId: oldLabelId, fromUser });
  }

  /**
   * @param {string | null | undefined} errorId
   * @param {string | null | undefined} oldErrorId
   */
  #setErrorIdToAriaAttribute(errorId, oldErrorId) {
    setAriaIDReference(this.#target, 'aria-describedby', { newId: errorId, oldId: oldErrorId, fromUser: false });
  }

  /**
   * @param {string | null | undefined} helperId
   * @param {string | null | undefined} oldHelperId
   */
  #setHelperIdToAriaAttribute(helperId, oldHelperId) {
    setAriaIDReference(this.#target, 'aria-describedby', { newId: helperId, oldId: oldHelperId, fromUser: false });
  }

  /**
   * @param {boolean} required
   */
  #setAriaRequiredAttribute(required) {
    if (!this.#target) {
      return;
    }

    if (['input', 'textarea'].includes(this.#target.localName)) {
      // Native <input> or <textarea>, required is enough
      return;
    }

    if (required) {
      this.#target.setAttribute('aria-required', 'true');
    } else {
      this.#target.removeAttribute('aria-required');
    }
  }
}
