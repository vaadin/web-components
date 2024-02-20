/**
 * @license
 * Copyright (c) 2023 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { FocusMixin } from '@vaadin/a11y-base/src/focus-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { SideNavChildrenMixin, type SideNavI18n } from './vaadin-side-nav-children-mixin.js';
import type { SideNavItem } from './vaadin-side-nav-item.js';

export type { SideNavI18n };

/**
 * Fired when the `collapsed` property changes.
 */
export type SideNavCollapsedChangedEvent = CustomEvent<{ value: boolean }>;

export interface SideNavCustomEventMap {
  'collapsed-changed': SideNavCollapsedChangedEvent;
}

export type SideNavEventMap = HTMLElementEventMap & SideNavCustomEventMap;

export type NavigateEvent = {
  path: SideNavItem['path'];
  target: SideNavItem['target'];
  current: SideNavItem['current'];
  expanded: SideNavItem['expanded'];
  pathAliases: SideNavItem['pathAliases'];
  originalEvent: MouseEvent;
};

/**
 * `<vaadin-side-nav>` is a Web Component for navigation menus.
 *
 * ```html
 * <vaadin-side-nav>
 *   <vaadin-side-nav-item>Item 1</vaadin-side-nav-item>
 *   <vaadin-side-nav-item>Item 2</vaadin-side-nav-item>
 *   <vaadin-side-nav-item>Item 3</vaadin-side-nav-item>
 *   <vaadin-side-nav-item>Item 4</vaadin-side-nav-item>
 * </vaadin-side-nav>
 * ```
 *
 * ### Customization
 *
 * You can configure the component by using `slot` names.
 *
 * Slot name | Description
 * ----------|-------------
 * `label`   | The label (text) inside the side nav.
 *
 * #### Example
 *
 * ```html
 * <vaadin-side-nav>
 *   <span slot="label">Main menu</span>
 *   <vaadin-side-nav-item>Item</vaadin-side-nav-item>
 * </vaadin-side-nav>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name       | Description
 * ----------------|----------------
 * `label`         | The label element
 * `children`      | The element that wraps child items
 * `toggle-button` | The toggle button
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description
 * -------------|-------------
 * `collapsed`  | Set when the element is collapsed.
 * `focus-ring` | Set when the label is focused using the keyboard.
 * `focused`    | Set when the label is focused.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {CustomEvent} collapsed-changed - Fired when the `collapsed` property changes.
 */
declare class SideNav extends SideNavChildrenMixin(FocusMixin(ElementMixin(ThemableMixin(HTMLElement)))) {
  /**
   * Whether the side nav is collapsible. When enabled, the toggle icon is shown.
   */
  collapsible: boolean;

  /**
   * Whether the side nav is collapsed. When collapsed, the items are hidden.
   */
  collapsed: boolean;

  /**
   * Callback function for router integration.
   *
   * When a side nav item link is clicked, this function is called and the default click action is cancelled.
   * This delegates the responsibility of navigation to the function's logic.
   *
   * The click event action is not cancelled in the following cases:
   * - The click event has a modifier (e.g. `metaKey`, `shiftKey`)
   * - The click event is on an external link
   * - The click event is on a link with `target="_blank"`
   * - The function explicitly returns `false`
   *
   * The function receives an object with the properties of the clicked side-nav item:
   * - `path`: The path of the navigation item.
   * - `target`: The target of the navigation item.
   * - `current`: A boolean indicating whether the navigation item is currently selected.
   * - `expanded`: A boolean indicating whether the navigation item is expanded.
   * - `pathAliases`: An array of path aliases for the navigation item.
   * - `originalEvent`: The original DOM event that triggered the navigation.
   *
   * Also see the `location` property for updating the highlighted navigation item on route change.
   */
  onNavigate?: ((event: NavigateEvent) => boolean) | ((event: NavigateEvent) => void);

  /**
   * A change to this property triggers an update of the highlighted item in the side navigation. While it typically
   * corresponds to the browser's URL, the specific value assigned to the property is irrelevant. The component has
   * its own internal logic for determining which item is highlighted.
   *
   * The main use case for this property is when the side navigation is used with a client-side router. In this case,
   * the component needs to be informed about route changes so it can update the highlighted item.
   */
  location: any;

  addEventListener<K extends keyof SideNavEventMap>(
    type: K,
    listener: (this: SideNav, ev: SideNavEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof SideNavEventMap>(
    type: K,
    listener: (this: SideNav, ev: SideNavEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-side-nav': SideNav;
  }
}

export { SideNav };
