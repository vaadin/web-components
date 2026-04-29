/**
 * @license
 * Copyright (c) 2019 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { MenuTooltipController } from '@vaadin/component-base/src/menu-tooltip-controller.js';

export class MenuBarTooltipController extends MenuTooltipController {
  /** @override */
  _getItem(target) {
    if (target.matches('vaadin-menu-bar-button')) {
      return target.item;
    }

    if (target.matches('vaadin-menu-bar-item')) {
      return target._item;
    }
  }

  /** @override */
  _getDefaultPosition(target) {
    if (target.matches('vaadin-menu-bar-button')) {
      return 'bottom';
    }

    if (target.matches('vaadin-menu-bar-item')) {
      const { children } = this._getItem(target);
      return children && children.length > 0 ? 'start' : 'end';
    }
  }
}
