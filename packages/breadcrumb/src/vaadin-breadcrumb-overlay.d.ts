/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { OverlayMixin } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';
import { PositionMixin } from '@vaadin/overlay/src/vaadin-overlay-position-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { BreadcrumbOverlayMixin } from './vaadin-breadcrumb-overlay-mixin.js';

/**
 * An element used internally by `<vaadin-breadcrumb>` to host the list of
 * collapsed items in the overflow menu. Not intended to be used separately.
 */
declare class BreadcrumbOverlay extends BreadcrumbOverlayMixin(
  PositionMixin(OverlayMixin(ThemableMixin(HTMLElement))),
) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-breadcrumb-overlay': BreadcrumbOverlay;
  }
}

export { BreadcrumbOverlay };
