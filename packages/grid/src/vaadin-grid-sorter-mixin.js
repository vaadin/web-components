/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

import { formatLabel } from './vaadin-grid-helpers.js';

/**
 * A mixin providing common sorter functionality.
 */
export const GridSorterMixin = (superClass) =>
  class GridSorterMixinClass extends superClass {
    static get properties() {
      return {
        /**
         * Accessible name (aria-label) for the sorter. When set, it overrides the
         * label derived from the grid's `i18n.sortColumn` template. Used to label
         * a standalone sorter that has no parent grid.
         *
         * @attr {string} accessible-name
         */
        accessibleName: {
          type: String,
        },

        /**
         * The `i18n.sortColumn` template distributed by the parent grid, e.g.
         * `'Sort by {0}'`. Combined with the sorter's text content to form the
         * aria-label.
         *
         * @private
         */
        __sortColumnLabel: {
          type: String,
        },

        /**
         * JS Path of the property in the item used for sorting the data.
         */
        path: {
          type: String,
        },

        /**
         * How to sort the data.
         * Possible values are `asc` to use an ascending algorithm, `desc` to sort the data in
         * descending direction, or `null` for not sorting the data.
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
      return ['_pathOrDirectionChanged(path, direction)', '__updateAriaLabel(accessibleName, __sortColumnLabel)'];
    }

    /** @protected */
    ready() {
      super.ready();
      this.addEventListener('click', this._onClick.bind(this));

      // The sorter's text content (the column header) is slotted and set
      // imperatively by the grid / connector, sometimes after the sorter is
      // created. Re-format the aria-label whenever the slotted content changes.
      const slot = this.shadowRoot.querySelector('slot');
      if (slot) {
        slot.addEventListener('slotchange', () => this.__updateAriaLabel(this.accessibleName, this.__sortColumnLabel));
      }
    }

    /**
     * Resolves the sorter's aria-label using the precedence:
     * 1. explicit `accessibleName`,
     * 2. the grid-distributed `sortColumn` template formatted with the header text,
     * 3. none (attribute removed).
     *
     * @private
     */
    __updateAriaLabel(accessibleName, sortColumnLabel) {
      let label;
      if (accessibleName) {
        label = accessibleName;
      } else if (sortColumnLabel) {
        label = formatLabel(sortColumnLabel, this.textContent.trim());
      }

      if (label) {
        this.setAttribute('aria-label', label);
      } else {
        this.removeAttribute('aria-label');
      }
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
