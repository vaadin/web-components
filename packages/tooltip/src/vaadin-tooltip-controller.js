/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';

/**
 * A controller that manages the slotted tooltip element.
 */
export class TooltipController extends SlotController {
  constructor(host) {
    // Do not provide slot factory to create tooltip lazily.
    super(host, 'tooltip');
  }

  /**
   * Override to initialize the newly added custom tooltip.
   *
   * @param {Node} tooltipNode
   * @protected
   * @override
   */
  initCustomNode(tooltipNode) {
    tooltipNode.target = this.target;
  }

  /**
   * Override to cleanup tooltip node when it's removed.
   *
   * @param {Node} _node
   * @protected
   * @override
   */
  teardownNode(_node) {
    const tooltipNode = this.getSlotChild();

    if (this.__isDefaultTooltip(tooltipNode)) {
      // Restore default tooltip if a custom one was removed.
      this.__applyDefaultTooltip(this.tooltipText, tooltipNode);
    }
  }

  /**
   * Set an HTML element to attach the tooltip to.
   * @param {HTMLElement} target
   */
  setTarget(target) {
    this.target = target;

    const tooltipNode = this.node;
    if (tooltipNode) {
      tooltipNode.target = target;
    }
  }

  /**
   * Set tooltip text based on corresponding host property.
   * @param {string} tooltipText
   */
  setTooltipText(tooltipText) {
    this.tooltipText = tooltipText;

    const tooltipNode = this.getSlotChild();
    if (this.__isDefaultTooltip(tooltipNode)) {
      this.__applyDefaultTooltip(tooltipText, tooltipNode);
    }
  }

  /** @private */
  __isDefaultTooltip(tooltipNode) {
    return !tooltipNode || tooltipNode === this.defaultNode;
  }

  /**
   * @param {string} helperText
   * @private
   */
  __isNotEmpty(helperText) {
    return helperText && helperText.trim() !== '';
  }

  /**
   * @param {string} tooltipText
   * @param {Node} tooltipNode
   * @private
   */
  __applyDefaultTooltip(tooltipText, tooltipNode) {
    const hasTooltipText = this.__isNotEmpty(tooltipText);

    if (hasTooltipText && !tooltipNode) {
      // Set slot factory lazily to only create tooltip node when needed.
      this.slotFactory = () => document.createElement('vaadin-tooltip');

      tooltipNode = this.attachDefaultNode();
    }

    if (tooltipNode) {
      tooltipNode.text = tooltipText;
      tooltipNode.target = this.target;
    }
  }
}
