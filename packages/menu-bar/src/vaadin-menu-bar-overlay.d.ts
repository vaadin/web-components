/**
 * @license
 * Copyright (c) 2019 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { MenuOverlayMixin } from '@vaadin/context-menu/src/vaadin-menu-overlay-mixin.js';
import { Overlay } from '@vaadin/overlay/src/vaadin-overlay.js';

/**
 * An element used internally by `<vaadin-menu-bar>`. Not intended to be used separately.
 */
declare class MenuBarOverlay extends MenuOverlayMixin(Overlay) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-menu-bar-overlay': MenuBarOverlay;
  }
}

export { MenuBarOverlay };
