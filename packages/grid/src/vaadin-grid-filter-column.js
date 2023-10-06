/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-grid-filter.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { GridColumn } from './vaadin-grid-column.js';
import { GridFilterColumnMixin } from './vaadin-grid-filter-column-mixin.js';

/**
 * `<vaadin-grid-filter-column>` is a helper element for the `<vaadin-grid>`
 * that provides default header renderer and functionality for filtering.
 *
 * #### Example:
 * ```html
 * <vaadin-grid items="[[items]]">
 *  <vaadin-grid-filter-column path="name.first"></vaadin-grid-filter-column>
 *
 *  <vaadin-grid-column>
 *    ...
 * ```
 *
 * @customElement
 * @extends GridColumn
 * @mixes GridFilterColumnMixin
 */
class GridFilterColumn extends GridFilterColumnMixin(GridColumn) {
  static get is() {
    return 'vaadin-grid-filter-column';
  }
}

defineCustomElement(GridFilterColumn);

export { GridFilterColumn };
