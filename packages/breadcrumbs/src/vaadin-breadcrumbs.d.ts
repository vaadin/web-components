/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import type { I18nMixinClass } from '@vaadin/component-base/src/i18n-mixin.js';
import type { ResizeMixinClass } from '@vaadin/component-base/src/resize-mixin.js';

export interface BreadcrumbsI18n {
  moreItems?: string;
}

/**
 * `<vaadin-breadcrumbs>` is a Web Component that displays the user's location
 * within a hierarchy as a trail of links from the root to the current page.
 */
declare class Breadcrumbs extends ElementMixin(HTMLElement) {}

interface Breadcrumbs extends I18nMixinClass<BreadcrumbsI18n>, ResizeMixinClass {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-breadcrumbs': Breadcrumbs;
  }
}

export { Breadcrumbs };
