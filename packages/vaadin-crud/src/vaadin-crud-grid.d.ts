import { GridElement } from '@vaadin/vaadin-grid/src/vaadin-grid.js';

import { IncludedMixin } from './vaadin-crud-include-mixin.js';

/**
 * `<vaadin-crud-grid>` is a `<vaadin-grid>` which automatically configures all its columns based
 * on the JSON structure of the first item received.
 *
 * You cannot manually configure columns but you can still style the grid as it's described in
 * `<vaadin-grid>` [Documentation](https://vaadin.com/components/vaadin-grid/html-api/elements/Vaadin.GridElement)
 */
declare class CrudGridElement extends IncludedMixin(GridElement) {
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
    'vaadin-crud-grid': CrudGridElement;
  }
}

export { CrudGridElement };
