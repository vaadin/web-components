import { GridColumnElement } from '@vaadin/vaadin-grid/src/vaadin-grid-column.js';

import { GridBodyRenderer, GridItemModel } from '@vaadin/vaadin-grid';

import { GridProEditorType } from './interfaces';

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
declare class GridProEditColumnElement extends GridColumnElement {
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
   * - `rowData` The object with the properties related with
   *   the rendered item, contains:
   *   - `rowData.index` The index of the item.
   *   - `rowData.item` The item.
   *   - `rowData.expanded` Sublevel toggle state.
   *   - `rowData.level` Level of the tree represented with a horizontal offset of the toggle button.
   *   - `rowData.selected` Selected state.
   */
  editModeRenderer: GridBodyRenderer | null | undefined;

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
   * Editor type is set to `custom` when either `editModeRenderer` is set,
   * or editor template provided for the column.
   * @attr {text|checkbox|select|custom} editor-type
   */
  editorType: GridProEditorType;

  /**
   * Path of the property used for the value of the editor component.
   * @attr {string} editor-value-path
   */
  editorValuePath: string;

  /**
   * Override body template preparation to take editor into account.
   */
  _prepareBodyTemplate(): HTMLTemplateElement | null;

  /**
   * Override template filtering to take editor into account.
   */
  _selectFirstTemplate(header?: boolean, footer?: boolean, editor?: boolean): HTMLTemplateElement | null;

  /**
   * Override template search to take editor into account.
   */
  _findTemplate(header: boolean, footer: boolean, editor?: boolean): HTMLTemplateElement | null;

  _getEditorTagName(cell: HTMLElement): string;

  _getEditorComponent(cell: HTMLElement): HTMLElement | null;

  _getEditorValue(editor: HTMLElement): unknown | null;

  _startCellEdit(cell: HTMLElement, model: GridItemModel): void;

  _stopCellEdit(cell: HTMLElement, model: GridItemModel): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-grid-pro-edit-column': GridProEditColumnElement;
  }
}

export { GridProEditColumnElement };
