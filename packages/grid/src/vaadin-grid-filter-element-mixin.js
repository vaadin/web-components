/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { timeOut } from '@vaadin/component-base/src/async.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin';

registerStyles(
  'vaadin-grid-filter',
  css`
    :host {
      display: inline-flex;
      max-width: 100%;
    }

    ::slotted(*) {
      width: 100%;
      box-sizing: border-box;
    }
  `,
  { moduleId: 'vaadin-grid-filter-styles' },
);

/**
 * @polymerMixin
 *
 * @mixes ControllerMixin
 */
export const GridFilterElementMixin = (superClass) =>
  class extends ControllerMixin(superClass) {
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
         * Current filter value.
         */
        value: {
          type: String,
          notify: true,
          sync: true,
        },

        /** @private */
        _textField: {
          type: Object,
          sync: true,
        },
      };
    }

    static get observers() {
      return ['_filterChanged(path, value, _textField)'];
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
        this.dispatchEvent(new CustomEvent('filter-changed', { bubbles: true }));
      });
    }

    focus() {
      if (this._textField) {
        this._textField.focus();
      }
    }
  };
