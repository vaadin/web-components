/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';

/**
 * A controller that manages the error message node content.
 */
export class ErrorController extends SlotController {
  constructor(host) {
    super(
      host,
      'error-message',
      () => document.createElement('div'),
      (_host, node) => {
        this.__updateErrorId(node);

        this.__updateHasError();
      },
      true,
    );
  }

  /**
   * ID attribute value set on the error message element.
   *
   * @return {string}
   */
  get errorId() {
    return this.node && this.node.id;
  }

  /**
   * Set the error message element text content.
   *
   * @param {string} errorMessage
   */
  setErrorMessage(errorMessage) {
    this.errorMessage = errorMessage;

    this.__updateHasError();
  }

  /**
   * Set invalid state for detecting whether to show error message.
   *
   * @param {boolean} invalid
   */
  setInvalid(invalid) {
    this.invalid = invalid;

    this.__updateHasError();
  }

  /**
   * Override to initialize the newly added custom error message.
   *
   * @param {Node} errorNode
   * @protected
   * @override
   */
  initCustomNode(errorNode) {
    this.__updateErrorId(errorNode);

    // Save the custom error message content on the host.
    if (errorNode.textContent && !this.errorMessage) {
      this.errorMessage = errorNode.textContent.trim();
    }

    this.__updateHasError();
  }

  /**
   * Override to cleanup error message node when it's removed.
   *
   * @param {Node} node
   * @protected
   * @override
   */
  teardownNode(node) {
    let errorNode = this.getSlotChild();

    // If custom error was removed, restore the default one.
    if (!errorNode && node !== this.defaultNode) {
      errorNode = this.attachDefaultNode();

      // Run initializer to update default error message ID.
      this.initNode(errorNode);
    }

    this.__updateHasError();
  }

  /**
   * @param {string} error
   * @private
   */
  __isNotEmpty(error) {
    return Boolean(error && error.trim() !== '');
  }

  /** @private */
  __updateHasError() {
    const errorNode = this.node;
    const hasError = Boolean(this.invalid && this.__isNotEmpty(this.errorMessage));

    // Update both default and custom error message node.
    if (errorNode) {
      errorNode.textContent = hasError ? this.errorMessage : '';
      errorNode.hidden = !hasError;

      // Role alert will make the error message announce immediately
      // as the field becomes invalid
      if (hasError) {
        errorNode.setAttribute('role', 'alert');
      } else {
        errorNode.removeAttribute('role');
      }
    }

    this.host.toggleAttribute('has-error-message', hasError);
  }

  /**
   * @param {HTMLElement} errorNode
   * @private
   */
  __updateErrorId(errorNode) {
    if (!errorNode.id) {
      errorNode.id = this.defaultId;
    }
  }
}
