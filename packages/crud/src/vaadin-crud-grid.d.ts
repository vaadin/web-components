/**
 * @license
 * Copyright (c) 2000 - 2022 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { Grid } from '@vaadin/grid/src/vaadin-grid.js';
import { IncludedMixin } from './vaadin-crud-include-mixin.js';

/**
 * An element used internally by `<vaadin-crud>`. Not intended to be used separately.
 */
declare class CrudGrid extends IncludedMixin(Grid) {
  /**
   * Disable filtering in the generated columns.
   * @attr {boolean} no-filter
   */
  noFilter: boolean | null | undefined;

  /**
   * Disable sorting in the generated columns.
   * @attr {boolean} no-sort
   */
  noSort: boolean | null | undefined;

  /**
   * Do not add headers to columns.
   * @attr {boolean} no-head
   */
  noHead: boolean | null | undefined;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-crud-grid': CrudGrid;
  }
}

export { CrudGrid };
