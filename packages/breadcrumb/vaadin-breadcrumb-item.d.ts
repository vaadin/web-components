/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DisabledMixin } from '@vaadin/a11y-base/src/disabled-mixin.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-breadcrumb-item>` is a Web Component for displaying a single item in a breadcrumb trail.
 *
 * ```html
 * <vaadin-breadcrumb-item href="/products">Products</vaadin-breadcrumb-item>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name    | Description
 * -------------|----------------
 * `link`       | The link element
 * `separator`  | The separator element
 *
 * The following state attributes are available for styling:
 *
 * Attribute   | Description
 * ------------|-------------
 * `disabled`  | Set when the element is disabled
 * `last`      | Set when this is the last item in the breadcrumb
 * `current`   | Set when the item's href matches the current page
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 */
declare class BreadcrumbItem extends DisabledMixin(DirMixin(ElementMixin(ThemableMixin(HTMLElement)))) {
  /**
   * The URL to navigate to
   */
  href: string | null | undefined;

  /**
   * The target of the link
   */
  target: string | null | undefined;

  /**
   * Whether to exclude the item from client-side routing
   */
  routerIgnore: boolean;

  /**
   * Whether the item's href matches the current page
   */
  readonly current: boolean;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-breadcrumb-item': BreadcrumbItem;
  }
}

export { BreadcrumbItem };
