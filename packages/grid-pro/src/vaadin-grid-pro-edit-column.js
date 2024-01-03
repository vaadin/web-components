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
import './vaadin-grid-pro-edit-checkbox.js';
import './vaadin-grid-pro-edit-select.js';
import './vaadin-grid-pro-edit-text-field.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { GridColumn } from '@vaadin/grid/src/vaadin-grid-column.js';
import { GridProEditColumnMixin } from './vaadin-grid-pro-edit-column-mixin.js';

/**
 * `<vaadin-grid-pro-edit-column>` is a helper element for the `<vaadin-grid-pro>`
 * that provides default inline editing for the items.
 *
 * __Note that the `path` property must be explicitly specified for edit column.__
 *
 * #### Example:
 * ```html
 * <vaadin-grid-pro items="[[items]]">
 *  <vaadin-grid-pro-edit-column path="name.first"></vaadin-grid-pro-edit-column>
 *
 *  <vaadin-grid-column>
 *    ...
 * ```
 *
 * @customElement
 * @extends GridColumn
 * @mixes GridProEditColumnMixin
 */
class GridProEditColumn extends GridProEditColumnMixin(GridColumn) {
  static get is() {
    return 'vaadin-grid-pro-edit-column';
  }
}

defineCustomElement(GridProEditColumn);

export { GridProEditColumn };
