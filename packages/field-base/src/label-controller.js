/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotObserveController } from '@vaadin/component-base/src/slot-observe-controller.js';

/**
 * A controller to manage the label element.
 */
export class LabelController extends SlotObserveController {
  constructor(host) {
    super(host, 'label', 'label');
  }

  /**
   * Set label based on corresponding host property.
   *
   * @param {string} label
   */
  setLabel(label) {
    this.label = label;

    const labelNode = this.getSlotChild();
    if (!labelNode || labelNode === this.defaultNode) {
      this.applyDefaultNode(labelNode);
    }
  }

  /**
   * Override method inherited from `SlotMutationController`
   * to update the default label text based on the `label`.
   *
   * @param {Node | undefined} node
   * @protected
   * @override
   */
  applyDefaultNode(node) {
    const { label } = this;

    const hasLabel = label && label.trim() !== '';
    let labelNode = node;

    // Restore the default label.
    if (hasLabel && !node) {
      labelNode = this.attachDefaultNode();

      // Observe the default label.
      this.observeNode(labelNode);
    }

    if (labelNode) {
      labelNode.textContent = label;
    }

    // Notify the host after node is updated.
    super.applyDefaultNode(labelNode);
  }

  /**
   * Override method inherited from `SlotMixin` to observe
   * the default label node, but not the custom one.
   *
   * @param {Node} node
   * @protected
   * @override
   */
  initNode(node) {
    if (node === this.defaultNode) {
      this.applyDefaultNode(node);
      this.observeNode(node);
    }
  }

  /**
   * Override to observe the newly added custom node.
   *
   * @param {Node} node
   * @protected
   * @override
   */
  initCustomNode(node) {
    // Notify the host about adding a custom node.
    super.initCustomNode(node);

    this.observeNode(node);
  }
}
