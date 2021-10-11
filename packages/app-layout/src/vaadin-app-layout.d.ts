/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * Fired when the `drawerOpened` property changes.
 */
export type AppLayoutDrawerOpenedChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `overlay` property changes.
 */
export type AppLayoutOverlayChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `primarySection` property changes.
 */
export type AppLayoutPrimarySectionChangedEvent = CustomEvent<{ value: 'navbar' | 'drawer' }>;

export interface AppLayoutCustomEventMap {
  'drawer-opened-changed': AppLayoutDrawerOpenedChangedEvent;

  'overlay-changed': AppLayoutOverlayChangedEvent;

  'primary-section-changed': AppLayoutPrimarySectionChangedEvent;
}

export type AppLayoutEventMap = HTMLElementEventMap & AppLayoutCustomEventMap;

/**
 * `<vaadin-app-layout>` is a Web Component providing a quick and easy way to get a common application layout structure done.
 *
 * ```
 * <vaadin-app-layout primary-section="navbar|drawer">
 *  <vaadin-drawer-toggle slot="navbar [touch-optimized]"></vaadin-drawer-toggle>
 *  <h3 slot="navbar [touch-optimized]">Company Name</h3>
 *  <vaadin-tabs orientation="vertical" slot="drawer">
 *    <vaadin-tab>Menu item 1</vaadin-tab>
 *  </vaadin-tabs>
 *  <!-- Everything else will be the page content -->
 *  <div>
 *    <h3>Page title</h3>
 *    <p>Page content</p>
 *  </div>
 * </vaadin-app-layout>
 * ```
 *
 * For best results, the component should be added to the root level of your application (i.e., as a direct child of `<body>`).
 *
 * The page should include a viewport meta tag which contains `viewport-fit=cover`, like the following:
 * ```
 * <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
 * ```
 * This causes the viewport to be scaled to fill the device display.
 * To ensure that important content is displayed, use the provided css variables.
 * ```
 * --safe-area-inset-top
 * --safe-area-inset-right
 * --safe-area-inset-bottom
 * --safe-area-inset-left
 * ```
 *
 * ### Styling
 *
 * The following Shadow DOM parts of the `<vaadin-app-layout>` are available for styling:
 *
 * Part name     | Description
 * --------------|---------------------------------------------------------|
 * `navbar`      | Container for the navigation bar
 * `drawer`      | Container for the drawer area
 * `content`     | Container for page content.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * ### Component's slots
 *
 * The following slots are available to be set
 *
 * Slot name          | Description
 * -------------------|---------------------------------------------------|
 * no name            | Default container for the page content
 * `navbar `          | Container for the top navbar area
 * `drawer`           | Container for an application menu
 * `touch-optimized`  | Container for the bottom navbar area (only visible for mobile devices)
 *
 * #### Touch optimized
 *
 * App Layout has a pseudo-slot `touch-optimized` in order to give more control of the presentation of
 * elements with `slot[navbar]`. Internally, when the user is interacting with App Layout from a
 * touchscreen device, the component will search for elements with `slot[navbar touch-optimized]` and move
 * them to the bottom of the page.
 *
 * ### Navigation
 *
 * As the drawer opens as an overlay in small devices, it makes sense to close it once a navigation happens.
 * If you are using Vaadin Router, this will happen automatically unless you change the `closeDrawerOn` event name.
 *
 * In order to do so, there are two options:
 * - If the `vaadin-app-layout` instance is available, then `drawerOpened` can be set to `false`
 * - If not, a custom event `close-overlay-drawer` can be dispatched either by calling
 *  `window.dispatchEvent(new CustomEvent('close-overlay-drawer'))` or by calling
 *  `AppLayout.dispatchCloseOverlayDrawerEvent()`
 *
 * ### Scrolling areas
 *
 * By default, the component will act with the "body scrolling", so on mobile (iOS Safari and Android Chrome),
 * the toolbars will collapse when a scroll happens.
 *
 * To use the "content scrolling", in case of the content of the page relies on a pre-defined height (for instance,
 * it has a `height:100%`), then the developer can set `height: 100%` to both `html` and `body`.
 * That will make the `[content]` element of app layout scrollable.
 * On this case, the toolbars on mobile device won't collapse.
 *
 * @fires {CustomEvent} drawer-opened-changed - Fired when the `drawerOpened` property changes.
 * @fires {CustomEvent} overlay-changed - Fired when the `overlay` property changes.
 * @fires {CustomEvent} primary-section-changed - Fired when the `primarySection` property changes.
 */
declare class AppLayout extends ElementMixin(ThemableMixin(HTMLElement)) {
  /**
   * Defines whether navbar or drawer will come first visually.
   * - By default (`primary-section="navbar"`), the navbar takes the full available width and moves the drawer down.
   * - If `primary-section="drawer"` is set, then the drawer will move the navbar, taking the full available height.
   * @attr {navbar|drawer} primary-section
   */
  primarySection: 'navbar' | 'drawer';

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

  /**
   * Helper static method that dispatches a `close-overlay-drawer` event
   */
  static dispatchCloseOverlayDrawerEvent(): void;

  addEventListener<K extends keyof AppLayoutEventMap>(
    type: K,
    listener: (this: AppLayout, ev: AppLayoutEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof AppLayoutEventMap>(
    type: K,
    listener: (this: AppLayout, ev: AppLayoutEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-app-layout': AppLayout;
  }
}

export { AppLayout };
