/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotObserver } from './slot-observer.js';
import { TooltipController } from './tooltip-controller.js';

function defaultGetText(host) {
  const slot = host.shadowRoot && host.shadowRoot.querySelector('slot:not([name])');
  if (!slot) {
    return '';
  }
  return slot
    .assignedNodes({ flatten: true })
    .map((node) => node.textContent)
    .join('')
    .trim();
}

/**
 * A controller that extends `TooltipController` to manage an
 * automatically created `<vaadin-tooltip>` element. When enabled,
 * the controller creates the tooltip and slots it into the host's
 * `tooltip` slot, mirroring the host's visible text. When disabled,
 * or when the host's text is empty, or when the host already has a
 * user-provided tooltip, the auto tooltip is removed.
 *
 * The auto tooltip is created with `ariaTarget = null` so that it does
 * not contribute an `aria-describedby` attribute on the host: the text
 * is already present in the accessibility tree via the host's content.
 */
export class AutoTooltipController extends TooltipController {
  constructor(host, options = {}) {
    super(host);
    this.__getText = options.getText || defaultGetText;
    this.__enabled = false;
  }

  /**
   * Toggle whether the auto tooltip should exist. Re-evaluates immediately.
   *
   * @param {boolean} enabled
   */
  setEnabled(enabled) {
    this.__enabled = enabled;
    this.__update();
  }

  /** @override */
  hostConnected() {
    super.hostConnected();

    if (!this.__shadowSlotObserver) {
      this.__shadowSlotObserver = new SlotObserver(this.host.shadowRoot, () => {
        this.__update();
      });
    }
  }

  /** @private */
  __hasCustomTooltip() {
    return Array.from(this.host.children).some((node) => node !== this.__autoNode && node.slot === 'tooltip');
  }

  /** @private */
  __update() {
    const text = this.__enabled ? this.__getText(this.host) : '';

    if (!this.__enabled || !text || this.__hasCustomTooltip()) {
      if (this.__autoNode) {
        this.__autoNode.remove();
      }
      return;
    }

    if (!this.__autoNode) {
      this.__autoNode = document.createElement('vaadin-tooltip');
      this.__autoNode.setAttribute('slot', 'tooltip');
      this.__autoNode.ariaTarget = null;
    }

    this.__autoNode.setAttribute('text', text);

    if (!this.__autoNode.isConnected) {
      this.host.appendChild(this.__autoNode);
    }
  }
}
