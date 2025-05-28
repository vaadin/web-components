/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A mixin providing common sorter functionality.
 *
 * @polymerMixin
 */
export const GridSorterMixin = (superClass) =>
  class GridSorterMixinClass extends superClass {
    static get properties() {
      return {
        /**
         * JS Path of the property in the item used for sorting the data.
         */
        path: String,

        /**
         * How to sort the data.
         * Possible values are `asc` to use an ascending algorithm, `desc` to sort the data in
         * descending direction, or `null` for not sorting the data.
         * @type {GridSorterDirection | undefined}
         */
        direction: {
          type: String,
          reflectToAttribute: true,
          notify: true,
          value: null,
          sync: true,
        },

        /**
         * @type {number | null}
         * @protected
         */
        _order: {
          type: Number,
          value: null,
          sync: true,
        },
      };
    }

    static get observers() {
      return ['_pathOrDirectionChanged(path, direction)'];
    }

    /** @protected */
    ready() {
      super.ready();
      this.addEventListener('click', this._onClick.bind(this));
    }

    /** @protected */
    connectedCallback() {
      super.connectedCallback();

      if (this._grid) {
        this._grid.__applySorters();
      } else {
        this.__dispatchSorterChangedEvenIfPossible();
      }
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();

      if (!this.parentNode && this._grid) {
        this._grid.__removeSorters([this]);
      } else if (this._grid) {
        this._grid.__applySorters();
      }
    }

    /** @private */
    _pathOrDirectionChanged() {
      this.__dispatchSorterChangedEvenIfPossible();
    }

    /** @private */
    __dispatchSorterChangedEvenIfPossible() {
      if (this.path === undefined || this.direction === undefined || !this.isConnected) {
        return;
      }

      this.dispatchEvent(
        new CustomEvent('sorter-changed', {
          detail: { shiftClick: Boolean(this._shiftClick), fromSorterClick: Boolean(this._fromSorterClick) },
          bubbles: true,
          composed: true,
        }),
      );
      // Cleaning up as a programatically sorting can be done after some user interaction
      this._fromSorterClick = false;
      this._shiftClick = false;
    }

    /** @private */
    _getDisplayOrder(order) {
      return order === null ? '' : order + 1;
    }

    /** @private */
    _onClick(e) {
      if (e.defaultPrevented) {
        // Something else has already handled the click event, do nothing.
        return;
      }

      const activeElement = this.getRootNode().activeElement;
      if (this !== activeElement && this.contains(activeElement)) {
        // Some focusable content inside the sorter was clicked, do nothing.
        return;
      }

      e.preventDefault();
      this._shiftClick = e.shiftKey;
      this._fromSorterClick = true;
      if (this.direction === 'asc') {
        this.direction = 'desc';
      } else if (this.direction === 'desc') {
        this.direction = null;
      } else {
        this.direction = 'asc';
      }
    }
  };
