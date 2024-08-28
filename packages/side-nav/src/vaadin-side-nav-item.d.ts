/**
 * @license
 * Copyright (c) 2023 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DisabledMixin } from '@vaadin/a11y-base/src/disabled-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { SideNavChildrenMixin } from './vaadin-side-nav-children-mixin.js';

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
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name       | Description
 * ----------------|----------------
 * `content`       | The element that wraps link and toggle button
 * `children`      | The element that wraps child items
 * `link`          | The clickable anchor used for navigation
 * `toggle-button` | The toggle button
 *
 * The following state attributes are available for styling:
 *
 * Attribute      | Description
 * ---------------|-------------
 * `disabled`     | Set when the element is disabled.
 * `expanded`     | Set when the element is expanded.
 * `has-children` | Set when the element has child items.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {CustomEvent} expanded-changed - Fired when the `expanded` property changes.
 */
declare class SideNavItem extends SideNavChildrenMixin(DisabledMixin(ElementMixin(ThemableMixin(HTMLElement)))) {
  /**
   * The path to navigate to
   */
  path: string | null | undefined;

  /**
   * The list of alternative paths matching this item
   */
  pathAliases: string[];

  /**
   * Whether to show the child items or not
   */
  expanded: boolean;

  /**
   * Whether to also match nested paths / routes. `false` by default.
   *
   * When enabled, an item with the path `/path` is considered current when
   * the browser URL is `/path`, `/path/child`, `/path/child/grandchild`,
   * etc.
   *
   * Note that this only affects matching of the URLs path, not the base
   * origin or query parameters.
   *
   * @attr {boolean} match-nested
   */
  matchNested: boolean;

  /**
   * Whether the item's path matches the current browser URL.
   *
   * A match occurs when both share the same base origin (like https://example.com),
   * the same path (like /path/to/page), and the browser URL contains at least
   * all the query parameters with the same values from the item's path.
   *
   * See [`matchNested`](#/elements/vaadin-side-nav-item#property-matchNested) for how to change the path matching behavior.
   *
   * The state is updated when the item is added to the DOM or when the browser
   * navigates to a new page.
   */
  readonly current: boolean;

  /**
   * The target of the link. Works only when `path` is set.
   */
  target: string | null | undefined;

  /**
   * Whether to exclude the item from client-side routing. When enabled,
   * this causes the item to behave like a regular anchor, causing a full
   * page reload. This only works with supported routers, such as the one
   * provided in Vaadin apps, or when using the side nav `onNavigate` hook.
   *
   * @attr {boolean} router-ignore
   */
  routerIgnore: boolean;

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
