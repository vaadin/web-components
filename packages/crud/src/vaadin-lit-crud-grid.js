/**
 * @license
 * Copyright (c) 2000 - 2025 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import '@vaadin/grid/src/vaadin-lit-grid-column-group.js';
import '@vaadin/grid/src/vaadin-lit-grid-column.js';
import '@vaadin/grid/src/vaadin-lit-grid-filter.js';
import '@vaadin/grid/src/vaadin-lit-grid-sorter.js';
import './vaadin-lit-crud-edit-column.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { Grid } from '@vaadin/grid/src/vaadin-lit-grid.js';
import { CrudGridMixin } from './vaadin-crud-grid-mixin.js';

/**
 * An element used internally by `<vaadin-crud>`. Not intended to be used separately.
 *
 * @extends Grid
 * @mixes CrudGridMixin
 * @private
 */
class CrudGrid extends CrudGridMixin(Grid) {
  static get is() {
    return 'vaadin-crud-grid';
  }
}

defineCustomElement(CrudGrid);

export { CrudGrid };
