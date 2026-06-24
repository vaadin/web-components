/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ContextConsumer } from '@lit/context';
import { formatLabel } from './vaadin-grid-helpers.js';
import { gridI18nContext } from './vaadin-grid-i18n-context.js';

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
         * The effective i18n object provided by the parent grid through the
         * `gridI18nContext`. The sorter uses its `sortColumn` template to format
         * the aria-label.
         *
         * @private
         */
        __gridI18n: {
          type: Object,
          sync: true,
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
      return ['_pathOrDirectionChanged(path, direction)', '__updateAriaLabel(accessibleName, __gridI18n)'];
    }

    constructor() {
      super();

      // Subscribe to the grid's i18n context. The consumer dispatches a
      // `context-request` event on connect that bubbles up to the grid's
      // provider, and keeps `__gridI18n` updated when the value changes.
      this.__i18nConsumer = new ContextConsumer(this, {
        context: gridI18nContext,
        subscribe: true,
        callback: (value) => {
          this.__gridI18n = value;
        },
      });
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
        slot.addEventListener('slotchange', () => this.__updateAriaLabel(this.accessibleName, this.__gridI18n));
      }
    }

    /**
     * Resolves the sorter's aria-label using the precedence:
     * 1. explicit `accessibleName`,
     * 2. the grid's `sortColumn` template formatted with the header text,
     * 3. none (attribute removed).
     *
     * @private
     */
    __updateAriaLabel(accessibleName, gridI18n) {
      let label;
      if (accessibleName) {
        label = accessibleName;
      } else if (gridI18n?.sortColumn) {
        label = formatLabel(gridI18n.sortColumn, this.textContent.trim());
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
