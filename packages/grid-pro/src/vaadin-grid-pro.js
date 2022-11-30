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
import { InlineEditingMixin } from './vaadin-grid-pro-inline-editing-mixin.js';

/**
 *
 * `<vaadin-grid-pro>` is a high quality data grid / data table Web Component with extended functionality.
 * It extends `<vaadin-grid>` and adds extra features on top of the basic ones.
 *
 * See [`<vaadin-grid>`](#/elements/vaadin-grid) documentation for details.
 *
 * ```
 * <vaadin-grid-pro></vaadin-grid-pro>
 * ```
 *
 * ### Internal components
 *
 * In addition to `<vaadin-grid-pro>` itself, the following internal
 * components are themable:
 *
 * - `<vaadin-grid-pro-edit-checkbox>` - has the same API as [`<vaadin-checkbox>`](#/elements/vaadin-checkbox).
 * - `<vaadin-grid-pro-edit-text-field>` - has the same API as [`<vaadin-text-field>`](#/elements/vaadin-text-field).
 * - `<vaadin-grid-pro-edit-select>` - has the same API as [`<vaadin-select>`](#/elements/vaadin-select).
 *
 * @fires {CustomEvent} active-item-changed - Fired when the `activeItem` property changes.
 * @fires {CustomEvent} cell-activate - Fired when the cell is activated with click or keyboard.
 * @fires {CustomEvent} cell-edit-started - Fired when the user starts editing a grid cell.
 * @fires {CustomEvent} column-reorder - Fired when the columns in the grid are reordered.
 * @fires {CustomEvent} column-resize - Fired when the grid column resize is finished.
 * @fires {CustomEvent} expanded-items-changed - Fired when the `expandedItems` property changes.
 * @fires {CustomEvent} grid-dragstart - Fired when starting to drag grid rows.
 * @fires {CustomEvent} grid-dragend - Fired when the dragging of the rows ends.
 * @fires {CustomEvent} grid-drop - Fired when a drop occurs on top of the grid.
 * @fires {CustomEvent} item-property-changed - Fired before exiting the cell edit mode, if the value has been changed.
 * @fires {CustomEvent} loading-changed - Fired when the `loading` property changes.
 * @fires {CustomEvent} selected-items-changed - Fired when the `selectedItems` property changes.
 *
 * @extends Grid
 * @mixes InlineEditingMixin
 */
class GridPro extends InlineEditingMixin(Grid) {
  static get is() {
    return 'vaadin-grid-pro';
  }

  static get cvdlName() {
    return 'vaadin-grid-pro';
  }
}

customElements.define(GridPro.is, GridPro);

export { GridPro };
