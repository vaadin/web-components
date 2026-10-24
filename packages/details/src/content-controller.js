/**
 * @license
 * Copyright (c) 2019 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';

/**
 * A controller to manage the default content slot.
 */
export class ContentController extends SlotController {
  constructor(host) {
    super(host, '', null, { multiple: true, useUniqueId: true, uniqueIdPrefix: 'content' });
  }

  /**
   * Override method inherited from `SlotController`
   * to set ID on the first content element.
   *
   * @param {Node} node
   * @protected
   * @override
   */
  initNode(node) {
    if (node === this.nodes[0] && node.nodeType === Node.ELEMENT_NODE && !node.id) {
      node.id = this.defaultId;
    }
  }

  /**
   * Override method inherited from `SlotController`
   * to notify the host about content changes.
   *
   * @protected
   * @override
   */
  update() {
    super.update();
    this.dispatchEvent(new CustomEvent('slot-content-changed'));
  }
}
