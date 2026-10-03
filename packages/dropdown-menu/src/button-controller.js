/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotChildObserveController } from '@vaadin/component-base/src/slot-child-observe-controller.js';

/**
 * A controller to manage the button element.
 */
export class ButtonController extends SlotChildObserveController {
  constructor(host) {
    super(host, 'button', 'vaadin-dropdown-menu-button');
  }

  /**
   * Override method inherited from `SlotController` to notify the host about
   * the default button element created during initialization.
   *
   * @protected
   * @override
   */
  initSingle() {
    super.initSingle();

    if (this.node && this.node === this.defaultNode) {
      this._notifyChange(this.node);
    }
  }

  /**
   * Set button label based on corresponding host property.
   *
   * @param {string | null | undefined} label
   */
  setLabel(label) {
    this.label = label;

    if (this.node === this.defaultNode) {
      this.updateDefaultNode(this.node);
    }
  }

  /**
   * Override method inherited from `SlotChildObserveController`
   * to always restore the default button, as a button is required.
   *
   * @protected
   * @override
   */
  restoreDefaultNode() {
    this.attachDefaultNode();
  }

  /**
   * Override method inherited from `SlotChildObserveController`
   * to update the default button text content.
   *
   * @param {Node | undefined} node
   * @protected
   * @override
   */
  updateDefaultNode(node) {
    if (node && node === this.defaultNode) {
      node.textContent = this.label ?? '';
    }

    // Notify the host after update.
    super.updateDefaultNode(node);
  }
}
