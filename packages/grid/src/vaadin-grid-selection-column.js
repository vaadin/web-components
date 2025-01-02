/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/checkbox/src/vaadin-checkbox.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { GridColumn } from './vaadin-grid-column.js';
import { GridSelectionColumnMixin } from './vaadin-grid-selection-column-mixin.js';

/**
 * `<vaadin-grid-selection-column>` is a helper element for the `<vaadin-grid>`
 * that provides default renderers and functionality for item selection.
 *
 * #### Example:
 * ```html
 * <vaadin-grid items="[[items]]">
 *  <vaadin-grid-selection-column frozen auto-select></vaadin-grid-selection-column>
 *
 *  <vaadin-grid-column>
 *    ...
 * ```
 *
 * By default the selection column displays `<vaadin-checkbox>` elements in the
 * column cells. The checkboxes in the body rows toggle selection of the corresponding row items.
 *
 * When the grid data is provided as an array of [`items`](#/elements/vaadin-grid#property-items),
 * the column header gets an additional checkbox that can be used for toggling
 * selection for all the items at once.
 *
 * __The default content can also be overridden__
 *
 * @customElement
 * @fires {CustomEvent} select-all-changed - Fired when the `selectAll` property changes.
 * @extends GridColumn
 * @mixes GridSelectionColumnMixin
 */
class GridSelectionColumn extends GridSelectionColumnMixin(GridColumn) {
  static get is() {
    return 'vaadin-grid-selection-column';
  }
}

defineCustomElement(GridSelectionColumn);

export { GridSelectionColumn };
