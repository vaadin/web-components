/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
export class SlotController {
  constructor(host, [slotName, slotFactory, slotInitializer]) {
    this.host = host;
    this.slotName = slotName;
    this.slotFactory = slotFactory;
    this.slotInitializer = slotInitializer;
  }

  hostConnected() {
    if (!this.__initialized) {
      const { host, slotName, slotFactory } = this;

      const slotted = host.querySelector(`[slot=${slotName}]`);

      if (!slotted) {
        const slotContent = slotFactory(host);
        if (slotContent instanceof Element) {
          slotContent.setAttribute('slot', slotName);
          host.appendChild(slotContent);
          this.__slotContent = slotContent;
        }
      } else {
        this.__slotContent = slotted;
      }

      this.slotInitializer(host, this.__slotContent);

      this.__initialized = true;
    }
  }
}
