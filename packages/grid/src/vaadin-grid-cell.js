/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { defineCustomElement } from '@vaadin/component-base/src/define.js';

/**
 * An internal custom element used by `<vaadin-grid>` as the cell element in the
 * shadow DOM. Exposes `ElementInternals` so that grid mixins can toggle custom
 * states that author CSS can target with `:state(...)`.
 *
 * @customElement vaadin-grid-cell
 * @extends HTMLElement
 * @private
 */
class GridCell extends HTMLElement {
  static get is() {
    return 'vaadin-grid-cell';
  }

  constructor() {
    super();
    this._internals = this.attachInternals();
  }
}

defineCustomElement(GridCell);

export { GridCell };
