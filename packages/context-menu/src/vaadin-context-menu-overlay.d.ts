/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { OverlayMixin } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { MenuOverlayMixin } from './vaadin-menu-overlay-mixin.js';

/**
 * An element used internally by `<vaadin-context-menu>`. Not intended to be used separately.
 */
declare class ContextMenuOverlay extends MenuOverlayMixin(OverlayMixin(DirMixin(ThemableMixin(HTMLElement)))) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-context-menu-overlay': ContextMenuOverlay;
  }
}

export { ContextMenuOverlay };
