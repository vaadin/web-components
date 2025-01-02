/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { GridColumnMixin } from './vaadin-grid-column-mixin.js';

/**
 * A `<vaadin-grid-column>` is used to configure how a column in `<vaadin-grid>`
 * should look like.
 *
 * See [`<vaadin-grid>`](#/elements/vaadin-grid) documentation for instructions on how
 * to configure the `<vaadin-grid-column>`.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes GridColumnMixin
 */
class GridColumn extends GridColumnMixin(PolymerElement) {
  static get is() {
    return 'vaadin-grid-column';
  }
}

defineCustomElement(GridColumn);

export { GridColumn };

export { ColumnBaseMixin } from './vaadin-grid-column-mixin.js';
