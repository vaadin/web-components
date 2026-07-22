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
  #mode;
  #targets;

  constructor(host) {
    this.host = host;
  }

  /**
   * Sets the target elements to link the tooltip content to,
   * unlinking the previously set target elements.
   *
   * @param {HTMLElement | HTMLElement[] | null | undefined} target
   */
  setTarget(target) {
    this.#removeLinks();
    this.#targets = target ? [target].flat() : null;
    this.#addLinks();
  }

  /**
   * Sets the ARIA attribute to link the target elements with,
   * relinking them using the new attribute.
   *
   * @param {'aria-describedby' | 'aria-labelledby' | 'none'} mode
   */
  setMode(mode) {
    this.#removeLinks();
    this.#mode = mode;
    this.#addLinks();
  }

  #addLinks() {
    if (!this.#mode || this.#mode === 'none') {
      return;
    }

    this.#targets?.forEach((target) => {
      addValueToAttribute(target, this.#mode, this.host._uniqueId);
    });
  }

  #removeLinks() {
    if (!this.#mode || this.#mode === 'none') {
      return;
    }

    this.#targets?.forEach((target) => {
      removeValueFromAttribute(target, this.#mode, this.host._uniqueId);
    });
  }
}
