/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { DialogOverlayMixin } from './vaadin-dialog-overlay-mixin.js';

export { DialogOverlayBounds, DialogOverlayBoundsParam } from './vaadin-dialog-overlay-mixin.js';

/**
 * An element used internally by `<vaadin-dialog>`. Not intended to be used separately.
 */
export class DialogOverlay extends DialogOverlayMixin(DirMixin(ThemableMixin(HTMLElement))) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-dialog-overlay': DialogOverlay;
  }
}
