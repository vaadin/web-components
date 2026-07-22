/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { addValueToAttribute, removeValueFromAttribute } from '@vaadin/component-base/src/dom-utils.js';

/**
 * A controller for linking the tooltip content to the tooltip target elements
 * using the `aria-describedby` or `aria-labelledby` attribute.
 */
export class TooltipAriaController {
  #content;
  #mode;
  #targets;

  /**
   * Sets the tooltip content element to link the target elements to,
   * relinking them using the new element's `id`.
   *
   * @param {HTMLElement | null | undefined} content
   */
  setContent(content) {
    this.#removeReferences();
    this.#content = content;
    this.#addReferences();
  }

  /**
   * Sets the target elements to link the tooltip content to,
   * unlinking the previously set target elements.
   *
   * @param {HTMLElement | HTMLElement[] | null | undefined} target
   */
  setTarget(target) {
    this.#removeReferences();
    this.#targets = target ? [target].flat() : null;
    this.#addReferences();
  }

  /**
   * Sets the ARIA attribute to link the target elements with,
   * relinking them using the new attribute.
   *
   * @param {'aria-describedby' | 'aria-labelledby' | 'none'} mode
   */
  setMode(mode) {
    this.#removeReferences();
    this.#mode = mode;
    this.#addReferences();
  }

  #addReferences() {
    if (!this.#content || !this.#mode || this.#mode === 'none') {
      return;
    }

    this.#targets?.forEach((target) => {
      addValueToAttribute(target, this.#mode, this.#content.id);
    });
  }

  #removeReferences() {
    if (!this.#content || !this.#mode || this.#mode === 'none') {
      return;
    }

    this.#targets?.forEach((target) => {
      removeValueFromAttribute(target, this.#mode, this.#content.id);
    });
  }
}
