/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export interface BreadcrumbItemConfig {
  text: string;
  href?: string;
  disabled?: boolean;
}

/**
 * `<vaadin-breadcrumb>` is a Web Component for displaying breadcrumb navigation trails.
 *
 * ```html
 * <vaadin-breadcrumb>
 *   <vaadin-breadcrumb-item href="/">Home</vaadin-breadcrumb-item>
 *   <vaadin-breadcrumb-item href="/products">Products</vaadin-breadcrumb-item>
 *   <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
 * </vaadin-breadcrumb>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name    | Description
 * -------------|-------------
 * `list`       | The ordered list element
 * `overflow`   | The overflow/ellipsis button
 *
 * The following state attributes are available for styling:
 *
 * Attribute      | Description
 * ---------------|-------------
 * `has-overflow`  | Set when some items are hidden due to overflow.
 */
declare class Breadcrumb extends ResizeMixin(ElementMixin(ThemableMixin(HTMLElement))) {
  /**
   * Data-driven items as an alternative to slotted children.
   */
  items: BreadcrumbItemConfig[] | undefined;

  /**
   * The accessible label for the navigation landmark.
   */
  label: string;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-breadcrumb': Breadcrumb;
  }
}

export { Breadcrumb };
