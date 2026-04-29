/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { MenuTooltipController } from '@vaadin/component-base/src/menu-tooltip-controller.js';

export class ContextMenuTooltipController extends MenuTooltipController {
  /** @override */
  _getItem(target) {
    return target._item;
  }

  /** @override */
  _getDefaultPosition(target) {
    const item = this._getItem(target);
    const hasOpenableSubMenu = item.children && item.children.length > 0 && !item.disabled;
    return hasOpenableSubMenu ? 'start' : 'end';
  }
}
