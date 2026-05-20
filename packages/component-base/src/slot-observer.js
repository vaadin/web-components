/**
 * @license
 * Copyright (c) 2023 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A helper for observing slot or shadow-root changes.
 *
 * When `target` is an `HTMLSlotElement`, the observer listens for `slotchange`
 * on the slot itself and diffs `target.assignedNodes({ flatten: true })`.
 *
 * When `target` is a `ShadowRoot` (or any element that contains `<slot>`
 * descendants), the observer listens for `slotchange` events bubbling up to
 * the target and diffs the **union** of `assignedNodes({ flatten: true })`
 * across every descendant `<slot>`. Cross-slot reassignment of the same node
 * does not change the union and therefore fires no callback.
 *
 * Note: in target mode the observer relies on `slotchange` events. Removing
 * a `<slot>` element itself from the target does not fire `slotchange`, so
 * such structural changes to the shadow tree are not observed; trigger
 * `flush()` manually if the shadow tree's slot set is changed at runtime.
 */
export class SlotObserver {
  constructor(target, callback, forceInitial) {
    /** @type {HTMLSlotElement | Element | DocumentFragment} */
    this.target = target;

    /** @type {Function} */
    this.callback = callback;

    /** @type {boolean} */
    this.forceInitial = forceInitial;

    /** @type {Node[]} */
    this._storedNodes = [];

    /** @type {Map<HTMLSlotElement, Node[]>} */
    this._storedPerSlot = new Map();

    /** @type {boolean} */
    this._isSlot = target instanceof HTMLSlotElement;

    this._connected = false;
    this._scheduled = false;

    this._boundSchedule = () => {
      this._schedule();
    };

    this.connect();
    this._schedule();
  }

  /**
   * Activates an observer. This method is automatically called when
   * a `SlotObserver` is created. It should only be called to  re-activate
   * an observer that has been deactivated via the `disconnect` method.
   */
  connect() {
    this.target.addEventListener('slotchange', this._boundSchedule);
    this._connected = true;
  }

  /**
   * Deactivates the observer. After calling this method the observer callback
   * will not be called when changes to slotted nodes occur. The `connect` method
   * may be subsequently called to reactivate the observer.
   */
  disconnect() {
    this.target.removeEventListener('slotchange', this._boundSchedule);
    this._connected = false;
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
    if (!this._connected) {
      return;
    }

    this._scheduled = false;

    this._processNodes();
  }

  /** @private */
  _collectNodes() {
    const slots = this._isSlot ? [this.target] : this.target.querySelectorAll('slot');
    const perSlot = new Map();
    slots.forEach((slot) => {
      perSlot.set(slot, slot.assignedNodes({ flatten: true }));
    });
    return perSlot;
  }

  /**
   * Collect moved nodes reordered within its current slot,
   * but not those that are assigned to different slot.
   *
   * @private
   */
  _collectMovedNodes(perSlot) {
    const movedNodes = [];

    perSlot.forEach((nodes, slot) => {
      const stored = this._storedPerSlot.get(slot) || [];
      // Skip slots whose membership changed: nodes entered or left the slot.
      if (stored.length !== nodes.length || stored.some((node) => !nodes.includes(node))) {
        return;
      }
      stored.forEach((node, storedIndex) => {
        if (nodes.indexOf(node) !== storedIndex) {
          movedNodes.push(node);
        }
      });
    });

    return movedNodes;
  }

  /** @private */
  _processNodes() {
    const perSlot = this._collectNodes();
    const currentNodes = [...new Set([...perSlot.values()].flat())];

    const addedNodes = currentNodes.filter((node) => !this._storedNodes.includes(node));
    const removedNodes = this._storedNodes.filter((node) => !currentNodes.includes(node));
    const movedNodes = this._collectMovedNodes(perSlot);

    // By default, callback is not invoked if there is no child nodes in the slot.
    // Use `forceInitial` flag if needed to also invoke it for the initial state.
    if (addedNodes.length || removedNodes.length || movedNodes.length || this.forceInitial) {
      this.callback({ addedNodes, currentNodes, movedNodes, removedNodes });
    }

    if (this.forceInitial) {
      this.forceInitial = false;
    }

    this._storedNodes = currentNodes;
    this._storedPerSlot = perSlot;
  }
}
