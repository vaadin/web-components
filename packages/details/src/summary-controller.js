/**
 * @license
 * Copyright (c) 2019 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotChildObserveController } from '@vaadin/component-base/src/slot-child-observe-controller.js';

/**
 * A controller to manage the summary element.
 */
export class SummaryController extends SlotChildObserveController {
  constructor(host, tagName) {
    super(host, 'summary', tagName);
  }

  /**
   * Set summary based on corresponding host property.
   *
   * @param {string} summary
   */
  setSummary(summary) {
    this.summary = summary;
    this.update();
  }

  /**
   * Override method inherited from `SlotChildObserveController`
   * to update the default summary element text content.
   *
   * @param {Node} node
   * @protected
   * @override
   */
  updateNode(node) {
    super.updateNode(node);

    if (node === this.defaultNode) {
      node.textContent = this.summary;
    }
  }
}
