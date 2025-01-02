/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ButtonMixin } from '@vaadin/button/src/vaadin-button-mixin.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * The Drawer Toggle component controls the drawer in App Layout component.
 *
 * ```
 * <vaadin-app-layout>
 *   <vaadin-drawer-toggle slot="navbar">Toggle drawer</vaadin-drawer-toggle>
 * </vaadin-app-layout>
 * ```
 */
declare class DrawerToggle extends ButtonMixin(DirMixin(ThemableMixin(HTMLElement))) {
  ariaLabel: string;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-drawer-toggle': DrawerToggle;
  }
}

export { DrawerToggle };
