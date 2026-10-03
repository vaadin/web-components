/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { MenuOverlayMixin } from '@vaadin/context-menu/src/vaadin-menu-overlay-mixin.js';
import { OverlayMixin } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';

/**
 * An element used internally by `<vaadin-dropdown-menu>`. Not intended to be used separately.
 */
declare class DropdownMenuOverlay extends MenuOverlayMixin(OverlayMixin(DirMixin(HTMLElement))) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-dropdown-menu-overlay': DropdownMenuOverlay;
  }
}

export { DropdownMenuOverlay };
