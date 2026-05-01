/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';

/**
 * `<vaadin-breadcrumb-trail>` is a Web Component that displays the user's location
 * within a hierarchy as a trail of links from the root to the current page.
 */
declare class BreadcrumbTrail extends ElementMixin(HTMLElement) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-breadcrumb-trail': BreadcrumbTrail;
  }
}

export { BreadcrumbTrail };
