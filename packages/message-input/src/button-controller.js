/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';

/**
 * Returns true if the element has text exposed to assistive technologies. Content in a
 * named slot does not count, as a tooltip writes its text to the light DOM, and neither
 * does `aria-hidden` content, as `vaadin-button` renders the `prefix` and `suffix` slots
 * inside `aria-hidden` wrappers.
 *
 * @param {Element} element
 * @return {boolean}
 */
function hasAccessibleText(element) {
  return Array.from(element.childNodes).some((node) => {
    if (node.nodeType === Node.ELEMENT_NODE && (node.slot || node.getAttribute('aria-hidden') === 'true')) {
      return false;
    }
    return node.textContent.trim() !== '';
  });
}

/**
 * A controller to manage the send button element.
 */
export class ButtonController extends SlotController {
  /** The `aria-label` this controller set, to tell it apart from one set by the app. */
  #appliedLabel;

  constructor(host, initializer) {
    super(host, 'button', 'vaadin-message-input-button', { initializer });
  }

  /**
   * Apply the localized send text to the button: as text content for the default
   * button, and as an accessible name for a custom button that has none. A name
   * the app provides takes precedence, whenever it is set.
   *
   * @param {string} label
   */
  setLabel(label) {
    const { node } = this;

    if (node === this.defaultNode) {
      node.textContent = label;
      return;
    }

    // Leave an `aria-label` that the app set itself alone.
    const currentLabel = node.getAttribute('aria-label');
    if (currentLabel !== null && currentLabel !== this.#appliedLabel) {
      return;
    }

    // Drop the generated label once the button provides its own accessible name.
    if (hasAccessibleText(node) || node.hasAttribute('aria-labelledby')) {
      node.removeAttribute('aria-label');
      this.#appliedLabel = undefined;
      return;
    }

    node.setAttribute('aria-label', label);
    this.#appliedLabel = label;
  }
}
