/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { addValuesToAttribute, removeValuesFromAttribute } from '@vaadin/component-base/src/dom-utils.js';

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
  #errorId;

  /** @type {string | null | undefined} */
  #helperId;

  /** @type {string[]} */
  #ariaLabelledByIds = [];

  /** @type {string[]} */
  #ariaDescribedByIds = [];

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
    this.#updateAriaLabelAttribute();
    this.#updateAriaLabelledByAttribute();
    this.#updateAriaDescribedByAttribute();
    this.#updateAriaRequiredAttribute();
  }

  /**
   * Toggles the `aria-required` attribute on the target element
   * if the target is the host component (e.g. a field group).
   * Otherwise, it does nothing.
   *
   * @param {boolean} required
   */
  setRequired(required) {
    this.#required = required;
    this.#updateAriaRequiredAttribute();
  }

  /**
   * Defines the `aria-label` attribute of the target element.
   *
   * To remove the attribute, pass `null` as `label`.
   *
   * @param {string | null | undefined} label
   */
  setAriaLabel(label) {
    this.#label = label;
    this.#updateAriaLabelAttribute();
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
    this.#labelId = labelId;
    this.#updateAriaLabelledByAttribute();
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
    this.#errorId = errorId;
    this.#updateAriaDescribedByAttribute();
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
    this.#helperId = helperId;
    this.#updateAriaDescribedByAttribute();
  }

  #updateAriaLabelAttribute() {
    if (!this.#target) {
      return;
    }

    if (this.#label) {
      this.#target.setAttribute('aria-label', this.#label);
    } else {
      this.#target.removeAttribute('aria-label');
    }
  }

  #updateAriaLabelledByAttribute() {
    if (!this.#target) {
      return;
    }

    removeValuesFromAttribute(this.#target, 'aria-labelledby', this.#ariaLabelledByIds);

    this.#ariaLabelledByIds = [this.#labelId];

    addValuesToAttribute(this.#target, 'aria-labelledby', this.#ariaLabelledByIds);
  }

  #updateAriaDescribedByAttribute() {
    if (!this.#target) {
      return;
    }

    removeValuesFromAttribute(this.#target, 'aria-describedby', this.#ariaDescribedByIds);

    this.#ariaDescribedByIds = [this.#helperId, this.#errorId];

    addValuesToAttribute(this.#target, 'aria-describedby', this.#ariaDescribedByIds);
  }

  #updateAriaRequiredAttribute() {
    if (!this.#target) {
      return;
    }

    if (['input', 'textarea'].includes(this.#target.localName)) {
      // Native <input> or <textarea>, required is enough
      return;
    }

    if (this.#required) {
      this.#target.setAttribute('aria-required', 'true');
    } else {
      this.#target.removeAttribute('aria-required');
    }
  }
}
