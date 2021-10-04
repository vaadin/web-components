/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
import { DisabledMixin } from '@vaadin/component-base/src/disabled-mixin.js';
import { DelegateStateMixin } from './delegate-state-mixin.js';
import { InputMixin } from './input-mixin.js';
import { LabelMixin } from './label-mixin.js';

const CheckedMixinImplementation = (superclass) =>
  class CheckedMixinClass extends DelegateStateMixin(DisabledMixin(LabelMixin(InputMixin(superclass)))) {
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

    /** @override */
    static get delegateProps() {
      return [...super.delegateProps, 'checked'];
    }

    constructor() {
      super();

      this._onClick = this._onClick.bind(this);
    }

    /** @protected */
    ready() {
      super.ready();

      this.addEventListener('click', this._onClick);
    }

    /**
     * @param {MouseEvent} _event
     * @return {boolean}
     * @protected
     */
    _shouldToggleChecked(_event) {
      return !this.disabled;
    }

    /**
     * @param {MouseEvent} event
     * @protected
     */
    _onClick(event) {
      if ([this._labelNode, this.inputElement].includes(event.target)) {
        event.preventDefault();
      }

      if (this._shouldToggleChecked(event)) {
        this._toggleChecked();
      }
    }

    /** @protected */
    _toggleChecked() {
      this.checked = !this.checked;

      this.dispatchEvent(new CustomEvent('change', { composed: false, bubbles: true }));
    }
  };

/**
 * A mixin to manage the checked state.
 */
export const CheckedMixin = dedupingMixin(CheckedMixinImplementation);
