/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';

/**
 * A controller for observing content changes in a slot.
 */
export class SlotContentController {
  constructor(host, slotName) {
    this.host = host;
    this.slotName = slotName;
  }

  hostConnected() {
    if (!this.initialized) {
      const { host, slotName } = this;
      const selector = slotName === '' ? 'slot:not([name])' : `slot[name=${slotName}]`;
      const slot = host.shadowRoot.querySelector(selector);

      this.__slotObserver = new FlattenedNodesObserver(slot, (info) => {
        const current = this.currentNode;

        const newNode = info.addedNodes.find((node) => node !== current);
        const oldNode = info.removedNodes.find((node) => node === current);

        if (newNode) {
          // Custom node is added, remove the previous one.
          if (current && current.isConnected) {
            this.host.removeChild(current);
          }

          this.currentNode = newNode;
          this.setupCustomNode(newNode);
        }

        // Invoke teardown for old node after the new one is added.
        // This way we can check whether to restore generated node.
        if (oldNode) {
          this.teardownCustomNode(oldNode);
        }
      });

      this.initialized = true;
    }
  }

  /**
   * Override to initialize the newly added custom node.
   *
   * @param {HTMLElement} _node
   * @protected
   */
  setupCustomNode(_node) {}

  /**
   * Override to cleanup custom node when it's removed.
   *
   * @param {HTMLElement} _node
   * @protected
   */
  teardownCustomNode(_node) {}
}
