/**
 * @license
 * Copyright (c) 2000 - 2025 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { get, set } from '@vaadin/component-base/src/path-utils.js';

/**
 * @polymerMixin
 */
export const GridProEditColumnMixin = (superClass) =>
  class extends superClass {
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
        editModeRenderer: {
          type: Function,
          sync: true,
        },

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
          sync: true,
        },

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
         *
         * @type {(model: GridItemModel) => boolean}
         */
        isCellEditable: {
          type: Function,
          observer: '_isCellEditableChanged',
        },

        /** @private */
        _oldRenderer: Function,
      };
    }

    static get observers() {
      return ['_editModeRendererChanged(editModeRenderer, __initialized)'];
    }

    constructor() {
      super();

      // Enable focus button mode for Mac OS to ensure focused
      // editable cell stays in sync with the VoiceOver cursor
      // https://github.com/vaadin/web-components/issues/3820
      this._focusButtonMode = navigator.platform.includes('Mac');

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
    _isCellEditableChanged() {
      // Re-render grid to update editable-cell part names
      this._grid.requestContentUpdate();
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
      return get(path, editor);
    }

    /** @private */
    _renderEditor(cell, model) {
      cell.__savedRenderer = this._renderer || cell._renderer;
      cell._renderer = this.editModeRenderer || this.__editModeRenderer;

      // Remove role to avoid announcing button while editing
      if (cell._focusButton) {
        cell._focusButton.removeAttribute('role');
      }

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

      // Restore previously removed role attribute
      if (cell._focusButton) {
        cell._focusButton.setAttribute('role', 'button');
      }

      this.__renderCellsContent(cell._renderer, [cell]);
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
      set(path, value, editor);
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
      this._setEditorOptions(editor);
      this._setEditorValue(editor, get(this.path, model.item));
      editor._grid = this._grid;

      if (editor.updateComplete) {
        editor.updateComplete.then(() => this._focusEditor(editor));
      } else {
        this._focusEditor(editor);
      }
    }

    /**
     * @param {!HTMLElement} cell
     * @param {!GridItemModel} model
     * @protected
     */
    _stopCellEdit(cell, model) {
      this._removeEditor(cell, model);
    }
  };
