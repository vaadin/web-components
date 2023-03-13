/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ComboBoxOverlayMixin } from '@vaadin/combo-box/src/vaadin-combo-box-overlay-mixin.js';
import { Overlay } from '@vaadin/overlay/src/vaadin-overlay.js';

/**
 * An element used internally by `<vaadin-multi-select-combo-box>`. Not intended to be used separately.
 */
declare class MultiSelectComboBoxOverlay extends ComboBoxOverlayMixin(Overlay) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-multi-select-combo-box-overlay': MultiSelectComboBoxOverlay;
  }
}

export { MultiSelectComboBoxOverlay };
