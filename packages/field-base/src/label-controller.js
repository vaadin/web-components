/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotChildObserveController } from '@vaadin/component-base/src/slot-child-observe-controller.js';

/**
 * A controller to manage the label element.
 */
export class LabelController extends SlotChildObserveController {
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
    this.update();
  }

  /**
   * Override method inherited from `SlotChildObserveController`
   * to update the default label element text content.
   *
   * @param {Node} node
   * @protected
   * @override
   */
  updateNode(node) {
    super.updateNode(node);

    if (node === this.defaultNode) {
      node.textContent = this.label;
    }
  }
}
