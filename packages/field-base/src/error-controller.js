/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { announce } from '@vaadin/a11y-base/src/announce.js';
import { hasNodeContent } from '@vaadin/component-base/src/dom-utils.js';
import { SlotChildObserveController } from '@vaadin/component-base/src/slot-child-observe-controller.js';

/**
 * A controller that manages the error message node content.
 */
export class ErrorController extends SlotChildObserveController {
  constructor(host) {
    super(host, 'error-message', 'div');
  }

  /**
   * Set the error message element text content.
   *
   * @param {string} errorMessage
   */
  setErrorMessage(errorMessage) {
    this.errorMessage = errorMessage;

    if (this.node) {
      this.node.textContent = errorMessage || '';
    }

    this.updateDefaultNode(this.node);
  }

  /**
   * Set invalid state for detecting whether to show error message.
   *
   * @param {boolean} invalid
   */
  setInvalid(invalid) {
    this.invalid = invalid;

    this.updateDefaultNode(this.node);
  }

  /**
   * Override to set the error message text on the default node.
   *
   * @return {Node}
   * @protected
   * @override
   */
  attachDefaultNode() {
    const node = super.attachDefaultNode();

    if (node) {
      node.textContent = this.errorMessage || '';
    }

    return node;
  }

  /**
   * Override to initialize the newly added error message.
   *
   * @param {Node} errorNode
   * @protected
   * @override
   */
  initNode(errorNode) {
    this.updateDefaultNode(errorNode);
  }

  /**
   * Override method inherited from `SlotChildObserveController`
   * to restore the default error message element.
   *
   * @protected
   * @override
   */
  restoreDefaultNode() {
    this.attachDefaultNode();
  }

  /**
   * Override method inherited from `SlotChildObserveController`
   * to update the error message hidden state.
   *
   * Note: unlike with other controllers, this method is
   * called for both default and custom error message.
   *
   * @param {Node | undefined} errorNode
   * @protected
   * @override
   */
  updateDefaultNode(errorNode) {
    if (errorNode) {
      const hasError = Boolean(this.invalid && hasNodeContent(errorNode));
      errorNode.hidden = !hasError;

      if (hasError) {
        // Assertive mode ensures VoiceOver reads
        // the error message on commit with Enter.
        announce(errorNode.textContent.trim(), { mode: 'assertive' });
      }
    }

    // Notify the host after update.
    super.updateDefaultNode(errorNode);
  }
}
