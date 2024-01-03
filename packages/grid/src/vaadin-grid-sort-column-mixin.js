/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * @polymerMixin
 */
export const GridSortColumnMixin = (superClass) =>
  class extends superClass {
    static get properties() {
      return {
        /**
         * JS Path of the property in the item used for sorting the data.
         */
        path: {
          type: String,
          sync: true,
        },

        /**
         * How to sort the data.
         * Possible values are `asc` to use an ascending algorithm, `desc` to sort the data in
         * descending direction, or `null` for not sorting the data.
         * @type {GridSorterDirection | undefined}
         */
        direction: {
          type: String,
          notify: true,
          sync: true,
        },
      };
    }

    static get observers() {
      return ['_onHeaderRendererOrBindingChanged(_headerRenderer, _headerCell, path, header, direction)'];
    }

    constructor() {
      super();

      this.__boundOnDirectionChanged = this.__onDirectionChanged.bind(this);
    }

    /**
     * Renders the grid sorter to the header cell.
     *
     * @override
     */
    _defaultHeaderRenderer(root, _column) {
      let sorter = root.firstElementChild;
      if (!sorter) {
        sorter = document.createElement('vaadin-grid-sorter');
        sorter.addEventListener('direction-changed', this.__boundOnDirectionChanged);
        root.appendChild(sorter);
      }

      sorter.path = this.path;
      sorter.__rendererDirection = this.direction;
      sorter.direction = this.direction;
      sorter.textContent = this.__getHeader(this.header, this.path);
    }

    /**
     * The sort column doesn't allow to use a custom header renderer
     * to override the header cell content.
     * It always renders the grid sorter to the header cell.
     *
     * @override
     */
    _computeHeaderRenderer() {
      return this._defaultHeaderRenderer;
    }

    /**
     * Updates the sorting direction once the grid sorter's direction is changed.
     * The listener handles only user-fired events.
     *
     * @private
     */
    __onDirectionChanged(e) {
      // Skip if the direction is changed by the renderer.
      if (e.detail.value === e.target.__rendererDirection) {
        return;
      }

      this.direction = e.detail.value;
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
