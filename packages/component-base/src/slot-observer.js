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

    this._scheduled = false;

    slot.addEventListener('slotchange', () => {
      this._schedule();
    });

    this._schedule();
  }

  /** @private */
  _schedule() {
    if (!this._scheduled) {
      this._scheduled = true;

      queueMicrotask(() => {
        this.flush();
      });
    }
  }

  /**
   * Run the observer callback synchronously.
   */
  flush() {
    this._scheduled = false;

    this._processNodes();
  }

  /** @private */
  _processNodes() {
    const currentNodes = this.slot.assignedNodes({ flatten: true });

    let addedNodes = [];
    const removedNodes = [];
    const movedNodes = [];

    if (currentNodes.length) {
      addedNodes = currentNodes.filter((node) => !this._storedNodes.includes(node));
    }

    if (this._storedNodes.length) {
      this._storedNodes.forEach((node, index) => {
        const idx = currentNodes.indexOf(node);
        if (idx === -1) {
          removedNodes.push(node);
        } else if (idx !== index) {
          movedNodes.push(node);
        }
      });
    }

    if (addedNodes.length || removedNodes.length || movedNodes.length) {
      this.callback({ addedNodes, movedNodes, removedNodes });
    }

    this._storedNodes = currentNodes;
  }
}
