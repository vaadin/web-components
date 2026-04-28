/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotController } from '@vaadin/component-base/src/slot-controller';

export class MenuBarTooltipController extends SlotController {
  constructor(host) {
    super(host, 'tooltip');
  }

  initCustomNode(tooltipNode) {
    tooltipNode.manual = true;
    tooltipNode.generator = tooltipNode.generator || (({ item }) => item && item.tooltip);
  }

  attachTo(target) {
    const tooltipNode = this.node;
    if (!tooltipNode) {
      return;
    }

    if (!target || !target.item || !target.item.tooltip) {
      tooltipNode.target = null;
      tooltipNode.context = { item: null };
      tooltipNode._stateController.close(true);
      return;
    }

    tooltipNode.target = target;
    tooltipNode.context = { item: target.item };
  }

  open({ trigger }) {
    const tooltipNode = this.node;
    if (tooltipNode && tooltipNode.isConnected && tooltipNode.target) {
      tooltipNode._stateController.open({
        hover: trigger === 'hover',
        focus: trigger === 'focus',
      });
    }
  }

  /** @protected */
  close(immediate) {
    const tooltipNode = this.node;
    if (tooltipNode) {
      tooltipNode._stateController.close(immediate);
    }
  }
}
