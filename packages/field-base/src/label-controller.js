/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotContentController } from '@vaadin/component-base/src/slot-content-controller.js';

/**
 * A controller to manage the label element.
 */
export class LabelController extends SlotContentController {
  constructor(host) {
    super(host, 'label', { idPrefix: 'label', observeContent: true });
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
   * Override method from `SlotContentController` to create the default label element.
   *
   * @return {HTMLLabelElement}
   * @protected
   * @override
   */
  createDefault() {
    return document.createElement('label');
  }

  /**
   * Override method from `SlotContentController` to show the label text
   * in the default label element. A custom label keeps its own content.
   *
   * @param {Node} node
   * @protected
   * @override
   */
  updateNode(node) {
    if (node === this.defaultNode) {
      node.textContent = this.label;
    }
  }
}
