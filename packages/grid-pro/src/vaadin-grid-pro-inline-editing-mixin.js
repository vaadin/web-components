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
import { animationFrame } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { get, set } from '@vaadin/component-base/src/path-utils.js';
import { iterateRowCells, updatePart } from '@vaadin/grid/src/vaadin-grid-helpers.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-grid-pro',
  css`
    :host([loading-editor]) [part~='focused-cell'] ::slotted(vaadin-grid-cell-content) {
      opacity: 0;
      pointer-events: none;
    }
  `,
  {
    moduleId: 'vaadin-grid-pro-styles',
  },
);

/**
 * @polymerMixin
 */
export const InlineEditingMixin = (superClass) =>
  class InlineEditingMixin extends superClass {
    static get properties() {
      return {
        /**
         * When true, pressing Enter while in cell edit mode
         * will move focus to the editable cell in the next row
         * (Shift + Enter - same, but for previous row).
         * @attr {boolean} enter-next-row
         */
        enterNextRow: {
          type: Boolean,
          notify: true, // FIXME(yuriy-fix): needed by Flow counterpart
        },

        /**
         * When true, after moving to next or previous editable cell using
         * Tab / Shift+Tab, it will be focused without edit mode.
         *
         * When `enterNextRow` is true, pressing Enter will also
         * preserve edit mode, otherwise, it will have no effect.
         * @attr {boolean} single-cell-edit
         */
        singleCellEdit: {
          type: Boolean,
          notify: true, // FIXME(yuriy-fix): needed by Flow counterpart
        },

        /**
         * When true, the grid enters cell edit mode on a single click
         * instead of the default double click.
         * @attr {boolean} edit-on-click
         */
        editOnClick: {
          type: Boolean,
        },

        /** @private */
        _editingDisabled: {
          type: Boolean,
        },
      };
    }

    constructor() {
      super();
      this.__boundItemPropertyChanged = this._onItemPropertyChanged.bind(this);
      this.__boundEditorFocusOut = this._onEditorFocusOut.bind(this);
      this.__boundEditorFocusIn = this._onEditorFocusIn.bind(this);

      this._addEditColumnListener('mousedown', (e) => {
        // Prevent grid from resetting navigating state
        e.stopImmediatePropagation();
        this.toggleAttribute('navigating', true);
      });

      this._addEditColumnListener('focusout', (e) => {
        // Prevent grid from resetting navigating state
        e.stopImmediatePropagation();
      });
    }

    /** @protected */
    ready() {
      this.addEventListener(
        'keydown',
        (e) => {
          if (this.hasAttribute('loading-editor') && !['Tab', 'Escape', 'Enter'].includes(e.key)) {
            // If an editor is focused while it's loading, prevent default keydown behavior
            // to avoid user interaction with the editor before it's fully loaded
            // Used by Flow GridPro
            e.preventDefault();
            e.stopPropagation();
          }
        },
        true,
      );
      // Add listener before `vaadin-grid` interaction mode listener
      this.addEventListener('keydown', (e) => {
        switch (e.keyCode) {
          case 27:
            if (this.__edited) {
              this._stopEdit(true);
            }
            break;
          case 9:
            if (this.__edited) {
              this._switchEditCell(e);
            }
            break;
          case 13:
            if (this.__edited) {
              this._switchEditCell(e);
            } else {
              this._enterEditFromEvent(e);
            }
            break;
          case 32:
            if (!this.__edited) {
              this._enterEditFromEvent(e);
            }
            break;
          default:
            if (e.key && e.key.length === 1) {
              this._enterEditFromEvent(e, 'text');
            }
            break;
        }
      });

      super.ready();

      this.$.table.addEventListener('click', (e) => {
        const column = this.getEventContext(e).column;
        if (column && this._isEditColumn(column)) {
          if (this.editOnClick) {
            this._enterEditFromEvent(e);
          }
        }
      });

      // Dblclick does not work on iOS Safari
      if (this._ios) {
        let firstClickTime;
        let waitingSecondClick = false;

        this.addEventListener('click', (e) => {
          if (!waitingSecondClick) {
            firstClickTime = new Date().getTime();
            waitingSecondClick = true;

            setTimeout(() => {
              waitingSecondClick = false;
            }, 300);
          } else {
            waitingSecondClick = false;

            const time = new Date().getTime();
            if (time - firstClickTime < 300) {
              this._enterEditFromEvent(e);
            }
          }
        });
      } else {
        this.addEventListener('dblclick', (e) => {
          if (!this.editOnClick) {
            this._enterEditFromEvent(e);
          }
        });
      }
    }

    /**
     * Prevents making an edit column cell's parent row active on click.
     *
     * @override
     * @protected
     */
    _shouldPreventCellActivationOnClick(e) {
      return (
        super._shouldPreventCellActivationOnClick(e) ||
        // The clicked cell is editable
        this._isEditColumn(this.getEventContext(e).column)
      );
    }

    /**
     * Override an observer from `DisabledMixin` to stop
     * editing when grid element becomes disabled.
     *
     * @param {boolean} disabled
     * @param {boolean} oldDisabled
     * @protected
     * @override
     */
    _disabledChanged(disabled, oldDisabled) {
      super._disabledChanged(disabled, oldDisabled);

      if (disabled && this.__edited) {
        this._stopEdit(true);
      }
    }

    /** @protected */
    _checkImports() {
      super._checkImports();
      ['vaadin-grid-pro-edit-column'].forEach((elementName) => {
        const element = this.querySelector(elementName);
        if (element && !customElements.get(elementName)) {
          console.warn(`Make sure you have imported the required module for <${elementName}> element.`);
        }
      });
    }

    /** @private */
    _applyEdit({ path, value, item }) {
      set(path, value, item);
      this.requestContentUpdate();
    }

    /** @private */
    _addEditColumnListener(type, callback) {
      this.addEventListener(type, (e) => {
        const context = this.getEventContext(e);
        const column = context.column;
        const edited = this.__edited;

        if (context.item && this._isEditColumn(column)) {
          const { cell } = this._getGridEventLocation(e);

          if (!cell || cell.getAttribute('part').indexOf('details-cell') > -1) {
            return;
          }

          if (edited && edited.cell === cell) {
            return;
          }

          if (!this._isCellEditable(cell)) {
            return;
          }

          callback(e);
        }
      });
    }

    /** @private */
    _onItemPropertyChanged(e) {
      if (!e.defaultPrevented) {
        this._applyEdit(e.detail);
      }
    }

    /** @private */
    _getRowByIndex(index) {
      return Array.from(this.$.items.children).find((el) => el.index === index);
    }

    /** @private */
    _isEditColumn(column) {
      return column && column.localName.toLowerCase() === 'vaadin-grid-pro-edit-column';
    }

    /** @private */
    _getEditColumns() {
      const columnTreeLevel = this._columnTree.length - 1;
      return this._columnTree[columnTreeLevel]
        .filter((column) => this._isEditColumn(column) && !column.hidden)
        .sort((a, b) => a._order - b._order);
    }

    /** @private */
    _cancelStopEdit() {
      // Stop edit on outside click will always trigger notify resize.
      // when tabbing within same row it might not be needed, so cancel
      if (this._debouncerStopEdit) {
        this._debouncerStopEdit.cancel();
        delete this._debouncerStopEdit;
      }
    }

    /** @private */
    _flushStopEdit() {
      if (this._debouncerStopEdit) {
        this._debouncerStopEdit.flush();
        delete this._debouncerStopEdit;
      }
    }

    /** @private */
    _enterEditFromEvent(e, type) {
      const context = this.getEventContext(e);
      const column = context.column;
      const edited = this.__edited;

      if (context.item && this._isEditColumn(column)) {
        const { cell } = this._getGridEventLocation(e);

        if (!cell || cell.getAttribute('part').indexOf('details-cell') > -1) {
          return;
        }

        if (type && column.editorType !== type) {
          return;
        }

        if (edited && edited.cell === cell && column._getEditorComponent(cell).contains(e.target)) {
          return;
        }

        this._flushStopEdit();

        this._startEdit(cell, column);
      } else if (edited) {
        this._stopEdit();
      }
    }

    /** @private */
    _onEditorFocusOut(event) {
      if (this.__shouldIgnoreFocusOut(event)) {
        return;
      }

      // Schedule stop on editor component focusout
      this._debouncerStopEdit = Debouncer.debounce(this._debouncerStopEdit, animationFrame, this._stopEdit.bind(this));
    }

    /** @private */
    __shouldIgnoreFocusOut(event) {
      const edited = this.__edited;
      if (edited) {
        const { cell, column } = this.__edited;
        const editor = column._getEditorComponent(cell);

        const path = event.composedPath();
        const nodes = path.slice(0, path.indexOf(editor) + 1).filter((node) => node.nodeType === Node.ELEMENT_NODE);
        // Detect focus moving to e.g. vaadin-select-overlay or vaadin-date-picker-overlay
        if (nodes.some((el) => typeof el._shouldRemoveFocus === 'function' && !el._shouldRemoveFocus(event))) {
          return true;
        }
      }
    }

    /** @private */
    _onEditorFocusIn() {
      this._cancelStopEdit();
    }

    /** @private */
    _startEdit(cell, column) {
      const isCellEditable = this._isCellEditable(cell);

      // TODO: remove `_editingDisabled` after Flow counterpart is updated.
      if (this.disabled || this._editingDisabled || !isCellEditable) {
        return;
      }
      // Cancel debouncer enqueued on focusout
      this._cancelStopEdit();

      this._scrollHorizontallyToCell(cell);

      const model = this.__getRowModel(cell.parentElement);
      this.__edited = { cell, column, model };
      column._startCellEdit(cell, model);

      this.dispatchEvent(
        new CustomEvent('cell-edit-started', {
          detail: {
            index: model.index,
            item: model.item,
            path: column.path,
          },
          composed: true,
        }),
      );
      this.addEventListener('item-property-changed', this.__boundItemPropertyChanged);
    }

    /**
     * @param {boolean=} shouldCancel
     * @param {boolean=} shouldRestoreFocus
     * @protected
     */
    _stopEdit(shouldCancel, shouldRestoreFocus) {
      if (!this.__edited) {
        return;
      }
      const { cell, column, model } = this.__edited;

      if (!shouldCancel && !this.hasAttribute('loading-editor')) {
        const editor = column._getEditorComponent(cell);
        if (editor) {
          const value = column._getEditorValue(editor);
          if (value !== get(column.path, model.item)) {
            // In some cases, where the value comes from the editor's change
            // event (eg. custom editor in vaadin-grid-pro-flow), the event is
            // not dispatched in FF/Safari/Edge. That's due the change event
            // doesn't occur when the editor is removed from the DOM. Manually
            // calling blur makes the event to be dispatched.
            editor.blur();

            this.dispatchEvent(
              new CustomEvent('item-property-changed', {
                detail: {
                  index: model.index,
                  item: model.item,
                  path: column.path,
                  value,
                },
                bubbles: true,
                cancelable: true,
                composed: true,
              }),
            );
          }
        }
      }

      column._stopCellEdit(cell, model);

      this.__edited = null;

      this.removeEventListener('item-property-changed', this.__boundItemPropertyChanged);

      if (shouldRestoreFocus) {
        cell.focus();
      }
    }

    /**
     * @param {!KeyboardEvent} e
     * @protected
     */
    async _switchEditCell(e) {
      if (e.defaultPrevented && e.keyCode === 9) {
        return;
      }

      this._cancelStopEdit();

      const editableColumns = this._getEditColumns();
      const { cell, column, model } = this.__edited;

      // Prevent vaadin-grid handler from being called
      e.stopImmediatePropagation();

      const editor = column._getEditorComponent(cell);

      // Do not prevent Tab to allow native input blur and wait for it,
      // unless the keydown event is from the edit cell select overlay.
      if (e.key === 'Tab' && editor && editor.contains(e.target)) {
        const ignore = await new Promise((resolve) => {
          editor.addEventListener(
            'focusout',
            (event) => {
              resolve(this.__shouldIgnoreFocusOut(event));
            },
            { once: true },
          );
        });

        // Ignore focusout event after which focus stays in the field,
        // e.g. Tab between date and time pickers in date-time-picker.
        if (ignore) {
          return;
        }
      } else {
        e.preventDefault();
      }

      this._stopEdit();

      // Try to find the next editable cell
      let nextIndex = model.index;
      let nextColumn = column;
      let nextCell = cell;
      let directionX = 0;
      let directionY = 0;

      // Enter key: move up / down
      if (e.keyCode === 13 && this.enterNextRow) {
        directionY = e.shiftKey ? -1 : 1;
      }

      // Tab: move right / left
      if (e.keyCode === 9) {
        directionX = e.shiftKey ? -1 : 1;
      }

      if (directionX || directionY) {
        while (nextCell) {
          if (directionX) {
            // Move horizontally
            nextColumn = editableColumns[editableColumns.indexOf(nextColumn) + directionX];
            if (!nextColumn) {
              // Wrap to the next or previous row
              nextIndex += directionX;
              nextColumn = editableColumns[directionX > 0 ? 0 : editableColumns.length - 1];
            }
          }
          // Move vertically
          if (directionY) {
            nextIndex += directionY;
          }
          // Stop looking if the next cell is editable
          const nextRow = this._getRowByIndex(nextIndex);
          // eslint-disable-next-line @typescript-eslint/no-loop-func
          nextCell = nextRow && Array.from(nextRow.children).find((cell) => cell._column === nextColumn);
          if (nextCell && this._isCellEditable(nextCell)) {
            break;
          }
        }
      }

      // Focus current cell as fallback
      if (!nextCell) {
        nextCell = cell;
        nextIndex = model.index;
      }

      if (!this.singleCellEdit && nextCell !== cell) {
        this._startEdit(nextCell, nextColumn);
      } else {
        this.__ensureFlatIndexInViewport(nextIndex);
        nextCell.focus();
      }
    }

    /**
     * @param {!HTMLElement} row
     * @param {GridItem} item
     * @protected
     */
    _updateItem(row, item) {
      if (this.__edited) {
        const { cell, model } = this.__edited;
        if (cell.parentNode === row && model.item !== item) {
          this._stopEdit();
        }
      }
      super._updateItem(row, item);
    }

    /**
     * Override method from `StylingMixin` to apply `editable-cell` part to the
     * cells of edit columns.
     *
     * @override
     */
    _generateCellPartNames(row, model) {
      super._generateCellPartNames(row, model);

      iterateRowCells(row, (cell) => {
        const isEditable = !row.hasAttribute('loading') && this._isCellEditable(cell);
        const target = cell._focusButton || cell;
        updatePart(target, isEditable, 'editable-cell');
      });
    }

    /** @private */
    _isCellEditable(cell) {
      const column = cell._column;
      // Not editable if the column is not an edit column
      if (!this._isEditColumn(column)) {
        return false;
      }
      // Cell is editable by default if isCellEditable is not configured
      if (!column.isCellEditable) {
        return true;
      }
      // Otherwise, check isCellEditable function
      const model = this.__getRowModel(cell.parentElement);
      const isEditable = column.isCellEditable(model);

      // Cancel editing if the cell is currently edited one and becomes no longer editable
      // TODO: should be moved to `_updateItem` when Grid connector is updated to use it.
      if (this.__edited && this.__edited.cell === cell && !isEditable) {
        this._stopEdit(true, true);
      }

      return isEditable;
    }

    /**
     * Fired before exiting the cell edit mode, if the value has been changed.
     * If the default is prevented, value change would not be applied.
     *
     * @event item-property-changed
     * @param {Object} detail
     * @param {Object} detail.index the row index of the edited cell
     * @param {Object} detail.item the grid item rendered to the row of the edited cell
     * @param {Object} detail.path the column path of the edited cell
     * @param {Object} detail.value the new value of the edited cell
     */

    /**
     * Fired when the user starts editing a grid cell.
     *
     * @event cell-edit-started
     * @param {Object} detail
     * @param {Object} detail.index the row index of the edited cell
     * @param {Object} detail.item the grid item rendered to the row of the edited cell
     * @param {Object} detail.path the column path of the edited cell
     */
  };
