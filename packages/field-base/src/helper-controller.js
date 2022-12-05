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

    const helperNode = this.getSlotChild();
    if (!helperNode || helperNode === this.defaultNode) {
      this.applyDefaultNode(helperNode);
    }
  }

  /**
   * Override method inherited from `SlotMutationController`
   * to create the default helper element lazily as needed.
   *
   * @param {Node | undefined} node
   * @protected
   * @override
   */
  applyDefaultNode(node) {
    const { helperText } = this;
    const hasHelperText = helperText && helperText.trim() !== '';
    let helperNode = node;

    // No helper yet, create one.
    if (hasHelperText && !node) {
      this.tagName = 'div';

      helperNode = this.attachDefaultNode();

      // Observe the default node.
      this.observeNode(helperNode);
    }

    if (helperNode) {
      helperNode.textContent = helperText;
    }

    // Notify the host after node is created.
    super.applyDefaultNode(helperNode);
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
