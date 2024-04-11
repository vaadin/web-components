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
import type { GridBodyRenderer, GridItemModel } from '@vaadin/grid/src/vaadin-grid.js';

export type GridProEditorType = 'checkbox' | 'custom' | 'select' | 'text';

export declare class GridProEditColumnMixinClass<TItem> {
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

  /**
   * A function to check whether a specific cell of this column can be
   * edited. This allows to disable editing of individual rows or cells,
   * based on the item.
   *
   * Receives a `model` object containing the item for an individual row,
   * and should return a boolean indicating whether the column's cell in
   * that row is editable.
   *
   * The `model` object contains:
   * - `model.index` The index of the item.
   * - `model.item` The item.
   * - `model.expanded` Sublevel toggle state.
   * - `model.level` Level of the tree represented with a horizontal offset of the toggle button.
   * - `model.selected` Selected state.
   */
  isCellEditable: (model: GridItemModel<TItem>) => boolean;

  protected _getEditorComponent(cell: HTMLElement): HTMLElement | null;

  protected _getEditorValue(editor: HTMLElement): unknown | null;

  protected _startCellEdit(cell: HTMLElement, model: GridItemModel<TItem>): void;

  protected _stopCellEdit(cell: HTMLElement, model: GridItemModel<TItem>): void;
}
