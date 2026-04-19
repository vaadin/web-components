/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import type { I18nMixin } from '@vaadin/component-base/src/i18n-mixin.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { BreadcrumbMixin } from './vaadin-breadcrumb-mixin.js';

export type BreadcrumbI18n = {
  moreItems: string;
};

/**
 * `<vaadin-breadcrumb>` is a Web Component for displaying a breadcrumb navigation trail.
 *
 * ```html
 * <vaadin-breadcrumb>
 *   <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
 *   <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
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
 * `container`  | The flex container holding the item slot. Has `role="list"`.
 * `dropdown`   | The fixed-position dropdown panel listing collapsed items.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 */
declare class Breadcrumb extends BreadcrumbMixin(
  I18nMixin({} as BreadcrumbI18n, ResizeMixin(ElementMixin(ThemableMixin(HTMLElement)))),
) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-breadcrumb': Breadcrumb;
  }
}

export { Breadcrumb };
