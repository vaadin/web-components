/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { GridColumnMixin } from './vaadin-grid-column-mixin.js';

/**
 * A `<vaadin-grid-column>` is used to configure how a column in `<vaadin-grid>`
 * should look like.
 *
 * See [`<vaadin-grid>`](#/elements/vaadin-grid) documentation for instructions on how
 * to configure the `<vaadin-grid-column>`.
 *
 * @extends HTMLElement
 * @mixes ColumnBaseMixin
 */
class GridColumn extends GridColumnMixin(PolymerElement) {
  static get is() {
    return 'vaadin-grid-column';
  }
}

customElements.define(GridColumn.is, GridColumn);

export { GridColumn };

export { ColumnBaseMixin } from './vaadin-grid-column-mixin.js';
