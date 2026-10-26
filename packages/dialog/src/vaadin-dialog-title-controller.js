/**
 * @license
 * Copyright (c) 2017 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { setOrRemoveAttribute } from '@vaadin/component-base/src/dom-utils.js';
import { SlotChildObserveController } from '@vaadin/component-base/src/slot-child-observe-controller.js';

/**
 * A controller to manage the dialog title element and to label the dialog by it.
 */
export class TitleController extends SlotChildObserveController {
  constructor(host) {
    // Do not provide tag name, as we create the title lazily.
    super(host, 'title', null);
  }

  /**
   * Set title based on the corresponding host property.
   *
   * @param {string | null | undefined} title
   */
  setTitle(title) {
    this.title = title;

    if (!title) {
      // Clearing the string title removes the generated node.
      this.defaultNode?.remove();
    } else if (!this.getSlotChild()) {
      this.restoreDefaultNode();
    }

    this.updateDefaultNode(this.defaultNode);
  }

  /**
   * Set heading level based on the corresponding host property.
   *
   * @param {number} level
   */
  setLevel(level) {
    this.level = level;

    this.updateDefaultNode(this.defaultNode);
  }

  /**
   * Override method inherited from `SlotChildObserveController`
   * to create the default title element when a title is set.
   *
   * @protected
   * @override
   */
  restoreDefaultNode() {
    if (this.title) {
      this.tagName = 'h2';

      const node = this.attachDefaultNode();
      node.classList.add('draggable');
    }
  }

  /**
   * Override method inherited from `SlotChildObserveController`
   * to update the default title element text content and heading level.
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

  /**
   * Override method inherited from `SlotChildObserveController`
   * to label the dialog by the title node, generated or custom.
   *
   * @param {Node | undefined} node
   * @protected
   * @override
   */
  _notifyChange(node) {
    super._notifyChange(node);

    this.#updateHostLabel();
  }

  /**
   * Label the host by the title node, if any.
   */
  #updateHostLabel() {
    const titleNode = this.getSlotChild();

    setOrRemoveAttribute(this.host, 'aria-labelledby', titleNode ? titleNode.id : null);
  }
}
