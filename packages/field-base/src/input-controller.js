/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotContentController } from '@vaadin/component-base/src/slot-content-controller.js';

/**
 * A controller to create and initialize slotted `<input>` element.
 */
export class InputController extends SlotContentController {
  #callback;

  constructor(host, callback, options = {}) {
    super(host, 'input', { idPrefix: options.uniqueIdPrefix || 'input' });

    this.#callback = callback;
  }

  /**
   * Override method from `SlotContentController` to create the default input element.
   *
   * @return {HTMLInputElement}
   * @protected
   * @override
   */
  createDefaultNode() {
    return document.createElement('input');
  }

  /**
   * Override method from `SlotContentController` to apply the host value
   * and type to the input element, and to pass it to the callback.
   *
   * @param {HTMLInputElement} node
   * @protected
   * @override
   */
  _initNode(node) {
    const { host } = this;
    if (host.value) {
      node.value = host.value;
    }
    if (host.type) {
      node.setAttribute('type', host.type);
    }

    if (typeof this.#callback === 'function') {
      this.#callback(node);
    }
  }
}
