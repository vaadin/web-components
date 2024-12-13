/**
 * @license
 * Copyright (c) 2018 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';

export interface AppLayoutI18n {
  drawer: string;
}

export declare function AppLayoutMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<AppLayoutMixinClass> & T;

export declare class AppLayoutMixinClass {
  /**
   * The object used to localize this component.
   * To change the default localization, replace the entire
   * `i18n` object with a custom one.
   *
   * To update individual properties, extend the existing i18n object as follows:
   * ```js
   * appLayout.i18n = {
   *   ...appLayout.i18n,
   *   drawer: 'Drawer'
   * }
   * ```
   *
   * The object has the following structure and default values:
   * ```
   * {
   *   drawer: 'Drawer'
   * }
   * ```
   */
  i18n: AppLayoutI18n;

  /**
   * Defines whether navbar or drawer will come first visually.
   * - By default (`primary-section="navbar"`), the navbar takes the full available width and moves the drawer down.
   * - If `primary-section="drawer"` is set, then the drawer will move the navbar, taking the full available height.
   * @attr {navbar|drawer} primary-section
   */
  primarySection: 'drawer' | 'navbar';

  /**
   * Controls whether the drawer is opened (visible) or not.
   * Its default value depends on the viewport:
   * - `true`, for desktop size views
   * - `false`, for mobile size views
   * @attr {boolean} drawer-opened
   */
  drawerOpened: boolean;

  /**
   * Drawer is an overlay on top of the content
   * Controlled via CSS using `--vaadin-app-layout-drawer-overlay: true|false`;
   */
  readonly overlay: boolean;

  /**
   * A global event that causes the drawer to close (be hidden) when it is in overlay mode.
   * - The default is `vaadin-router-location-changed` dispatched by Vaadin Router
   *
   * @attr {string} close-drawer-on
   */
  closeDrawerOn: string;
}
