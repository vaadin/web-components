/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ComboBoxScrollerMixin } from '@vaadin/combo-box/src/vaadin-combo-box-scroller-mixin.js';

/**
 * An element used internally by `<vaadin-multi-select-combo-box>`. Not intended to be used separately.
 */
declare class MultiSelectComboBoxScroller extends ComboBoxScrollerMixin(HTMLElement) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-multi-select-combo-box-scroller': MultiSelectComboBoxScroller;
  }
}

export { MultiSelectComboBoxScroller };
