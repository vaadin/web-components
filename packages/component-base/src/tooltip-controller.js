/**
 * @license
 * Copyright (c) 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotController } from './slot-controller.js';

/**
 * A controller that manages the slotted tooltip element.
 */
export class TooltipController extends SlotController {
  constructor(host) {
    // Do not provide slot factory to create tooltip lazily.
    super(host, 'tooltip');

    this.setTarget(host);
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

    if (this.context !== undefined) {
      tooltipNode.context = this.context;
    }

    if (this.manual !== undefined) {
      tooltipNode.manual = this.manual;
    }

    if (this.opened !== undefined) {
      tooltipNode.opened = this.opened;
    }

    if (this.position !== undefined) {
      this.__updatePosition(tooltipNode, this.position);
    }

    if (this.shouldShow !== undefined) {
      tooltipNode.shouldShow = this.shouldShow;
    }
  }

  /**
   * Set a context object to be used by generator.
   * @param {object} context
   */
  setContext(context) {
    this.context = context;

    const tooltipNode = this.node;
    if (tooltipNode) {
      tooltipNode.context = context;
    }
  }

  /**
   * Toggle manual state on the slotted tooltip.
   * @param {boolean} manual
   */
  setManual(manual) {
    this.manual = manual;

    const tooltipNode = this.node;
    if (tooltipNode) {
      tooltipNode.manual = manual;
    }
  }

  /**
   * Toggle opened state on the slotted tooltip.
   * @param {boolean} opened
   */
  setOpened(opened) {
    this.opened = opened;

    const tooltipNode = this.node;
    if (tooltipNode) {
      tooltipNode.opened = opened;
    }
  }

  /**
   * Set position on the slotted tooltip.
   * @param {string} position
   */
  setPosition(position) {
    this.position = position;

    this.__updatePosition(this.node, position);
  }

  /**
   * Set function used to detect whether to show
   * the tooltip based on a condition.
   * @param {Function} shouldShow
   */
  setShouldShow(shouldShow) {
    this.shouldShow = shouldShow;

    const tooltipNode = this.node;
    if (tooltipNode) {
      tooltipNode.shouldShow = shouldShow;
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

  /** @private */
  __updatePosition(node, position) {
    if (node && !node.hasAttribute('position')) {
      node.position = position;
    }
  }
}
