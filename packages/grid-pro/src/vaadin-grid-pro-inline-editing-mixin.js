/**
 * @license
 * Copyright (c) 2018 - 2022 Vaadin Ltd.
 * This program is available under Commercial Vaadin Developer License 4.0, available at https://vaadin.com/license/cvdl-4.0.
 */
import { animationFrame } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';

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
      this.__boundCancelCellSwitch = this._setCancelCellSwitch.bind(this);
      this.__boundGlobalFocusIn = this._onGlobalFocusIn.bind(this);

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
          if (e.target.matches(':not([type=checkbox])')) {
            // Prevents the `click` event from a column's cell in order to prevent making the cell's parent row active.
            // Note, it should not prevent the `click` event from checkboxes. Otherwise, they will not respond to user interactions.
            // Read more: https://github.com/vaadin/web-components/pull/2539#discussion_r712076433.
            // TODO: Using `preventDefault()` for any other purpose than preventing the default browser's behavior is bad practice
            // and therefore it would be great to refactor this part someday.
            e.preventDefault();
          }

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
    _applyEdit({ path, value, index, item }) {
      this.set(path, value, item);
      this.notifyPath(`items.${index}.${path}`, value);
    }

    /** @private */
    _addEditColumnListener(type, callback) {
      this.addEventListener(type, (e) => {
        const context = this.getEventContext(e);
        const column = context.column;
        const edited = this.__edited;

        if (context.item && this._isEditColumn(column)) {
          const path = e.composedPath();
          const cell = path[path.indexOf(this.$.table) - 3];

          if (!cell || cell.getAttribute('part').indexOf('details-cell') > -1) {
            return;
          }

          if (edited && edited.cell === cell) {
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
      return Array.from(this.$.items.children).filter((el) => el.index === index)[0];
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
        const path = e.composedPath();
        const cell = path[path.indexOf(this.$.table) - 3];

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
    _onEditorFocusOut() {
      // Schedule stop on editor component focusout
      this._debouncerStopEdit = Debouncer.debounce(this._debouncerStopEdit, animationFrame, this._stopEdit.bind(this));
    }

    /** @private */
    _onEditorFocusIn() {
      this._cancelStopEdit();
    }

    /** @private */
    _onGlobalFocusIn(e) {
      const edited = this.__edited;
      if (edited) {
        // Detect focus moving to e.g. vaadin-select-overlay
        const overlay = Array.from(e.composedPath()).filter(
          (node) => node.nodeType === Node.ELEMENT_NODE && /^vaadin-(?!dialog).*-overlay$/i.test(node.localName),
        )[0];

        if (overlay) {
          overlay.addEventListener('vaadin-overlay-outside-click', this.__boundEditorFocusOut);
          this._cancelStopEdit();
        }
      }
    }

    /** @private */
    _startEdit(cell, column) {
      // TODO: remove `_editingDisabled` after Flow counterpart is updated.
      if (this.disabled || this._editingDisabled) {
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

      if (!shouldCancel) {
        const editor = column._getEditorComponent(cell);
        if (editor) {
          const value = column._getEditorValue(editor);
          if (value !== this.get(column.path, model.item)) {
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

    /** @private */
    _setCancelCellSwitch() {
      this.__cancelCellSwitch = true;
      window.requestAnimationFrame(() => {
        this.__cancelCellSwitch = false;
      });
    }

    /**
     * @param {!KeyboardEvent} e
     * @protected
     */
    _switchEditCell(e) {
      if (this.__cancelCellSwitch || (e.defaultPrevented && e.keyCode === 9)) {
        return;
      }

      this._cancelStopEdit();

      const cols = this._getEditColumns();

      const { cell, column, model } = this.__edited;
      const colIndex = cols.indexOf(column);
      const { index } = model;

      let nextCol = null;
      let nextIdx = index;

      // Enter key
      if (e.keyCode === 13) {
        nextCol = column;

        // Move up / down
        if (this.enterNextRow) {
          nextIdx = e.shiftKey ? index - 1 : index + 1;
        }
      }

      // Tab: move right / left
      if (e.keyCode === 9) {
        if (e.shiftKey) {
          if (cols[colIndex - 1]) {
            nextCol = cols[colIndex - 1];
          } else if (index > 0) {
            nextIdx = index - 1;
            nextCol = cols[cols.length - 1];
          }
        } else if (cols[colIndex + 1]) {
          nextCol = cols[colIndex + 1];
        } else {
          nextIdx = index + 1;
          nextCol = cols[0];
        }
      }

      const nextRow = nextIdx === index ? cell.parentNode : this._getRowByIndex(nextIdx) || null;

      this._stopEdit();

      if (nextRow && nextCol) {
        const nextCell = Array.from(nextRow.children).filter((cell) => cell._column === nextCol)[0];
        e.preventDefault();

        // Prevent vaadin-grid handler from being called
        e.stopImmediatePropagation();

        if (!this.singleCellEdit && nextCell !== cell) {
          this._startEdit(nextCell, nextCol);
        } else {
          this._ensureScrolledToIndex(nextIdx);
          nextCell.focus();
        }
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
