/**
 * @license
 * Copyright (c) 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';

/**
 * A controller that manages the item content children slot.
 */
export class ChildrenController extends SlotController {
  constructor(host, slotName) {
    super(host, slotName, null, { observe: true, multiple: true });
  }

  /**
   * @protected
   * @override
   */
  initAddedNode() {
    this.host.requestUpdate();
  }

  /**
   * @protected
   * @override
   */
  teardownNode() {
    this.host.requestUpdate();
  }
}
