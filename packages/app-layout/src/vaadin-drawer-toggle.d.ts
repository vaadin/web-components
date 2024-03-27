/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { Button } from '@vaadin/button/src/vaadin-button.js';

/**
 * The Drawer Toggle component controls the drawer in App Layout component.
 *
 * ```
 * <vaadin-app-layout>
 *   <vaadin-drawer-toggle slot="navbar">Toggle drawer</vaadin-drawer-toggle>
 * </vaadin-app-layout>
 * ```
 */
declare class DrawerToggle extends Button {
  ariaLabel: string;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-drawer-toggle': DrawerToggle;
  }
}

export { DrawerToggle };
