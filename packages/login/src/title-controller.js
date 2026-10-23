/**
 * @license
 * Copyright (c) 2018 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotChildObserveController } from '@vaadin/component-base/src/slot-child-observe-controller.js';

/**
 * A controller to manage the title element.
 */
export class TitleController extends SlotChildObserveController {
  constructor(host) {
    super(host, 'title', 'div');
  }

  /**
   * Set title based on corresponding host property.
   *
   * @param {string} title
   */
  setTitle(title) {
    this.title = title;
    this.update();
  }

  /**
   * Set level based on corresponding host property.
   *
   * @param {string} level
   */
  setLevel(level) {
    this.level = level;
    this.update();
  }

  /**
   * Override method inherited from `SlotChildObserveController`
   * to update the default title element, and to label the host by the title.
   *
   * @param {Node} node
   * @protected
   * @override
   */
  updateNode(node) {
    super.updateNode(node);

    if (node === this.defaultNode) {
      node.setAttribute('role', 'heading');
      node.setAttribute('aria-level', this.level);
      node.textContent = this.title;
    }

    this.host.setAttribute('aria-labelledby', node.id);
  }
}
