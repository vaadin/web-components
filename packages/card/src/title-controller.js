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
    // Do not provide tag name, as we create the title lazily.
    super(host, 'title', null, { useUniqueId: true, uniqueIdPrefix: 'card-title' });
  }

  /**
   * Set title based on the corresponding host property.
   * A custom slotted title takes precedence over the string title.
   *
   * @param {string} title
   */
  setTitle(title) {
    this.title = title;

    if (title && title.trim() !== '') {
      this.tagName = 'div';
    } else {
      // Clearing the string title removes the generated node.
      this.tagName = null;
      this.defaultNode?.remove();
    }

    this.update();
  }

  /**
   * Set heading level based on the corresponding host property.
   *
   * @param {number} level
   */
  setLevel(level) {
    this.level = level;
    this.update();
  }

  /**
   * Override method inherited from `SlotController` to label the card by
   * the title node. The title node gets a
   * generated ID if it has none. The generated title node is set up as
   * a heading. A custom title keeps its own role.
   *
   * @param {Node} node
   * @protected
   * @override
   */
  initNode(node) {
    if (!node.id) {
      node.id = this.defaultId;
    }

    if (node === this.defaultNode) {
      node.setAttribute('role', 'heading');
    }

    this.#labelId = node.id;
    addValuesToAttribute(this.host, 'aria-labelledby', this.#labelId);
  }

  /**
   * Override method inherited from `SlotController`
   * to drop the labelling by the removed title node.
   *
   * @param {Node} _node
   * @protected
   * @override
   */
  teardownNode(_node) {
    removeValuesFromAttribute(this.host, 'aria-labelledby', this.#labelId);
    this.#labelId = undefined;
  }

  /**
   * Override method inherited from `SlotController`
   * to update the default title element.
   *
   * @protected
   * @override
   */
  update() {
    super.update();

    const { node } = this;
    if (node === this.defaultNode) {
      node.textContent = this.title;
      node.setAttribute('aria-level', this.level || 2);
    }
  }
}
