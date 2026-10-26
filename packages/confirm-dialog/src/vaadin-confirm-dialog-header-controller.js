/**
 * @license
 * Copyright (c) 2018 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { hasNodeContent, setOrRemoveAttribute } from '@vaadin/component-base/src/dom-utils.js';
import { SlotChildObserveController } from '@vaadin/component-base/src/slot-child-observe-controller.js';

/**
 * A controller to manage the confirm dialog header element and to label the dialog by it.
 */
export class HeaderController extends SlotChildObserveController {
  constructor(host) {
    super(host, 'header', 'h3');
  }

  /**
   * Set header based on the corresponding host property.
   *
   * @param {string | null | undefined} header
   */
  setHeader(header) {
    this.header = header;

    this.updateDefaultNode(this.defaultNode);
  }

  /**
   * Set heading level based on the corresponding host property.
   *
   * @param {number | null | undefined} level
   */
  setLevel(level) {
    this.level = level;

    this.updateDefaultNode(this.defaultNode);
  }

  /**
   * Override method inherited from `SlotChildObserveController`
   * to restore the default header element.
   *
   * @protected
   * @override
   */
  restoreDefaultNode() {
    this.attachDefaultNode();
  }

  /**
   * Override method inherited from `SlotChildObserveController`
   * to update the default header element text content and heading level.
   *
   * @param {Node | undefined} node
   * @protected
   * @override
   */
  updateDefaultNode(node) {
    if (node) {
      node.textContent = this.header ?? '';
      node.setAttribute('aria-level', this.level ?? 1);
    }

    // Notify the host after update.
    super.updateDefaultNode(node);
  }

  /**
   * Override method inherited from `SlotChildObserveController`
   * to label the dialog by the header node, generated or custom.
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
   * Label the host by the header node, if any. Fall back to
   * a generic accessible name when there is no header.
   */
  #updateHostLabel() {
    const { host } = this;
    const headerNode = this.getSlotChild();
    const hasHeader = hasNodeContent(headerNode);

    setOrRemoveAttribute(host, 'aria-labelledby', hasHeader ? headerNode.id : null);
    setOrRemoveAttribute(host, 'aria-label', hasHeader ? null : 'confirmation');
  }
}
