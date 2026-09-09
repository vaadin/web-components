/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { isEmptyTextNode, setOrRemoveAttribute } from '@vaadin/component-base/src/dom-utils.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';

/**
 * Returns true if the element has text exposed to assistive technologies. Content in a
 * named slot does not count, as a tooltip writes its text to the light DOM, and neither
 * does `aria-hidden` content, as `vaadin-button` renders the `prefix` and `suffix` slots
 * inside `aria-hidden` wrappers, which hide slotted content from the accessible name.
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
  /** The `aria-label` this controller set, to tell it apart from one set by the app. */
  #appliedLabel;

  constructor(host, initializer) {
    super(host, 'button', 'vaadin-message-input-button', { initializer });
  }

  /**
   * Apply the localized send text to the button: as text content for the default
   * button, and as an accessible name for a custom button that has none.
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
    if (currentLabel !== null && currentLabel !== this.#appliedLabel) {
      return;
    }

    // Only keep a generated label while the button has no accessible name of its own.
    const needsLabel = !hasAccessibleText(node) && !node.hasAttribute('aria-labelledby');
    this.#appliedLabel = needsLabel ? label : undefined;
    setOrRemoveAttribute(node, 'aria-label', this.#appliedLabel);
  }
}
