/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { MenuTooltipController } from '@vaadin/component-base/src/menu-tooltip-controller.js';

export class ContextMenuTooltipController extends MenuTooltipController {
  /** @override */
  _getItem(target) {
    return target.item;
  }

  /** @override */
  _getDefaultPosition(target) {
    const { children } = this._getItem(target);
    return children && children.length > 0 ? 'start' : 'end';
  }
}
