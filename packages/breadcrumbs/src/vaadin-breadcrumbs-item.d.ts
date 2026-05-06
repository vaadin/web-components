/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';

/**
 * `<vaadin-breadcrumbs-item>` is a single item inside a `<vaadin-breadcrumbs>`.
 */
declare class BreadcrumbsItem extends ElementMixin(HTMLElement) {
  /**
   * The path to navigate to. When set, the item renders as a link
   * (`<a part="link">`); when unset, it renders as a non-link
   * (`<span part="nolink">`).
   */
  path: string | null | undefined;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-breadcrumbs-item': BreadcrumbsItem;
  }
}

export { BreadcrumbsItem };
