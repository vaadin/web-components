/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * An element used internally by `<vaadin-breadcrumb>`. Not intended to be used separately.
 */
declare class BreadcrumbOverlay extends ThemableMixin(HTMLElement) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-breadcrumb-overlay': BreadcrumbOverlay;
  }
}

export { BreadcrumbOverlay };
