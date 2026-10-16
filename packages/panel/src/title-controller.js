/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotChildObserveController } from '@vaadin/component-base/src/slot-child-observe-controller.js';

/**
 * A controller to manage the panel title element.
 */
export class TitleController extends SlotChildObserveController {
  constructor(host) {
    // Do not provide tag name, as we create the title lazily.
    super(host, 'title', null, { uniqueIdPrefix: 'panel-title' });
  }

  /**
   * Set title based on the corresponding host property.
   *
   * @param {string} title
   */
  setTitle(title) {
    this.title = title;

    // A custom slotted title takes precedence over the string title.
    const child = this.getSlotChild();
    if (child && child !== this.defaultNode) {
      return;
    }

    if (title && title.trim() !== '') {
      this.restoreDefaultNode();
      this.updateDefaultNode(this.node);
    } else if (this.node && this.node === this.defaultNode) {
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

    if (this.node && this.node === this.defaultNode) {
      this.updateDefaultNode(this.node);
    }
  }

  /**
   * Override method inherited from `SlotController` to label the host
   * by the title node, and to set the heading role on the generated one.
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

    // A host with role none or presentation opts out of the name.
    const role = this.host.getAttribute('role');
    if (role === 'none' || role === 'presentation') {
      this.host.removeAttribute('aria-labelledby');
    } else {
      this.host.setAttribute('aria-labelledby', node.id);
    }
  }

  /**
   * Override method inherited from `SlotChildObserveController` to drop
   * the reference to a removed node, so that it can be added again, and
   * to drop the labelling when no title is left in the slot.
   *
   * @param {Node} node
   * @protected
   * @override
   */
  teardownNode(node) {
    if (node === this.node) {
      this.node = null;
    }

    super.teardownNode(node);

    if (!this.getSlotChild()) {
      this.host.removeAttribute('aria-labelledby');
    }
  }

  /**
   * Override method inherited from `SlotChildObserveController`
   * to create the default title element lazily as needed.
   *
   * @protected
   * @override
   */
  restoreDefaultNode() {
    const { title } = this;

    if (title && title.trim() !== '') {
      this.tagName = 'div';

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
    if (node && node === this.defaultNode) {
      node.textContent = this.title;
      node.setAttribute('aria-level', this.level || 2);
    }

    super.updateDefaultNode(node);
  }
}
