/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { OverlayMixin } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';
import { PositionMixin } from '@vaadin/overlay/src/vaadin-overlay-position-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * An element used internally by `<vaadin-breadcrumb>`. Not intended to be used separately.
 */
declare class BreadcrumbOverlay extends OverlayMixin(PositionMixin(DirMixin(ThemableMixin(HTMLElement)))) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-breadcrumb-overlay': BreadcrumbOverlay;
  }
}

export { BreadcrumbOverlay };
