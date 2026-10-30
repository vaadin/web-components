/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { announce } from '@vaadin/a11y-base/src/announce.js';
import { SlotContentController } from '@vaadin/component-base/src/slot-content-controller.js';

/**
 * A controller that manages the error message node content.
 */
export class ErrorController extends SlotContentController {
  constructor(host) {
    super(host, 'error-message', { idPrefix: 'error-message' });
  }

  /**
   * Set the error message element text content.
   *
   * @param {string} errorMessage
   */
  setErrorMessage(errorMessage) {
    this.errorMessage = errorMessage;
    this.update();
  }

  /**
   * Set invalid state for detecting whether to show error message.
   *
   * @param {boolean} invalid
   */
  setInvalid(invalid) {
    this.invalid = invalid;
    this.update();
  }

  /**
   * Override method from `SlotContentController` to create the default error message element.
   *
   * @return {HTMLDivElement}
   * @protected
   * @override
   */
  createDefaultNode() {
    return document.createElement('div');
  }

  /**
   * Override method from `SlotContentController` to use the content
   * of a custom error message element as the error message.
   *
   * @param {Node} node
   * @protected
   * @override
   */
  _initNode(node) {
    if (node !== this.defaultNode && node.textContent && !this.errorMessage) {
      this.errorMessage = node.textContent.trim();
    }
  }

  /**
   * Override method from `SlotContentController` to show the error message
   * while the host is invalid. Unlike other controllers, this applies
   * to both the default and a custom error message element.
   *
   * @param {Node} node
   * @protected
   * @override
   */
  _updateNode(node) {
    const { errorMessage, invalid } = this;
    const hasError = Boolean(invalid && errorMessage && errorMessage.trim() !== '');

    node.textContent = hasError ? errorMessage : '';
    node.hidden = !hasError;

    if (hasError) {
      // Assertive mode ensures VoiceOver reads
      // the error message on commit with Enter.
      announce(errorMessage, { mode: 'assertive' });
    }
  }
}
