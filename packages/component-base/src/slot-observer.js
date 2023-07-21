/**
 * @license
 * Copyright (c) 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A helper for observing slot changes.
 */
export class SlotObserver {
  constructor(slot, callback) {
    /** @type HTMLSlotElement */
    this.slot = slot;

    /** @type Function */
    this.callback = callback;

    /** @type {Node[]} */
    this._storedNodes = [];

    this._processNodes();

    slot.addEventListener('slotchange', () => {
      this._processNodes();
    });
  }

  /**
   * Run the observer callback synchronously.
   */
  flush() {
    this._processNodes();
  }

  /** @private */
  _processNodes() {
    const currentNodes = this.slot.assignedNodes({ flatten: true });

    let addedNodes = [];
    let removedNodes = [];

    if (currentNodes.length) {
      addedNodes = currentNodes.filter((node) => !this._storedNodes.includes(node));
    }

    if (this._storedNodes.length) {
      removedNodes = this._storedNodes.filter((node) => !currentNodes.includes(node));
    }

    if (addedNodes.length || removedNodes.length) {
      this.callback({ addedNodes, removedNodes });
    }

    this._storedNodes = currentNodes;
  }
}
