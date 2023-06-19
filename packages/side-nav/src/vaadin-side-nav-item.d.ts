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
 * Fired when the `expanded` property changes.
 */
export type SideNavItemExpandedChangedEvent = CustomEvent<{ value: boolean }>;

export interface SideNavItemCustomEventMap {
  'expanded-changed': SideNavItemExpandedChangedEvent;
}

export type SideNavItemEventMap = HTMLElementEventMap & SideNavItemCustomEventMap;

/**
 * A navigation item to be used within `<vaadin-side-nav>`. Represents a navigation target.
 * Not intended to be used separately.
 *
 * ```html
 * <vaadin-side-nav-item>
 *   Item 1
 *   <vaadin-side-nav-item path="/path1" slot="children">
 *     Child item 1
 *   </vaadin-side-nav-item>
 *   <vaadin-side-nav-item path="/path2" slot="children">
 *     Child item 2
 *   </vaadin-side-nav-item>
 * </vaadin-side-nav-item>
 * ```
 *
 * ### Customization
 *
 * You can configure the item by using `slot` names.
 *
 * Slot name | Description
 * ----------|-------------
 * `prefix`  | A slot for content before the label (e.g. an icon).
 * `suffix`  | A slot for content after the label (e.g. an icon).
 *
 * #### Example
 *
 * ```html
 * <vaadin-side-nav-item>
 *   <vaadin-icon icon="vaadin:chart" slot="prefix"></vaadin-icon>
 *   Item
 *   <span theme="badge primary" slot="suffix">Suffix</span>
 * </vaadin-side-nav-item>
 * ```
 *
 * @fires {CustomEvent} expanded-changed - Fired when the `expanded` property changes.
 */
declare class SideNavItem extends ElementMixin(ThemableMixin(PolylitMixin(LitElement))) {
  /**
   * The path to navigate to
   */
  path: string | null | undefined;

  /**
   * Whether to show the child items or not
   */
  expanded: boolean;

  /**
   * Whether the path of the item matches the current path.
   * Set when the item is appended to DOM or when navigated back
   * to the page that contains this item using the browser.
   */
  readonly active: boolean;

  addEventListener<K extends keyof SideNavItemEventMap>(
    type: K,
    listener: (this: SideNavItem, ev: SideNavItemEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof SideNavItemEventMap>(
    type: K,
    listener: (this: SideNavItem, ev: SideNavItemEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-side-nav-item': SideNavItem;
  }
}

export { SideNavItem };
