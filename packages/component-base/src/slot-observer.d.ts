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
 * the target and diffs the union of `assignedNodes({ flatten: true })` across
 * every descendant `<slot>`. Cross-slot reassignment of the same node does
 * not change the union and therefore fires no callback.
 */
export class SlotObserver {
  constructor(
    target: HTMLSlotElement | DocumentFragment,
    callback: (info: { addedNodes: Node[]; currentNodes: Node[]; movedNodes: Node[]; removedNodes: Node[] }) => void,
    forceInitial?: boolean,
  );

  readonly target: HTMLSlotElement | DocumentFragment;

  /**
   * Activates an observer. This method is automatically called when
   * a `SlotObserver` is created. It should only be called to  re-activate
   * an observer that has been deactivated via the `disconnect` method.
   */
  connect(): void;

  /**
   * Deactivates the observer. After calling this method the observer callback
   * will not be called when changes to slotted nodes occur. The `connect` method
   * may be subsequently called to reactivate the observer.
   */
  disconnect(): void;

  /**
   * Run the observer callback synchronously.
   */
  flush(): void;
}
