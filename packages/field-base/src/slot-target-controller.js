/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A controller to copy the content from a source slot to a target element.
 */
export class SlotTargetController {
  constructor(sourceSlot, targetFactory, callback) {
    /**
     * The source `<slot>` element to copy nodes from.
     */
    this.sourceSlot = sourceSlot;

    /**
     * Function used to get a reference to slot target.
     */
    this.targetFactory = targetFactory;

    /**
     * Function called after copying nodes to target.
     */
    this.copyCallback = callback;

    if (sourceSlot) {
      sourceSlot.addEventListener('slotchange', () => {
        // Copy in progress, ignore this event.
        if (this.__copying) {
          this.__copying = false;
        } else {
          this.__checkAndCopyNodesToSlotTarget();
        }
      });
    }
  }

  hostConnected() {
    this.__sourceSlotObserver = new MutationObserver(() => this.__checkAndCopyNodesToSlotTarget());

    // Ensure the content is up to date when host is connected
    // to handle e.g. mutating text content while disconnected.
    this.__checkAndCopyNodesToSlotTarget();
  }

  /**
   * Copies every node from the source slot to the target element
   * once the source slot' content is changed.
   *
   * @private
   */
  __checkAndCopyNodesToSlotTarget() {
    this.__sourceSlotObserver.disconnect();

    // Ensure slot target element is up to date.
    const slotTarget = this.targetFactory();

    if (!slotTarget) {
      return;
    }

    // Remove any existing clones from the slot target
    if (this.__slotTargetClones) {
      this.__slotTargetClones.forEach((node) => {
        if (node.parentElement === slotTarget) {
          slotTarget.removeChild(node);
        }
      });
      delete this.__slotTargetClones;
    }

    // Exclude whitespace text nodes
    const nodes = this.sourceSlot
      .assignedNodes({ flatten: true })
      .filter((node) => !(node.nodeType == Node.TEXT_NODE && node.textContent.trim() === ''));

    if (nodes.length > 0) {
      slotTarget.innerHTML = '';

      // Ignore next slotchange
      this.__copying = true;

      this.__copyNodesToSlotTarget(nodes, slotTarget);
    }
  }

  /**
   * Copies the nodes to the target element.
   *
   * @param {!Array<!Node>} nodes
   * @param {HTMLElement} slotTarget
   * @private
   */
  __copyNodesToSlotTarget(nodes, slotTarget) {
    this.__slotTargetClones = this.__slotTargetClones || [];

    nodes.forEach((node) => {
      // Clone the nodes and append the clones to the target
      const clone = node.cloneNode(true);
      this.__slotTargetClones.push(clone);

      slotTarget.appendChild(clone);

      // Observe all changes to the source node to have the clones updated
      this.__sourceSlotObserver.observe(node, {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true
      });
    });

    // Run callback e.g. to show a deprecation warning
    if (typeof this.copyCallback === 'function') {
      this.copyCallback(nodes);
    }
  }
}
