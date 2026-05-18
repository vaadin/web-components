/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { OverlayMixinClass } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';
import { BreadcrumbsOverlayMixinClass } from './vaadin-breadcrumbs-overlay-mixin.js';

/**
 * An element used internally by `<vaadin-breadcrumbs>`. Not intended to be used separately.
 */
declare class BreadcrumbsOverlay extends BreadcrumbsOverlayMixinClass(OverlayMixinClass(DirMixin(HTMLElement))) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-breadcrumbs-overlay': BreadcrumbsOverlay;
  }
}

export { BreadcrumbsOverlay };
