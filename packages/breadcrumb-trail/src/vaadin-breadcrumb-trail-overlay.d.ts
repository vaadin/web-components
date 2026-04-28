/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { OverlayMixin } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';
import { PositionMixin } from '@vaadin/overlay/src/vaadin-overlay-position-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { BreadcrumbTrailOverlayMixin } from './vaadin-breadcrumb-trail-overlay-mixin.js';

/**
 * An element used internally by `<vaadin-breadcrumb-trail>` for the overflow popup.
 * Not intended to be used separately.
 */
declare class BreadcrumbTrailOverlay extends BreadcrumbTrailOverlayMixin(
  PositionMixin(OverlayMixin(ThemableMixin(HTMLElement))),
) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-breadcrumb-trail-overlay': BreadcrumbTrailOverlay;
  }
}

export { BreadcrumbTrailOverlay };
