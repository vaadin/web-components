/**
 * @license
 * Copyright (c) 2019 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ContextMenuTooltipController } from '@vaadin/context-menu/src/vaadin-context-menu-tooltip-controller.js';

export class MenuBarTooltipController extends ContextMenuTooltipController {
  /** @override */
  _getItem(target) {
    if (target.localName === 'vaadin-menu-bar-button') {
      return target.item;
    }

    return super._getItem(target);
  }

  /** @override */
  _getDefaultPosition(target) {
    if (target.localName === 'vaadin-menu-bar-button') {
      return 'bottom';
    }

    return super._getDefaultPosition(target);
  }
}
