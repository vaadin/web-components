/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Overlay } from '@vaadin/overlay/src/vaadin-overlay.js';
import { MenuOverlayMixin } from './vaadin-menu-overlay-mixin.js';

/**
 * An element used internally by `<vaadin-context-menu>`. Not intended to be used separately.
 */
declare class ContextMenuOverlay extends MenuOverlayMixin(Overlay) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-context-menu-overlay': ContextMenuOverlay;
  }
}

export { ContextMenuOverlay };
