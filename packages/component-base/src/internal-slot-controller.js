/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A controller that creates an internal node in a named slot of the host.
 * The node is not supposed to be replaced, so the controller does not observe the slot.
 * It does not access the shadow root and can be added before the first render.
 */
export class InternalSlotController {
  constructor(host, slotName, tagName, initializer) {
    /**
     * The controller host element.
     *
     * @type {HTMLElement}
     */
    this.host = host;

    /**
     * The name of the slot to put the node in.
     *
     * @type {string}
     * @protected
     */
    this.slotName = slotName;

    /**
     * The tag name of the node to create.
     *
     * @type {string}
     * @protected
     */
    this.tagName = tagName;

    /**
     * Function to call once when the node is created.
     *
     * @type {Function | undefined}
     * @protected
     */
    this.initializer = initializer;

    /**
     * The node managed by the controller.
     *
     * @type {HTMLElement | null}
     */
    this.node = null;
  }

  hostConnected() {
    const { host, slotName, tagName } = this;

    if (!this.node) {
      this.node = host.querySelector(`:scope > ${tagName}[slot="${slotName}"]`) ?? document.createElement(tagName);
      this.node.setAttribute('slot', slotName);
      this.initializer?.(this.node, host);
    }

    if (this.node.parentNode !== host) {
      host.appendChild(this.node);
    }
  }
}
