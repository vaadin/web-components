/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotObserveController } from '@vaadin/component-base/src/slot-observe-controller.js';

/**
 * A controller that manages the helper node content.
 */
export class HelperController extends SlotObserveController {
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

    // Restore the default helper, if needed.
    const helperNode = this.getSlotChild();
    if (!helperNode) {
      this.restoreDefaultNode();
    }

    // When default helper is used, update it.
    if (this.node === this.defaultNode) {
      this.updateDefaultNode(this.node);
    }
  }

  /**
   * Override method inherited from `SlotObserveController`
   * to create the default helper element lazily as needed.
   *
   * @param {Node | undefined} node
   * @protected
   * @override
   */
  restoreDefaultNode() {
    const { helperText } = this;

    // No helper yet, create one.
    if (helperText && helperText.trim() !== '') {
      this.tagName = 'div';

      const helperNode = this.attachDefaultNode();

      // Observe the default node.
      this.observeNode(helperNode);
    }
  }

  /**
   * Override method inherited from `SlotObserveController`
   * to update the default helper element text content.
   *
   * @param {Node | undefined} node
   * @protected
   * @override
   */
  updateDefaultNode(node) {
    if (node) {
      node.textContent = this.helperText;
    }

    // Notify the host after update.
    super.updateDefaultNode(node);
  }

  /**
   * Override to observe the newly added custom node.
   *
   * @param {Node} node
   * @protected
   * @override
   */
  initCustomNode(node) {
    // Notify the host about a custom slotted helper.
    super.initCustomNode(node);

    this.observeNode(node);
  }
}
