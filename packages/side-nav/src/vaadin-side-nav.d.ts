/**
 * @license
 * Copyright (c) 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { FocusMixin } from '@vaadin/a11y-base/src/focus-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { SideNavChildrenMixin, type SideNavI18n } from './vaadin-side-nav-children-mixin.js';

export type { SideNavI18n };

/**
 * Fired when the `collapsed` property changes.
 */
export type SideNavCollapsedChangedEvent = CustomEvent<{ value: boolean }>;

export interface SideNavCustomEventMap {
  'collapsed-changed': SideNavCollapsedChangedEvent;
}

export type SideNavEventMap = HTMLElementEventMap & SideNavCustomEventMap;

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
