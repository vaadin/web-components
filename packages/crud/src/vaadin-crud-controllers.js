/**
 * @license
 * Copyright (c) 2000 - 2025 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';

/**
 * A controller for initializing slotted button.
 * @protected
 */
export class ButtonSlotController extends SlotController {
  constructor(host, type, theme, noDefaultNode) {
    super(host, `${type}-button`, noDefaultNode ? null : 'vaadin-button');

    this.type = type;
    this.theme = theme;
  }

  /**
   * Override method inherited from `SlotController`
   * to mark custom slotted button as the default.
   *
   * @param {Node} node
   * @protected
   * @override
   */
  initNode(node) {
    // Prevent errors when the `noDefaultNode` flag is set
    if (!node) {
      return;
    }

    // Needed by Flow counterpart to apply i18n to custom button
    if (node._isDefault) {
      this.defaultNode = node;
    }

    // Respect default theme attribute set by the Flow counterpart
    if (node === this.defaultNode && !node.hasAttribute('theme')) {
      node.setAttribute('theme', this.theme);
    }

    const { host, type } = this;
    const property = `_${type}Button`;
    const listener = `__${type}`;

    // TODO: restore default button when a corresponding slotted button is removed.
    // This would require us to detect where to insert a button after teleporting it,
    // which happens after opening a dialog and closing it (default editor position).
    if (host[property] && host[property] !== node) {
      host[property].remove();
    }

    node.addEventListener('click', host[listener]);
    host[property] = node;
  }
}

/**
 * A controller for initializing slotted form.
 * @protected
 */
export class FormSlotController extends SlotController {
  constructor(host) {
    super(host, 'form', 'vaadin-crud-form');
  }

  /**
   * Override method inherited from `SlotController`
   * to move slotted form to the overlay if needed.
   *
   * @param {Node} node
   * @protected
   * @override
   */
  initNode(node) {
    this.host._form = node;

    if (this.host.editorOpened) {
      this.host.__ensureChildren();
    }
  }
}

/**
 * A controller for initializing slotted grid.
 * @protected
 */
export class GridSlotController extends SlotController {
  constructor(host) {
    super(host, 'grid', 'vaadin-crud-grid');
  }

  /**
   * Override method inherited from `SlotController`
   * to initialize `active-item-changed` listener.
   *
   * @param {Node} node
   * @protected
   * @override
   */
  initNode(node) {
    const { host } = this;

    // Wait for all the properties e.g. `noFilter` and `noSort`
    // to be set, to ensure columns are configured correctly.
    queueMicrotask(() => {
      // Force to remove listener on previous grid first
      host.__editOnClickChanged(false, host._grid);
      host._grid = node;
      host.__editOnClickChanged(host.editOnClick, host._grid);
    });
  }
}
