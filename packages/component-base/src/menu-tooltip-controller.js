/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotController } from './slot-controller.js';

/**
 * Controller for the tooltip slotted into a menu-like component (such as
 * `<vaadin-context-menu>` or `<vaadin-menu-bar>`). Configures the tooltip
 * in manual mode and drives its target/context based on the currently
 * hovered or focused item.
 *
 * Subclasses can override `_getItem` to customize how the item is
 * retrieved from the target, and `_getDefaultPosition` to customize the
 * fallback position when an item does not specify `tooltipPosition`.
 */
export class MenuTooltipController extends SlotController {
  constructor(host) {
    super(host, 'tooltip');
  }

  /** @override */
  initCustomNode(tooltipNode) {
    tooltipNode.manual = true;
    tooltipNode.generator ||= ({ item }) => item?.tooltip;
  }

  /**
   * @param {HTMLElement} target
   * @return {object | null | undefined}
   * @protected
   */
  _getItem(_target) {
    throw new Error('Must be implemented by subclass');
  }

  /**
   * @param {HTMLElement} _target
   * @return {string | undefined}
   * @protected
   */
  _getDefaultPosition(_target) {
    throw new Error('Must be implemented by subclass');
  }

  /**
   * @param {HTMLElement | null} target
   */
  setTarget(target) {
    const tooltipNode = this.node;
    if (!tooltipNode) {
      return;
    }

    const item = target ? this._getItem(target) : null;
    if (item && item?.tooltip) {
      tooltipNode.target = target;
      tooltipNode.context = { item };
      tooltipNode._position = item.tooltipPosition || this._getDefaultPosition(target);
    } else {
      tooltipNode.target = null;
      tooltipNode.context = { item: null };
      this.close(true);
    }
  }

  /**
   * @param {{ trigger: 'hover' | 'focus' }} options
   */
  open({ trigger }) {
    const tooltipNode = this.node;
    if (tooltipNode?.isConnected && tooltipNode.target) {
      tooltipNode._stateController.open({
        hover: trigger === 'hover',
        focus: trigger === 'focus',
      });
    }
  }

  /**
   * @param {boolean} immediate
   */
  close(immediate) {
    const tooltipNode = this.node;
    tooltipNode?._stateController.close(immediate);
  }
}
