/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotContentController } from '@vaadin/component-base/src/slot-content-controller.js';

/**
 * A controller that manages the helper node content.
 */
export class HelperController extends SlotContentController {
  constructor(host) {
    super(host, 'helper', { idPrefix: 'helper', observeContent: true });
  }

  /**
   * Set helper text based on corresponding host property.
   *
   * @param {string} helperText
   */
  setHelperText(helperText) {
    this.helperText = helperText;
    this.update();
  }

  /**
   * Override method from `SlotContentController` to create the default helper element.
   *
   * @return {HTMLDivElement}
   * @protected
   * @override
   */
  createDefaultNode() {
    return document.createElement('div');
  }

  /**
   * Override method from `SlotContentController` to create the default helper
   * element lazily, once there is helper text, and to keep it from then on.
   *
   * @return {boolean}
   * @protected
   * @override
   */
  shouldRenderDefaultNode() {
    const { helperText } = this;
    return this.defaultNode !== null || Boolean(helperText && helperText.trim() !== '');
  }

  /**
   * Override method from `SlotContentController` to show the helper text in the default helper element.
   *
   * @param {Node} node
   * @protected
   * @override
   */
  _updateNode(node) {
    if (node === this.defaultNode) {
      node.textContent = this.helperText;
    }
  }
}
