/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-grid-sorter.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { GridColumn } from './vaadin-grid-column.js';
import { GridSortColumnMixin } from './vaadin-grid-sort-column-mixin.js';

/**
 * `<vaadin-grid-sort-column>` is a helper element for the `<vaadin-grid>`
 * that provides default header renderer and functionality for sorting.
 *
 * #### Example:
 * ```html
 * <vaadin-grid items="[[items]]">
 *  <vaadin-grid-sort-column path="name.first" direction="asc"></vaadin-grid-sort-column>
 *
 *  <vaadin-grid-column>
 *    ...
 * ```
 *
 * @fires {CustomEvent} direction-changed - Fired when the `direction` property changes.
 *
 * @customElement
 * @extends GridColumn
 * @mixes GridSortColumnMixin
 */
class GridSortColumn extends GridSortColumnMixin(GridColumn) {
  static get is() {
    return 'vaadin-grid-sort-column';
  }
}

defineCustomElement(GridSortColumn);

export { GridSortColumn };
