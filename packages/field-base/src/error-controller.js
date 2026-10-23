/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { announce } from '@vaadin/a11y-base/src/announce.js';
import { SlotChildObserveController } from '@vaadin/component-base/src/slot-child-observe-controller.js';

/**
 * A controller that manages the error message node content.
 */
export class ErrorController extends SlotChildObserveController {
  constructor(host) {
    super(host, 'error-message', 'div');
  }

  get #hasError() {
    const { errorMessage, invalid } = this;
    return Boolean(invalid && errorMessage && errorMessage.trim() !== '');
  }

  /**
   * Set the error message element text content.
   *
   * @param {string} errorMessage
   */
  setErrorMessage(errorMessage) {
    this.errorMessage = errorMessage;
    this.#announce();
    this.update();
  }

  /**
   * Set invalid state for detecting whether to show error message.
   *
   * @param {boolean} invalid
   */
  setInvalid(invalid) {
    this.invalid = invalid;
    this.#announce();
    this.update();
  }

  /**
   * Override to save the custom error message content on the host.
   *
   * @param {Node} errorNode
   * @protected
   * @override
   */
  initNode(errorNode) {
    if (errorNode !== this.defaultNode && errorNode.textContent && !this.errorMessage) {
      this.errorMessage = errorNode.textContent.trim();
    }

    super.initNode(errorNode);
  }

  /**
   * Override method inherited from `SlotChildObserveController`
   * to update the error message text and hidden state.
   *
   * Note: unlike with other controllers, this method is
   * called for both default and custom error message.
   *
   * @param {Node} errorNode
   * @protected
   * @override
   */
  updateNode(errorNode) {
    super.updateNode(errorNode);

    const hasError = this.#hasError;
    errorNode.textContent = hasError ? this.errorMessage : '';
    errorNode.hidden = !hasError;
  }

  #announce() {
    if (this.#hasError && this.node) {
      // Assertive mode ensures VoiceOver reads
      // the error message on commit with Enter.
      announce(this.errorMessage, { mode: 'assertive' });
    }
  }
}
