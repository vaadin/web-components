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
import { Grid } from '@vaadin/grid/src/vaadin-grid.js';
import { CrudGridMixin } from './vaadin-crud-grid-mixin.js';

/**
 * An element used internally by `<vaadin-crud>`. Not intended to be used separately.
 */
declare class CrudGrid extends CrudGridMixin(Grid) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-crud-grid': CrudGrid;
  }
}

export { CrudGrid };
