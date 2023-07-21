/**
 * @license
 * Copyright (c) 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A helper for observing slot changes.
 */
export class SlotObserver {
  constructor(slot: HTMLSlotElement, callback: (info: { addedNodes: Node[]; removedNodes: Node[] }) => void);

  /**
   * Run the observer callback synchronously.
   */
  flush(): void;
}
