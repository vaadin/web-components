/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
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
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { Grid } from '@vaadin/grid/src/vaadin-lit-grid.js';
import { CrudGridMixin } from './vaadin-crud-grid-mixin.js';

/**
 *
 */
class CrudGrid extends CrudGridMixin(PolylitMixin(Grid)) {
  static get is() {
    return 'vaadin-crud-grid';
  }
}
defineCustomElement(CrudGrid);
export { CrudGrid };
