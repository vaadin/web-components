/**
 * @license
 * Copyright (c) 2019 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotChildObserveController } from '@vaadin/component-base/src/slot-child-observe-controller.js';

/**
 * A controller to manage the widget or section title element.
 */
export class TitleController extends SlotChildObserveController {
  constructor(host) {
    super(host, 'title', null);
  }

  /**
   * Set title based on corresponding host property.
   *
   * @param {string} title
   */
  setTitle(title) {
    this.title = title;

    // Restore the default title, if needed.
    const titleNode = this.getSlotChild();
    if (!titleNode) {
      this.restoreDefaultNode();
    }

    // When default title is used, update it.
    if (this.node === this.defaultNode) {
      this.updateDefaultNode(this.node);
    }
  }

  /**
   * Override method inherited from `SlotChildObserveController`
   * to restore and observe the default title element.
   *
   * @protected
   * @override
   */
  restoreDefaultNode() {
    this.tagName = 'h2';
    this.attachDefaultNode();
  }

  /**
   * Override method inherited from `SlotChildObserveController`
   * to update the default title element text content.
   *
   * @param {Node | undefined} node
   * @protected
   * @override
   */
  updateDefaultNode(node) {
    if (node) {
      node.textContent = this.title;
    }

    // Notify the host after update.
    super.updateDefaultNode(node);
  }
}
