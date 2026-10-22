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
  /** @type {string | undefined} */
  #labelId;

  constructor(host) {
    super(host, 'title', 'div', { useUniqueId: true, uniqueIdPrefix: 'card-title' });
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
   * the title node instead of the previous one, and to set up the generated
   * title node as a heading. A custom title keeps its own role.
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

    removeValuesFromAttribute(this.host, 'aria-labelledby', this.#labelId);
    this.#labelId = node.id;
    addValuesToAttribute(this.host, 'aria-labelledby', this.#labelId);
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
      node.id = this.defaultId;
    }

    this.host.cardTitle = '';
  }

  /**
   * Override method inherited from `SlotController` to drop the labelling
   * once the slot is empty, and to restore the generated title once a custom
   * title leaves an empty slot. A title that replaces another one is
   * initialized before the old one is torn down.
   *
   * @param {Node} _node
   * @protected
   * @override
   */
  teardownNode(_node) {
    if (!this.getSlotChild()) {
      removeValuesFromAttribute(this.host, 'aria-labelledby', this.#labelId);
      this.#labelId = undefined;

      this.restoreDefaultNode();
      this.updateDefaultNode(this.node);
    }
  }

  /**
   * Override method inherited from `SlotController`
   * to create the default title element lazily as needed.
   *
   * @return {boolean}
   * @protected
   * @override
   */
  shouldAttachDefaultNode() {
    const { title } = this;
    return Boolean(title && title.trim() !== '');
  }

  /**
   * Restore the default title element, if needed.
   *
   * @protected
   */
  restoreDefaultNode() {
    const node = this.attachDefaultNode();
    if (node) {
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
