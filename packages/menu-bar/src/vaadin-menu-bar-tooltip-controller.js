/**
 * @license
 * Copyright (c) 2019 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';

/**
 * Controller for the tooltip slotted into a menu-bar. Configures the
 * tooltip in manual mode and drives its target/context based on the
 * currently hovered or focused button.
 */
export class MenuBarTooltipController extends SlotController {
  constructor(host) {
    super(host, 'tooltip');
  }

  /**
   * Initialize the slotted tooltip: switch it to manual mode and
   * provide a default generator that reads the `tooltip` property
   * of the menu-bar item.
   *
   * @param {HTMLElement} tooltipNode
   * @protected
   * @override
   */
  initCustomNode(tooltipNode) {
    tooltipNode.manual = true;
    tooltipNode.generator = tooltipNode.generator || (({ item }) => item && item.tooltip);
  }

  /**
   * Set the tooltip target to the given button. When the button has no
   * tooltip text (or is `null`), clears the target/context, restores
   * the user-set position on the tooltip element and closes the tooltip
   * immediately.
   *
   * @param {HTMLElement | null} target
   */
  setTarget(target) {
    const tooltipNode = this.node;
    if (!tooltipNode) {
      return;
    }

    if (!target || !target.item || !target.item.tooltip) {
      tooltipNode.target = null;
      tooltipNode.context = { item: null };
      if ('__userPosition' in tooltipNode) {
        tooltipNode.position = tooltipNode.__userPosition;
      }
      this.close(true);
      return;
    }

    if (!('__userPosition' in tooltipNode)) {
      tooltipNode.__userPosition = tooltipNode.position;
    }
    const itemPosition = target.item.tooltipPosition;
    tooltipNode.position = itemPosition === undefined ? tooltipNode.__userPosition : itemPosition;

    tooltipNode.target = target;
    tooltipNode.context = { item: target.item };
  }

  /**
   * Schedule opening the tooltip. No-op when no target is attached.
   *
   * @param {{ trigger: 'hover' | 'focus' }} options
   */
  open({ trigger }) {
    const tooltipNode = this.node;
    if (tooltipNode && tooltipNode.isConnected && tooltipNode.target) {
      tooltipNode._stateController.open({
        hover: trigger === 'hover',
        focus: trigger === 'focus',
      });
    }
  }

  /**
   * Schedule closing the tooltip, respecting the configured hide delay
   * unless `immediate` is true.
   *
   * @param {boolean} [immediate]
   */
  close(immediate) {
    const tooltipNode = this.node;
    if (tooltipNode) {
      tooltipNode._stateController.close(immediate);
    }
  }
}
