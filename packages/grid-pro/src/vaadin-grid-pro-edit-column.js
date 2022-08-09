/**
 * @license
 * Copyright (c) 2018 - 2022 Vaadin Ltd.
 * This program is available under Commercial Vaadin Developer License 4.0, available at https://vaadin.com/license/cvdl-4.0.
 */
import './vaadin-grid-pro-edit-checkbox.js';
import './vaadin-grid-pro-edit-select.js';
import './vaadin-grid-pro-edit-text-field.js';
import { get, set } from '@polymer/polymer/lib/utils/path.js';
import { GridColumn } from '@vaadin/grid/src/vaadin-grid-column.js';

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
 * @extends GridColumn
 */
class GridProEditColumn extends GridColumn {
  static get is() {
    return 'vaadin-grid-pro-edit-column';
  }

  static get properties() {
    return {
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
       * @type {!GridBodyRenderer | null | undefined}
       */
      editModeRenderer: Function,

      /**
       * The list of options which should be passed to cell editor component.
       * Used with the `select` editor type, to provide a list of items.
       * @type {!Array<string>}
       */
      editorOptions: {
        type: Array,
        value: () => [],
      },

      /**
       * Type of the cell editor component to be rendered. Allowed values:
       * - `text` (default) - renders a text field
       * - `checkbox` - renders a checkbox
       * - `select` - renders a select with a list of items passed as `editorOptions`
       *
       * Editor type is set to `custom` when `editModeRenderer` is set.
       * @attr {text|checkbox|select|custom} editor-type
       * @type {!GridProEditorType}
       */
      editorType: {
        type: String,
        notify: true, // FIXME(web-padawan): needed by Flow counterpart
        value: 'text',
      },

      /**
       * Path of the property used for the value of the editor component.
       * @attr {string} editor-value-path
       * @type {string}
       */
      editorValuePath: {
        type: String,
        value: 'value',
      },

      /**
       * JS Path of the property in the item used for the editable content.
       */
      path: {
        type: String,
        observer: '_pathChanged',
      },

      /** @private */
      _oldRenderer: Function,
    };
  }

  static get observers() {
    return ['_editModeRendererChanged(editModeRenderer, __initialized)', '_cellsChanged(_cells.*)'];
  }

  constructor() {
    super();

    this.__editModeRenderer = function (root, column) {
      const cell = root.assignedSlot.parentNode;

      const tagName = column._getEditorTagName(cell);
      if (!root.firstElementChild || root.firstElementChild.localName.toLowerCase() !== tagName) {
        root.innerHTML = `
          <${tagName}></${tagName}>
        `;
      }
    };
  }

  /** @private */
  _pathChanged(path) {
    if (!path || path.length === 0) {
      throw new Error('You should specify the path for the edit column');
    }
  }

  /** @private */
  _cellsChanged() {
    this._cells.forEach((cell) => {
      const part = cell.getAttribute('part');
      if (part.indexOf('editable-cell') < 0) {
        cell.setAttribute('part', `${part} editable-cell`);
      }
    });
  }

  /** @private */
  _editModeRendererChanged(renderer) {
    if (renderer) {
      this.editorType = 'custom';
    } else if (this._oldRenderer) {
      this.editorType = 'text';
    }

    this._oldRenderer = renderer;
  }

  /**
   * @param {!HTMLElement} cell
   * @return {string}
   * @protected
   */
  _getEditorTagName(cell) {
    return this.editorType === 'custom' ? this._getEditorComponent(cell).localName : this._getTagNameByType();
  }

  /**
   * @param {!HTMLElement} cell
   * @return {HTMLElement | null}
   * @protected
   */
  _getEditorComponent(cell) {
    return this.editorType === 'custom'
      ? cell._content.firstElementChild
      : cell._content.querySelector(this._getEditorTagName(cell));
  }

  /** @private */
  _getTagNameByType() {
    let type;
    switch (this.editorType) {
      case 'checkbox':
        type = 'checkbox';
        break;
      case 'select':
        type = 'select';
        break;
      case 'text':
      default:
        type = 'text-field';
        break;
    }
    return this.constructor.is.replace('column', type);
  }

  /** @private */
  _focusEditor(editor) {
    editor.focus();
    if (this.editorType === 'checkbox') {
      editor.setAttribute('focus-ring', '');
    } else if (editor instanceof HTMLInputElement) {
      editor.select();
    } else if (editor.focusElement && editor.focusElement instanceof HTMLInputElement) {
      editor.focusElement.select();
    }
  }

  /**
   * @param {!HTMLElement} editor
   * @return {unknown}
   * @protected
   */
  _getEditorValue(editor) {
    const path = this.editorType === 'checkbox' ? 'checked' : this.editorValuePath;
    return get(editor, path);
  }

  /** @private */
  _renderEditor(cell, model) {
    cell.__savedRenderer = this._renderer || cell._renderer;
    cell._renderer = this.editModeRenderer || this.__editModeRenderer;

    this._clearCellContent(cell);
    this._runRenderer(cell._renderer, cell, model);
  }

  /** @private */
  _removeEditor(cell, _model) {
    if (!cell.__savedRenderer) {
      return;
    }

    cell._renderer = cell.__savedRenderer;
    cell.__savedRenderer = undefined;

    this._clearCellContent(cell);

    const row = cell.parentElement;
    this._grid._updateItem(row, row._item);
  }

  /** @private */
  _setEditorOptions(editor) {
    if (this.editorOptions && this.editorOptions.length) {
      editor.options = this.editorOptions;
    }
  }

  /** @private */
  _setEditorValue(editor, value) {
    const path = this.editorType === 'checkbox' ? 'checked' : this.editorValuePath;
    // FIXME(yuriy): Required for the flow counterpart as it is passing the string value to webcomponent
    value = this.editorType === 'checkbox' && typeof value === 'string' ? value === 'true' : value;
    set(editor, path, value);
    if (editor.notifyPath) {
      editor.notifyPath(path, value);
    }
  }

  /**
   * @param {!HTMLElement} cell
   * @param {!GridItemModel} model
   * @protected
   */
  _startCellEdit(cell, model) {
    this._renderEditor(cell, model);

    const editor = this._getEditorComponent(cell);
    editor.addEventListener('focusout', this._grid.__boundEditorFocusOut);
    editor.addEventListener('focusin', this._grid.__boundEditorFocusIn);
    editor.addEventListener('internal-tab', this._grid.__boundCancelCellSwitch);
    document.body.addEventListener('focusin', this._grid.__boundGlobalFocusIn);
    this._setEditorOptions(editor);
    this._setEditorValue(editor, get(model.item, this.path));
    editor._grid = this._grid;
    this._focusEditor(editor);
  }

  /**
   * @param {!HTMLElement} cell
   * @param {!GridItemModel} model
   * @protected
   */
  _stopCellEdit(cell, model) {
    document.body.removeEventListener('focusin', this._grid.__boundGlobalFocusIn);

    this._removeEditor(cell, model);
  }
}

customElements.define(GridProEditColumn.is, GridProEditColumn);

export { GridProEditColumn };
