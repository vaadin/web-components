/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { OverlayMixin } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';
import { PositionMixin } from '@vaadin/overlay/src/vaadin-overlay-position-mixin.js';

/**
 * An element used internally by `<vaadin-query-field>`. Not intended to be used separately.
 */
declare class QueryFieldOverlay extends PositionMixin(OverlayMixin(DirMixin(HTMLElement))) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-query-field-overlay': QueryFieldOverlay;
  }
}

export { QueryFieldOverlay };
