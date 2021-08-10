/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';

const ValueMixinImplementation = (superclass) =>
  class ValueMixinClass extends superclass {
    static get properties() {
      return {
        /**
         * The value of the field.
         */
        value: {
          type: String,
          value: '',
          observer: '_valueChanged',
          notify: true
        }
      };
    }

    /**
     * Toggle the has-value attribute based on the value property.
     * @param {boolean} hasValue
     * @protected
     */
    _toggleHasValue(hasValue) {
      this.toggleAttribute('has-value', hasValue);
    }

    /**
     * Observer called when a value property changes.
     * @param {unknown} newVal
     * @param {unknown} _oldVal
     * @protected
     */
    _valueChanged(newVal, _oldVal) {
      this._toggleHasValue(newVal !== '' && newVal != null);
    }
  };

/**
 * A mixin to provide `value` property and `has-value` attribute.
 */
export const ValueMixin = dedupingMixin(ValueMixinImplementation);
