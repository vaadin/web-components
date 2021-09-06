/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
import { DelegateStateMixin } from './delegate-state-mixin.js';
import { DisabledMixin } from './disabled-mixin.js';
import { InputMixin } from './input-mixin.js';

const CheckedMixinImplementation = (superclass) =>
  class CheckedMixinClass extends DelegateStateMixin(DisabledMixin(InputMixin(superclass))) {
    static get properties() {
      return {
        /**
         * True if the element is checked.
         * @type {boolean}
         */
        checked: {
          type: Boolean,
          value: false,
          notify: true,
          reflectToAttribute: true
        }
      };
    }

    static get delegateAttrs() {
      return [...super.delegateAttrs, 'checked'];
    }

    get _delegateStateTarget() {
      return this.inputElement;
    }

    /** @protected */
    ready() {
      super.ready();

      this.addEventListener('click', (event) => {
        this._onClick(event);
      });
    }

    /**
     * @param {!MouseEvent} event
     * @return {boolean}
     * @protected
     */
    _interactionsAllowed(event) {
      if (this.disabled) {
        return false;
      }

      if (event.target.localName === 'a') {
        return false;
      }

      return true;
    }

    /**
     * @param {!MouseEvent} event
     * @protected
     */
    _onClick(event) {
      if (!this._interactionsAllowed(event)) {
        event.preventDefault();
        return;
      }

      this._toggleChecked();
    }

    /** @protected */
    _toggleChecked() {
      this.checked = !this.checked;
    }
  };

/**
 * A mixin to manage the checked state.
 */
export const CheckedMixin = dedupingMixin(CheckedMixinImplementation);
