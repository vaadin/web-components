/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotChildObserveController } from '@vaadin/component-base/src/slot-child-observe-controller.js';

/**
 * A controller that manages the helper node content.
 */
export class HelperController extends SlotChildObserveController {
  constructor(host) {
    // Do not provide tag name, as we create helper lazily.
    super(host, 'helper', null);
  }

  /**
   * Set helper text based on corresponding host property.
   *
   * @param {string} helperText
   */
  setHelperText(helperText) {
    this.helperText = helperText;

    if (helperText && helperText.trim() !== '') {
      this.tagName = 'div';
    }

    this.update();
  }

  /**
   * Override method inherited from `SlotChildObserveController`
   * to update the default helper element text content.
   *
   * @param {Node} node
   * @protected
   * @override
   */
  updateNode(node) {
    if (node === this.defaultNode) {
      const text = this.helperText ?? '';
      if (node.textContent !== text) {
        node.textContent = text;
      }
    }
  }
}
