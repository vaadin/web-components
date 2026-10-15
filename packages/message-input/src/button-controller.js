/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { isEmptyTextNode, setOrRemoveAttribute } from '@vaadin/component-base/src/dom-utils.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';

/**
 * Returns true if the element has text exposed to assistive technologies.
 * Ignores content in named slots: tooltip text, button prefix and suffix.
 *
 * @param {Element} element
 * @return {boolean}
 */
function hasAccessibleText(element) {
  return Array.from(element.childNodes).some((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      return !isEmptyTextNode(node);
    }

    // Ignore anything that is not an element, such as the comment nodes Lit renders.
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return false;
    }

    return !node.slot && node.getAttribute('aria-hidden') !== 'true' && node.textContent.trim() !== '';
  });
}

/**
 * A controller to manage the send button element.
 */
export class ButtonController extends SlotController {
  #label;

  constructor(host, initializer) {
    super(host, 'button', 'vaadin-message-input-button', { initializer });
  }

  /**
   * Applies localized text to the button.
   *
   * @param {string} label
   */
  setLabel(label) {
    const { node } = this;

    if (node === this.defaultNode) {
      node.textContent = label;
      return;
    }

    // Do not override custom `aria-label` set by the application.
    const currentLabel = node.getAttribute('aria-label');
    if (currentLabel !== null && currentLabel !== this.#label) {
      return;
    }

    // Use generated label if the button doesn't have own accessible name.
    const needsLabel = !hasAccessibleText(node) && !node.hasAttribute('aria-labelledby');
    this.#label = needsLabel ? label : undefined;
    setOrRemoveAttribute(node, 'aria-label', this.#label);
  }
}
