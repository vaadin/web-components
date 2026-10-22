/**
 * @license
 * Copyright (c) 2024 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { addValuesToAttribute, removeValuesFromAttribute } from '@vaadin/component-base/src/dom-utils.js';
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
   * Override method inherited from `SlotController` to label the card by
   * the title node, and to set up the generated title node as a heading.
   * A custom title keeps its own role.
   *
   * @param {Node} node
   * @protected
   * @override
   */
  initNode(node) {
    if (!node) {
      return;
    }

    if (node === this.defaultNode) {
      node.setAttribute('role', 'heading');
    }

    addValuesToAttribute(this.host, 'aria-labelledby', node.id);
  }

  /**
   * Override method inherited from `SlotController` to set a generated ID
   * on a custom title without one, and to clear the string title property,
   * as a custom title takes over.
   *
   * @param {Node} node
   * @protected
   * @override
   */
  initCustomNode(node) {
    if (!node.id) {
      node.id = this.constructor.generateId(this.host, 'card-title');
    }

    this.host.cardTitle = '';
  }

  /**
   * Override method inherited from `SlotController` to drop the labelling
   * by the title node that leaves the slot, and to restore the generated
   * title once a custom title leaves an empty slot.
   *
   * @param {Node} node
   * @protected
   * @override
   */
  teardownNode(node) {
    removeValuesFromAttribute(this.host, 'aria-labelledby', node.id);

    if (!this.getSlotChild()) {
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
