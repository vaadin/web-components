/**
 * @license
 * Copyright (c) 2019 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ContextMenuMixin } from '@vaadin/context-menu/src/vaadin-context-menu-mixin.js';
import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';

/**
 * An element used internally by `<vaadin-menu-bar>`. Not intended to be used separately.
 */
declare class MenuBarSubmenu extends ContextMenuMixin(ThemePropertyMixin(HTMLElement)) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-menu-bar-submenu': MenuBarSubmenu;
  }
}

export { MenuBarSubmenu };
