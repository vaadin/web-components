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
