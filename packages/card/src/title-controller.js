/**
 * @license
 * Copyright (c) 2024 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';

/**
 * A controller to manage the card title element.
 */
export class TitleController extends SlotController {
  constructor(host) {
    // Do not provide tag name, as we create the title lazily.
    super(host, 'title', null, { useUniqueId: true, uniqueIdPrefix: 'card-title' });
  }

  /**
   * Set title based on the corresponding host property.
   *
   * @param {string} title
   */
  setTitle(title) {
    this.title = title;

    if (title && title.trim() !== '') {
      // The string title replaces a custom slotted title, if any.
      const child = this.getSlotChild();
      if (child && child !== this.defaultNode) {
        child.remove();
      }

      // Create or restore the default title node.
      this.restoreDefaultNode();
      this.updateDefaultNode(this.node);
    } else if (this.node && this.node === this.defaultNode) {
      // Clearing the string title removes the generated node.
      this.node.remove();
    }
  }

  /**
   * Set heading level based on the corresponding host property.
   *
   * @param {number} level
   */
  setLevel(level) {
    this.level = level;

    // When the default title is used, update it.
    if (this.node && this.node === this.defaultNode) {
      this.updateDefaultNode(this.node);
    }
  }

  /**
   * Override method inherited from `SlotController` to set up the default
   * title node as a heading and label the card by it. The heading role and
   * `aria-labelledby` are only applied to the generated string title, never
   * to a custom slotted title.
   *
   * @param {Node} node
   * @protected
   * @override
   */
  initNode(node) {
    if (node && node === this.defaultNode) {
      node.setAttribute('role', 'heading');
      this.host.setAttribute('aria-labelledby', node.id);
    }
  }

  /**
   * Override method inherited from `SlotController` to clear the string
   * title property, as a custom title takes over.
   *
   * @param {Node} _node
   * @protected
   * @override
   */
  initCustomNode(_node) {
    this.host.cardTitle = '';
  }

  /**
   * Override method inherited from `SlotController` to drop the labelling
   * once the generated title node leaves the slot, and to restore the
   * generated title once a custom title leaves an empty slot.
   *
   * @param {Node} _node
   * @protected
   * @override
   */
  teardownNode(_node) {
    const child = this.getSlotChild();

    if (child !== this.defaultNode) {
      this.host.removeAttribute('aria-labelledby');
    }

    if (!child) {
      this.restoreDefaultNode();
      this.updateDefaultNode(this.node);
    }
  }

  /**
   * Create the default title element lazily as needed.
   *
   * @protected
   */
  restoreDefaultNode() {
    const { title } = this;

    // No title yet, create one.
    if (title && title.trim() !== '') {
      this.tagName = 'div';

      const node = this.attachDefaultNode();
      node.id = this.defaultId;
      this.initNode(node);
    }
  }

  /**
   * Update the default title element.
   *
   * @param {Node | undefined} node
   * @protected
   */
  updateDefaultNode(node) {
    if (node) {
      node.textContent = this.title;
      node.setAttribute('aria-level', this.level || 2);
    }
  }
}
