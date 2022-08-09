/**
 * @license
 * Copyright (c) 2018 - 2022 Vaadin Ltd.
 * This program is available under Commercial Vaadin Developer License 4.0, available at https://vaadin.com/license/cvdl-4.0.
 */
import type { GridBodyRenderer, GridDefaultItem, GridItemModel } from '@vaadin/grid/src/vaadin-grid.js';
import { GridColumn } from '@vaadin/grid/src/vaadin-grid-column.js';

export type GridProEditorType = 'checkbox' | 'custom' | 'select' | 'text';

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
 */
declare class GridProEditColumn<TItem = GridDefaultItem> extends GridColumn<TItem> {
  /**
   * JS Path of the property in the item used for the editable content.
   */
  path: string | null | undefined;

  /**
   * Custom function for rendering the cell content in edit mode.
   * Receives three arguments:
   *
   * - `root` The cell content DOM element. Append your editor component to it.
   * - `column` The `<vaadin-grid-pro-edit-column>` element.
   * - `model` The object with the properties related with
   *   the rendered item, contains:
   *   - `model.index` The index of the item.
   *   - `model.item` The item.
   *   - `model.expanded` Sublevel toggle state.
   *   - `model.level` Level of the tree represented with a horizontal offset of the toggle button.
   *   - `model.selected` Selected state.
   *   - `model.detailsOpened` Details opened state.
   */
  editModeRenderer: GridBodyRenderer<TItem> | null | undefined;

  /**
   * The list of options which should be passed to cell editor component.
   * Used with the `select` editor type, to provide a list of items.
   */
  editorOptions: string[];

  /**
   * Type of the cell editor component to be rendered. Allowed values:
   * - `text` (default) - renders a text field
   * - `checkbox` - renders a checkbox
   * - `select` - renders a select with a list of items passed as `editorOptions`
   *
   * Editor type is set to `custom` when `editModeRenderer` is set.
   * @attr {text|checkbox|select|custom} editor-type
   */
  editorType: GridProEditorType;

  /**
   * Path of the property used for the value of the editor component.
   * @attr {string} editor-value-path
   */
  editorValuePath: string;

  protected _getEditorComponent(cell: HTMLElement): HTMLElement | null;

  protected _getEditorValue(editor: HTMLElement): unknown | null;

  protected _startCellEdit(cell: HTMLElement, model: GridItemModel<TItem>): void;

  protected _stopCellEdit(cell: HTMLElement, model: GridItemModel<TItem>): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-grid-pro-edit-column': GridProEditColumn<GridDefaultItem>;
  }
}

export { GridProEditColumn };
