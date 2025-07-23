/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotChildObserveController } from '@vaadin/component-base/src/slot-child-observe-controller.js';

/**
 * A controller to manage the title element.
 */
export class TitleController extends SlotChildObserveController {
  constructor(host) {
    super(host, 'title', 'div');
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
   * Set level based on corresponding host property.
   *
   * @param {string} level
   */
  setLevel(level) {
    this.level = level;

    // When default title is used, update it.
    if (this.node === this.defaultNode) {
      this.updateDefaultNode(this.node);
    }
  }

  /**
   * Override method inherited from `SlotController`
   * to customize heading on the default title node.
   *
   * @param {Node} node
   * @protected
   * @override
   */
  initNode(node) {
    if (node === this.defaultNode) {
      node.setAttribute('role', 'heading');
    }

    this.host.setAttribute('aria-labelledby', node.id);
  }

  /**
   * Override method inherited from `SlotChildObserveController`
   * to restore the default title element.
   *
   * @protected
   * @override
   */
  restoreDefaultNode() {
    const { title } = this;

    // Restore the default title.
    if (title && title.trim() !== '') {
      const node = this.attachDefaultNode();
      this.initNode(node);
    }
  }

  /**
   * Override method inherited from `SlotChildObserveController`
   * to update the default title element.
   *
   * @param {Node | undefined} node
   * @protected
   * @override
   */
  updateDefaultNode(node) {
    if (node) {
      node.textContent = this.title;
      node.setAttribute('aria-level', this.level);
    }

    // Notify the host after update.
    super.updateDefaultNode(node);
  }
}
