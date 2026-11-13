/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlottedContentController } from '@vaadin/component-base/src/slotted-content-controller.js';

/**
 * A controller to create and initialize slotted `<textarea>` element.
 */
export class TextAreaController extends SlottedContentController {
  #callback;

  constructor(host, callback) {
    super(host, 'textarea', { idPrefix: 'textarea' });

    this.#callback = callback;
  }

  /**
   * Override method from `SlottedContentController` to create the default textarea element.
   *
   * @return {HTMLTextAreaElement}
   * @protected
   * @override
   */
  createDefaultNode() {
    return document.createElement('textarea');
  }

  /**
   * Override method from `SlottedContentController` to apply the host value
   * and name attributes to the textarea element, and to pass it to the callback.
   *
   * @param {HTMLTextAreaElement} node
   * @protected
   * @override
   */
  _initNode(node) {
    const { host } = this;
    const value = host.getAttribute('value');
    if (value) {
      node.value = value;
    }

    const name = host.getAttribute('name');
    if (name) {
      node.setAttribute('name', name);
    }

    if (typeof this.#callback === 'function') {
      this.#callback(node);
    }
  }
}
