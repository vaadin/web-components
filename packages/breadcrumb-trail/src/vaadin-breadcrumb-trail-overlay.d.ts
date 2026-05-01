/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { OverlayMixin } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';
import { PositionMixin } from '@vaadin/overlay/src/vaadin-overlay-position-mixin.js';

/**
 * An element used internally by `<vaadin-breadcrumb-trail>` for the overflow popup.
 * Not intended to be used separately.
 */
declare class BreadcrumbTrailOverlay extends PositionMixin(OverlayMixin(HTMLElement)) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-breadcrumb-trail-overlay': BreadcrumbTrailOverlay;
  }
}

export { BreadcrumbTrailOverlay };
