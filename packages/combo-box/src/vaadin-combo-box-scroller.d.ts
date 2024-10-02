/**
 * @license
 * Copyright (c) 2015 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ComboBoxScrollerMixin } from './vaadin-combo-box-scroller-mixin.js';

/**
 * An element used internally by `<vaadin-combo-box>`. Not intended to be used separately.
 */
declare class ComboBoxScroller extends ComboBoxScrollerMixin(HTMLElement) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-combo-box-scroller': ComboBoxScroller;
  }
}

export { ComboBoxScroller };
