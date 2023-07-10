/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A mixin that provides basic functionality for the
 * `<vaadin-grid-selection-column>`. This includes properties, cell rendering,
 * and overridable methods for handling changes to the selection state.
 *
 * **NOTE**: This mixin is re-used by the Flow component, and as such must not
 * implement any selection state updates for the column element or the grid.
 * Web component-specific selection state updates must be implemented in the
 * `<vaadin-grid-selection-column>` itself, by overriding the protected methods
 * provided by this mixin.
 *
 * @polymerMixin
 * @fires {CustomEvent} select-all-changed - Fired when the `selectAll` property changes.
 */
export const GridSelectionColumnBaseMixin = (superClass) =>
  class GridSelectionColumnBaseMixin extends superClass {
    static get properties() {
      return {
        /**
         * Width of the cells for this column.
         */
        width: {
          type: String,
          value: '58px',
        },

        /**
         * Flex grow ratio for the cell widths. When set to 0, cell width is fixed.
         * @attr {number} flex-grow
         * @type {number}
         */
        flexGrow: {
          type: Number,
          value: 0,
        },

        /**
         * When true, all the items are selected.
         * @attr {boolean} select-all
         * @type {boolean}
         */
        selectAll: {
          type: Boolean,
          value: false,
          notify: true,
        },

        /**
         * When true, the active gets automatically selected.
         * @attr {boolean} auto-select
         * @type {boolean}
         */
        autoSelect: {
          type: Boolean,
          value: false,
        },

        /** @protected */
        _indeterminate: Boolean,

        /** @protected */
        _selectAllHidden: Boolean,
      };
    }

    static get observers() {
      return [
        '_onHeaderRendererOrBindingChanged(_headerRenderer, _headerCell, path, header, selectAll, _indeterminate, _selectAllHidden)',
      ];
    }

    /**
     * Renders the Select All checkbox to the header cell.
     *
     * @override
     */
    _defaultHeaderRenderer(root, _column) {
      let checkbox = root.firstElementChild;
      if (!checkbox) {
        checkbox = document.createElement('vaadin-checkbox');
        checkbox.setAttribute('aria-label', 'Select All');
        checkbox.classList.add('vaadin-grid-select-all-checkbox');
        root.appendChild(checkbox);
        // Add listener after appending, so we can skip the initial change event
        checkbox.addEventListener('checked-changed', this.__onSelectAllCheckedChanged.bind(this));
      }

      const checked = this.__isChecked(this.selectAll, this._indeterminate);
      checkbox.__rendererChecked = checked;
      checkbox.checked = checked;
      checkbox.hidden = this._selectAllHidden;
      checkbox.indeterminate = this._indeterminate;
    }

    /**
     * Renders the Select Row checkbox to the body cell.
     *
     * @override
     */
    _defaultRenderer(root, _column, { item, selected }) {
      let checkbox = root.firstElementChild;
      if (!checkbox) {
        checkbox = document.createElement('vaadin-checkbox');
        checkbox.setAttribute('aria-label', 'Select Row');
        root.appendChild(checkbox);
        // Add listener after appending, so we can skip the initial change event
        checkbox.addEventListener('checked-changed', this.__onSelectRowCheckedChanged.bind(this));
      }

      checkbox.__item = item;
      checkbox.__rendererChecked = selected;
      checkbox.checked = selected;
    }

    /**
     * Updates the select all state when the Select All checkbox is switched.
     * The listener handles only user-fired events.
     *
     * @private
     */
    __onSelectAllCheckedChanged(e) {
      // Skip if the state is changed by the renderer.
      if (e.target.checked === e.target.__rendererChecked) {
        return;
      }

      if (this._indeterminate || e.target.checked) {
        this._selectAll();
      } else {
        this._deselectAll();
      }
    }

    /**
     * Selects or deselects the row when the Select Row checkbox is switched.
     * The listener handles only user-fired events.
     *
     * @private
     */
    __onSelectRowCheckedChanged(e) {
      // Skip if the state is changed by the renderer.
      if (e.target.checked === e.target.__rendererChecked) {
        return;
      }

      if (e.target.checked) {
        this._selectItem(e.target.__item);
      } else {
        this._deselectItem(e.target.__item);
      }
    }

    /**
     * Override to handle the user selecting all items.
     * @protected
     */
    _selectAll() {}

    /**
     * Override to handle the user deselecting all items.
     * @protected
     */
    _deselectAll() {}

    /**
     * Override to handle the user selecting an item.
     * @param {Object} item the item to select
     * @protected
     */
    _selectItem(item) {}

    /**
     * Override to handle the user deselecting an item.
     * @param {Object} item the item to deselect
     * @protected
     */
    _deselectItem(item) {}

    /**
     * IOS needs indeterminate + checked at the same time
     * @private
     */
    __isChecked(selectAll, indeterminate) {
      return indeterminate || selectAll;
    }
  };
