/**
 * @license
 * Copyright (c) 2022 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { hasNodeContent } from './dom-utils.js';
import { SlotController } from './slot-controller.js';

/**
 * A controller that observes slotted element mutations, especially ID attribute
 * and the text content, and fires an event to notify host element about those.
 */
export class SlotChildObserveController extends SlotController {
  /** @type {MutationObserver} */
  #nodeObserver = new MutationObserver(() => this.update());

  constructor(host, slot, tagName, config = {}) {
    super(host, slot, tagName, { ...config, useUniqueId: true });
  }

  /**
   * Override to apply host property values to the node. Called on every
   * update, also when the node text changes, so only write values that differ.
   *
   * @param {Node} _node
   * @protected
   */
  updateNode(_node) {}

  /**
   * Override method inherited from `SlotController` to set ID
   * on the new node and observe its ID and text content.
   *
   * @param {Node} node
   * @protected
   * @override
   */
  initNode(node) {
    this.#setDefaultId(node);

    this.#nodeObserver.observe(node, {
      attributes: true,
      attributeFilter: ['id'],
      childList: true,
      subtree: true,
      characterData: true,
    });

    super.initNode(node);
  }

  /**
   * Override method inherited from `SlotController`
   * to stop observing the removed node.
   *
   * @param {Node} _node
   * @protected
   * @override
   */
  teardownNode(_node) {
    this.#nodeObserver.disconnect();
  }

  /**
   * Override method inherited from `SlotController` to apply property values
   * to the node and notify the host. Call it when a host property used by
   * `updateNode()` changes.
   *
   * @protected
   * @override
   */
  update() {
    if (!this.initialized) {
      return;
    }

    super.update();

    const { node } = this;
    if (node) {
      this.#setDefaultId(node);
      this.updateNode(node);
    }

    this._notifyChange(node);
  }

  /**
   * Fire an event to notify the controller host about node changes.
   *
   * @param {Node | null} node
   * @protected
   */
  _notifyChange(node) {
    this.dispatchEvent(
      new CustomEvent('slot-content-changed', {
        detail: { hasContent: hasNodeContent(node), node },
      }),
    );
  }

  #setDefaultId(node) {
    if (node.nodeType === Node.ELEMENT_NODE && !node.id) {
      node.id = this.defaultId;
    }
  }
}
