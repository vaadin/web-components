/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';

/**
 * Controller for the tooltip slotted into `<vaadin-context-menu>`. Configures
 * the tooltip in manual mode and drives its target, context, and position
 * based on the currently hovered or focused item.
 */
export class ContextMenuTooltipController extends SlotController {
  constructor(host) {
    super(host, 'tooltip');
  }

  /** @override */
  initCustomNode(tooltipNode) {
    tooltipNode.manual = true;
    tooltipNode.generator ||= ({ item }) => item?.tooltip;
  }

  /** @protected */
  _getItem(target) {
    return target._item;
  }

  /** @protected */
  _getDefaultPosition(target) {
    const item = this._getItem(target);
    return item.children?.length > 0 && !item.disabled ? 'start' : 'end';
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
    if (item?.tooltip) {
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
