/**
 * @license
 * Copyright (c) 2015 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Overlay } from '@vaadin/overlay/src/vaadin-overlay.js';
import { ComboBoxOverlayMixin } from './vaadin-combo-box-overlay-mixin.js';

/**
 * An element used internally by `<vaadin-combo-box>`. Not intended to be used separately.
 */
declare class ComboBoxOverlay extends ComboBoxOverlayMixin(Overlay) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-combo-box-overlay': ComboBoxOverlay;
  }
}

export { ComboBoxOverlay };
