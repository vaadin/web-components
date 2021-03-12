import { ButtonElement } from '@vaadin/vaadin-button/src/vaadin-button.js';

/**
 * The Drawer Toggle component controls the drawer in App Layout component.
 *
 * ```
 * <vaadin-app-layout>
 *   <vaadin-drawer-toggle slot="navbar">Toggle drawer</vaadin-drawer-toggle>
 * </vaadin-app-layout>
 * ```
 */
declare class DrawerToggleElement extends ButtonElement {
  ariaLabel: string | null | undefined;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-drawer-toggle': DrawerToggleElement;
  }
}

export { DrawerToggleElement };
