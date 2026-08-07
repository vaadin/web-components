/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import {
  addValuesToAttribute,
  removeValuesFromAttribute,
  setOrRemoveAttribute,
} from '@vaadin/component-base/src/dom-utils.js';

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
  #labelledBy;

  /** @type {string | null | undefined} */
  #describedBy;

  /** @type {string | null | undefined} */
  #errorId;

  /** @type {string | null | undefined} */
  #helperId;

  /** @type {string[]} */
  #ariaLabelledByAttributeIds = [];

  /** @type {string[]} */
  #ariaDescribedByAttributeIds = [];

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
  setLabel(label) {
    this.#label = label;
    this.#updateAriaLabelAttribute();
  }

  /**
   * Links the target element to one or more elements via the `aria-labelledby` attribute.
   *
   * @param {string | null} labelledBy the space-delimited list of IDs,
   * or `null` to remove the previously linked IDs
   */
  setLabelledBy(labelledBy) {
    this.#labelledBy = labelledBy;
    this.#updateAriaLabelledByAttribute();
  }

  /**
   * Links the target element to one or more elements via the `aria-describedby` attribute.
   *
   * @param {string | null} describedBy the space-delimited list of IDs,
   * or `null` to remove the previously linked IDs
   */
  setDescribedBy(describedBy) {
    this.#describedBy = describedBy;
    this.#updateAriaDescribedByAttribute();
  }

  /**
   * Links the target element to a slotted error element via the `aria-describedby` attribute.
   *
   * @param {string | null} errorId the ID of the error element,
   * or `null` to remove the previously linked ID
   */
  setErrorId(errorId) {
    this.#errorId = errorId;
    this.#updateAriaDescribedByAttribute();
  }

  /**
   * Links the target element to a slotted helper element via the `aria-describedby` attribute.
   *
   * @param {string | null} helperId the ID of the helper element,
   * or `null` to remove the previously linked ID
   */
  setHelperId(helperId) {
    this.#helperId = helperId;
    this.#updateAriaDescribedByAttribute();
  }

  #updateAriaLabelAttribute() {
    if (!this.#target) {
      return;
    }

    setOrRemoveAttribute(this.#target, 'aria-label', this.#label);
  }

  #updateAriaLabelledByAttribute() {
    if (!this.#target) {
      return;
    }

    removeValuesFromAttribute(this.#target, 'aria-labelledby', this.#ariaLabelledByAttributeIds);

    this.#ariaLabelledByAttributeIds = [this.#labelledBy];

    addValuesToAttribute(this.#target, 'aria-labelledby', this.#ariaLabelledByAttributeIds);
  }

  #updateAriaDescribedByAttribute() {
    if (!this.#target) {
      return;
    }

    removeValuesFromAttribute(this.#target, 'aria-describedby', this.#ariaDescribedByAttributeIds);

    this.#ariaDescribedByAttributeIds = [this.#describedBy, this.#helperId, this.#errorId];

    addValuesToAttribute(this.#target, 'aria-describedby', this.#ariaDescribedByAttributeIds);
  }

  #updateAriaRequiredAttribute() {
    if (!this.#target) {
      return;
    }

    if (['input', 'textarea'].includes(this.#target.localName)) {
      // Native <input> or <textarea>, required is enough
      return;
    }

    setOrRemoveAttribute(this.#target, 'aria-required', this.#required);
  }
}
