/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * An internal custom element used by `<vaadin-grid>` as the row element in the
 * shadow DOM. Exposes `ElementInternals` so that grid mixins can toggle custom
 * states that author CSS can target with `:state(...)`.
 */
declare class GridRow extends HTMLElement {
  protected _internals: ElementInternals;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-grid-row': GridRow;
  }
}

export { GridRow };
