/**
 * @license
 * Copyright (c) 2019 - 2025 Vaadin Ltd.
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

    // Restore the default summary, if needed.
    const summaryNode = this.getSlotChild();
    if (!summaryNode) {
      this.restoreDefaultNode();
    }

    // When default summary is used, update it.
    if (this.node === this.defaultNode) {
      this.updateDefaultNode(this.node);
    }
  }

  /**
   * Override method inherited from `SlotChildObserveController`
   * to restore and observe the default summary element.
   *
   * @protected
   * @override
   */
  restoreDefaultNode() {
    const { summary } = this;

    // Restore the default summary.
    if (summary && summary.trim() !== '') {
      this.attachDefaultNode();
    }
  }

  /**
   * Override method inherited from `SlotChildObserveController`
   * to update the default summary element text content.
   *
   * @param {Node | undefined} node
   * @protected
   * @override
   */
  updateDefaultNode(node) {
    if (node) {
      node.textContent = this.summary;
    }

    // Notify the host after update.
    super.updateDefaultNode(node);
  }
}
