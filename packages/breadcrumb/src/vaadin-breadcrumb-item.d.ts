/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-breadcrumb-item>` is a navigation item to be used within `<vaadin-breadcrumb>`.
 *
 * When `href` is set, it renders as a clickable link. When `href` is absent,
 * it represents the current page and is rendered as non-interactive text
 * with `aria-current="page"`.
 *
 * ```html
 * <vaadin-breadcrumb-item href="/">Home</vaadin-breadcrumb-item>
 * <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name    | Description
 * -------------|-------------
 * `item`       | The list item wrapper
 * `link`       | The anchor or span element
 * `separator`  | The separator element
 */
declare class BreadcrumbItem extends ElementMixin(ThemableMixin(HTMLElement)) {
  /**
   * The URL to navigate to when the breadcrumb item is clicked.
   * When absent, the item is treated as the current page.
   */
  href: string | undefined;

  /**
   * When true, the item is disabled and cannot be interacted with.
   */
  disabled: boolean;

  /**
   * Whether the item is hidden due to overflow.
   * Set by the parent `<vaadin-breadcrumb>` component.
   */
  overflowHidden: boolean;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-breadcrumb-item': BreadcrumbItem;
  }
}

export { BreadcrumbItem };
