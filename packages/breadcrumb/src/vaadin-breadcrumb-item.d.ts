/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-breadcrumb-item>` is a Web Component for individual breadcrumb items
 * within a `<vaadin-breadcrumb>` container.
 *
 * ```html
 * <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name    | Description
 * -------------|-------------
 * `link`       | The `<a>` element rendering the item as a link.
 * `separator`  | The visual separator after the item.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 */
declare class BreadcrumbItem extends ElementMixin(ThemableMixin(HTMLElement)) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-breadcrumb-item': BreadcrumbItem;
  }
}

export { BreadcrumbItem };
