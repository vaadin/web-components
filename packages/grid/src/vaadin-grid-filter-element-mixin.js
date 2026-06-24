/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ContextConsumer } from '@lit/context';
import { timeOut } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';
import { formatLabel } from './vaadin-grid-helpers.js';
import { gridI18nContext } from './vaadin-grid-i18n-context.js';

export const GridFilterElementMixin = (superClass) =>
  class extends superClass {
    static get properties() {
      return {
        /**
         * Accessible name (aria-label) for the filter. When set, it is forwarded
         * to the slotted text field's `accessibleName` (the focusable input),
         * overriding the label derived from the grid's `i18n.filterColumn`.
         *
         * @attr {string} accessible-name
         */
        accessibleName: {
          type: String,
        },

        /**
         * JS Path of the property in the item used for filtering the data.
         */
        path: {
          type: String,
          sync: true,
        },

        /**
         * Current filter value.
         */
        value: {
          type: String,
          notify: true,
          sync: true,
        },

        /**
         * The effective i18n object provided by the parent grid through the
         * `gridI18nContext`. The filter uses its `filterColumn` template to
         * format the accessible name.
         *
         * @private
         */
        __gridI18n: {
          type: Object,
          sync: true,
        },

        /**
         * The column header text used as the `{0}` parameter of
         * `filterColumn`. Provided by the consumer that creates the filter (the
         * declarative filter column or CRUD), since a filter field may have no
         * visible label.
         *
         * @private
         */
        __headerText: {
          type: String,
        },

        /** @private */
        _textField: {
          type: Object,
          sync: true,
        },
      };
    }

    static get observers() {
      return [
        '_filterChanged(path, value, _textField)',
        '__updateAriaLabel(accessibleName, __gridI18n, __headerText, _textField)',
      ];
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

    /**
     * Forwards the resolved accessible name to the slotted text field (the
     * focusable input), using the precedence:
     * 1. explicit `accessibleName`,
     * 2. `filterColumn` formatted with the header text.
     *
     * The accessible name is applied whether or not the field has a visible
     * `label`: an `aria-label` takes precedence over the `<label>` for the
     * accessible name, and since the template embeds the header text the visible
     * label stays contained in the accessible name (WCAG 2.5.3).
     *
     * @private
     */
    __updateAriaLabel(accessibleName, gridI18n, headerText, textField) {
      if (!textField) {
        return;
      }

      let label;
      if (accessibleName) {
        label = accessibleName;
      } else if (gridI18n?.filterColumn && headerText) {
        label = formatLabel(gridI18n.filterColumn, headerText);
      }

      textField.accessibleName = label || null;
    }

    /** @protected */
    ready() {
      super.ready();

      this._filterController = new SlotController(this, '', 'vaadin-text-field', {
        initializer: (field) => {
          field.addEventListener('input', (e) => {
            this.value = e.target.value;
          });

          this._textField = field;
        },
      });
      this.addController(this._filterController);
    }

    /** @private */
    _filterChanged(path, value, textField) {
      if (path === undefined || value === undefined || !textField) {
        return;
      }

      textField.value = value;

      this._debouncerFilterChanged = Debouncer.debounce(this._debouncerFilterChanged, timeOut.after(200), () => {
        /** @internal to not document it in CEM */
        this.dispatchEvent(new CustomEvent('filter-changed', { bubbles: true }));
      });
    }

    focus() {
      if (this._textField) {
        this._textField.focus();
      }
    }
  };
