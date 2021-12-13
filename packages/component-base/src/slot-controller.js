/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
export class SlotController {
  constructor(host, slotName, slotFactory, slotInitializer) {
    this.host = host;
    this.slotName = slotName;
    this.slotFactory = slotFactory;
    this.slotInitializer = slotInitializer;
  }

  hostConnected() {
    if (!this.initialized) {
      const { host, slotName, slotFactory, slotInitializer } = this;

      const slotted = this.getSlotChild();
      const isCustom = !!slotted;

      if (isCustom) {
        this.node = slotted;
      } else if (slotFactory) {
        // Slot factory is optional, some slots don't have default content.

        const slotContent = slotFactory(host);
        if (slotContent instanceof Element) {
          if (slotName !== '') {
            slotContent.setAttribute('slot', slotName);
          }
          host.appendChild(slotContent);
          this.node = slotContent;
        }
      }

      // Don't try to bind `this` to initializer (normally it's arrow function).
      // Instead, pass the host as a first argument to access component's state.
      if (slotInitializer) {
        slotInitializer(host, this.node, isCustom);
      }

      this.initialized = true;
    }
  }

  /**
   * Return a reference to the node managed by the controller.
   * @return {Node}
   */
  getSlotChild() {
    const { slotName } = this;
    return Array.from(this.host.childNodes).find((node) => {
      // Either an element (any slot) or a text node (only un-named slot).
      return (
        (node.nodeType === Node.ELEMENT_NODE && node.slot === slotName) ||
        (node.nodeType === Node.TEXT_NODE && node.textContent.trim() && slotName === '')
      );
    });
  }
}
