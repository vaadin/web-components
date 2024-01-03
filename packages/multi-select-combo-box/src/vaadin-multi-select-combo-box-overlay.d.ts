/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ComboBoxOverlayMixin } from '@vaadin/combo-box/src/vaadin-combo-box-overlay-mixin.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { OverlayMixin } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * An element used internally by `<vaadin-multi-select-combo-box>`. Not intended to be used separately.
 */
declare class MultiSelectComboBoxOverlay extends ComboBoxOverlayMixin(
  OverlayMixin(DirMixin(ThemableMixin(HTMLElement))),
) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-multi-select-combo-box-overlay': MultiSelectComboBoxOverlay;
  }
}

export { MultiSelectComboBoxOverlay };
