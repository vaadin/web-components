/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * @polymerMixin
 */
export const GridFilterColumnMixin = (superClass) =>
  class extends superClass {
    static get properties() {
      return {
        /**
         * JS Path of the property in the item used for filtering the data.
         */
        path: {
          type: String,
          sync: true,
        },

        /**
         * Text to display as the label of the column filter text-field.
         */
        header: {
          type: String,
          sync: true,
        },
      };
    }

    static get observers() {
      return ['_onHeaderRendererOrBindingChanged(_headerRenderer, _headerCell, path, header, _filterValue)'];
    }

    constructor() {
      super();

      this.__boundOnFilterValueChanged = this.__onFilterValueChanged.bind(this);
    }

    /**
     * Renders the grid filter with the custom text field to the header cell.
     *
     * @override
     */
    _defaultHeaderRenderer(root, _column) {
      let filter = root.firstElementChild;
      let textField = filter ? filter.firstElementChild : undefined;

      if (!filter) {
        filter = document.createElement('vaadin-grid-filter');
        textField = document.createElement('vaadin-text-field');
        textField.setAttribute('theme', 'small');
        textField.setAttribute('style', 'max-width: 100%;');
        textField.setAttribute('focus-target', '');
        textField.addEventListener('value-changed', this.__boundOnFilterValueChanged);
        filter.appendChild(textField);
        root.appendChild(filter);
      }

      filter.path = this.path;
      filter.value = this._filterValue;

      textField.__rendererValue = this._filterValue;
      textField.value = this._filterValue;
      textField.label = this.__getHeader(this.header, this.path);
    }

    /**
     * The filter column doesn't allow to use a custom header renderer
     * to override the header cell content.
     * It always renders the grid filter to the header cell.
     *
     * @override
     */
    _computeHeaderRenderer() {
      return this._defaultHeaderRenderer;
    }

    /**
     * Updates the internal filter value once the filter text field is changed.
     * The listener handles only user-fired events.
     *
     * @private
     */
    __onFilterValueChanged(e) {
      // Skip if the value is changed by the renderer.
      if (e.detail.value === e.target.__rendererValue) {
        return;
      }

      this._filterValue = e.detail.value;
    }

    /** @private */
    __getHeader(header, path) {
      if (header) {
        return header;
      }

      if (path) {
        return this._generateHeader(path);
      }
    }
  };
