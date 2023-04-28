/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { LitElement } from 'lit';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

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
 * ```
 *   <vaadin-side-nav>
 *     <vaadin-side-nav-item>Item 1</vaadin-side-nav-item>
 *     <vaadin-side-nav-item>Item 2</vaadin-side-nav-item>
 *     <vaadin-side-nav-item>Item 3</vaadin-side-nav-item>
 *     <vaadin-side-nav-item>Item 4</vaadin-side-nav-item>
 *   </vaadin-side-nav>
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
 * #### Example:
 *
 * ```
 *   <vaadin-side-nav>
 *     <span slot="label">Main menu</span>
 *     <vaadin-side-nav-item>Item</vaadin-side-nav-item>
 *   </vaadin-side-nav>
 * ```
 *
 * @fires {CustomEvent} collapsed-changed - Fired when the `collapsed` property changes.
 */
declare class SideNav extends ElementMixin(ThemableMixin(PolylitMixin(LitElement))) {
  /**
   * When present, shows the toggle icon and enables collapsing.
   */
  collapsible: boolean;

  /**
   * When present, the side nav is collapsed to hide the items.
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
