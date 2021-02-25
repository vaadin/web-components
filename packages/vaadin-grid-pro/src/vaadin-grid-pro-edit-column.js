/**
 * @license
 * Copyright (c) 2019 - 2021 Vaadin Ltd.
 * This program is available under Commercial Vaadin Developer License 4.0 (CVDLv4).
 * See <a href="https://vaadin.com/license/cvdl-4.0">the website</a> for the complete license.
 */
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import { get, set } from '@polymer/polymer/lib/utils/path.js';
import { GridColumnElement } from '@vaadin/vaadin-grid/src/vaadin-grid-column.js';
import './vaadin-grid-pro-edit-checkbox.js';
import './vaadin-grid-pro-edit-select.js';
import './vaadin-grid-pro-edit-text-field.js';

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
 * @extends GridColumnElement
 */
class GridProEditColumnElement extends GridColumnElement {
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
       * - `rowData` The object with the properties related with
       *   the rendered item, contains:
       *   - `rowData.index` The index of the item.
       *   - `rowData.item` The item.
       *   - `rowData.expanded` Sublevel toggle state.
       *   - `rowData.level` Level of the tree represented with a horizontal offset of the toggle button.
       *   - `rowData.selected` Selected state.
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
        value: () => []
      },

      /**
       * Type of the cell editor component to be rendered. Allowed values:
       * - `text` (default) - renders a text field
       * - `checkbox` - renders a checkbox
       * - `select` - renders a select with a list of items passed as `editorOptions`
       *
       * Editor type is set to `custom` when either `editModeRenderer` is set,
       * or editor template provided for the column.
       * @attr {text|checkbox|select|custom} editor-type
       * @type {!GridProEditorType}
       */
      editorType: {
        type: String,
        notify: true, // FIXME(web-padawan): needed by Flow counterpart
        value: 'text'
      },

      /**
       * Path of the property used for the value of the editor component.
       * @attr {string} editor-value-path
       * @type {string}
       */
      editorValuePath: {
        type: String,
        value: 'value'
      },

      /**
       * JS Path of the property in the item used for the editable content.
       */
      path: {
        type: String,
        observer: '_pathChanged'
      },

      /** @private */
      _oldTemplate: Object,

      /** @private */
      _oldRenderer: Function
    };
  }

  static get observers() {
    return ['_editModeTemplateOrRendererChanged(_editModeTemplate, editModeRenderer)', '_cellsChanged(_cells.*)'];
  }

  constructor() {
    super();

    this._editTemplateObserver = new FlattenedNodesObserver(this, () => {
      this._editModeTemplate = this._prepareEditModeTemplate();
    });

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

  /** @protected */
  ready() {
    super.ready();

    this._editTemplateObserver.flush();
  }

  /** @private */
  _pathChanged(path) {
    if (!path || path.length == 0) {
      throw new Error('You should specify the path for the edit column');
    }
  }

  /** @private */
  _cellsChanged() {
    this._cells.forEach((cell) => {
      const part = cell.getAttribute('part');
      if (part.indexOf('editable-cell') < 0) {
        cell.setAttribute('part', part + ' editable-cell');
      }
    });
  }

  /** @private */
  _removeNewRendererOrTemplate(template, oldTemplate, renderer, oldRenderer) {
    if (template !== oldTemplate) {
      this._editModeTemplate = undefined;
    } else if (renderer !== oldRenderer) {
      this.editModeRenderer = undefined;
    }
  }

  /** @private */
  _editModeTemplateOrRendererChanged(template, renderer) {
    if (template === undefined && renderer === undefined && !this._oldTemplate && !this._oldRenderer) {
      return;
    }
    if (template && renderer) {
      this._removeNewRendererOrTemplate(template, this._oldTemplate, renderer, this._oldRenderer);
      throw new Error('You should only use either a renderer or a template');
    }
    if (template || renderer) {
      this.editorType = 'custom';
    } else if (this._oldRenderer || this._oldTemplate) {
      this.editorType = 'text';
    }
    this._oldTemplate = template;
    this._oldRenderer = renderer;
  }

  /**
   * Override body template preparation to take editor into account.
   * @return {HTMLTemplateElement}
   * @protected
   */
  _prepareBodyTemplate() {
    return this._prepareTemplatizer(this._findTemplate(false, false, false) || null);
  }

  /**
   * Override template filtering to take editor into account.
   * @param {boolean} header
   * @param {boolean} footer
   * @param {boolean} editor
   * @return {HTMLTemplateElement}
   * @protected
   */
  _selectFirstTemplate(header = false, footer = false, editor = false) {
    return FlattenedNodesObserver.getFlattenedNodes(this).filter(
      (node) =>
        node.localName === 'template' &&
        node.classList.contains('header') === header &&
        node.classList.contains('footer') === footer &&
        node.classList.contains('editor') === editor
    )[0];
  }

  /**
   * Override template search to take editor into account.
   * @param {boolean} header
   * @param {boolean} footer
   * @param {boolean=} editor
   * @return {HTMLTemplateElement}
   * @protected
   */
  _findTemplate(header, footer, editor) {
    const template = this._selectFirstTemplate(header, footer, editor);
    if (template) {
      if (this.dataHost) {
        // set dataHost to the context where template has been defined
        template._rootDataHost = this.dataHost._rootDataHost || this.dataHost;
      }
    }
    return template;
  }

  /** @private */
  _prepareEditModeTemplate() {
    return this._prepareTemplatizer(this._findTemplate(false, false, true) || null, {});
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
    if (cell._template) {
      cell.__savedTemplate = cell._template;
      cell._template = undefined;
    } else {
      // fallback to the path renderer stored on the cell
      cell.__savedRenderer = this.renderer || cell._renderer;
      cell._renderer = undefined;
    }

    if (this._editModeTemplate) {
      this._stampTemplateToCell(cell, this._editModeTemplate, model);
    } else {
      this._stampRendererToCell(cell, this.editModeRenderer || this.__editModeRenderer, model);
    }
  }

  /** @private */
  _removeEditor(cell, model) {
    if (cell.__savedTemplate) {
      this._stampTemplateToCell(cell, cell.__savedTemplate, model);
      cell._renderer = undefined;
      cell.__savedTemplate = undefined;
    } else if (cell.__savedRenderer) {
      this._stampRendererToCell(cell, cell.__savedRenderer, model);
      cell._template = undefined;
      cell.__savedRenderer = undefined;
    }
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
    value = this.editorType === 'checkbox' && typeof value === 'string' ? value == 'true' : value;
    set(editor, path, value);
    editor.notifyPath && editor.notifyPath(path, value);
  }

  /**
   * @param {!HTMLElement} cell
   * @param {!GridItemModel} model
   * @protected
   */
  _startCellEdit(cell, model) {
    this._renderEditor(cell, model);
    this._grid.notifyResize();
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

  /** @private */
  _stampTemplateToCell(cell, template, model) {
    cell._template = template;
    cell._content.innerHTML = '';
    template.templatizer._grid = this._grid;

    const inst = template.templatizer.createInstance();
    cell._content.appendChild(inst.root);
    cell._instance = inst;
    cell._instance.setProperties(model);
  }

  /** @private */
  _stampRendererToCell(cell, renderer, model) {
    cell._content.innerHTML = '';
    cell._renderer = renderer;
    this.__runRenderer(renderer, cell, model);
  }

  /**
   * @param {!HTMLElement} cell
   * @param {!GridItemModel} model
   * @protected
   */
  _stopCellEdit(cell, model) {
    const editor = this._getEditorComponent(cell);
    let shouldResize = true;
    if (editor) {
      editor.removeEventListener('focusout', this._grid.__boundEditorFocusOut);
      editor.removeEventListener('focusin', this._grid.__boundEditorFocusIn);
      editor.removeEventListener('internal-tab', this._grid.__boundCancelCellSwitch);
    } else {
      // avoid notify resize of editor removed due to scroll
      shouldResize = false;
    }
    document.body.removeEventListener('focusin', this._grid.__boundGlobalFocusIn);
    this._removeEditor(cell, model);
    shouldResize && this._grid.notifyResize();
  }
}

customElements.define(GridProEditColumnElement.is, GridProEditColumnElement);

export { GridProEditColumnElement };
