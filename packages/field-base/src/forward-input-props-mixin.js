/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
import { InputConstraintsMixin } from './input-constraints-mixin.js';

const ForwardInputPropsMixinImplementation = (superclass) =>
  class ForwardInputPropsMixinClass extends InputConstraintsMixin(superclass) {
    static get properties() {
      return {
        /**
         * The name of this field.
         */
        name: {
          type: String
        },

        /**
         * A hint to the user of what can be entered in the field.
         */
        placeholder: {
          type: String
        },

        /**
         * When present, it specifies that the field is read-only.
         */
        readonly: {
          type: Boolean,
          value: false,
          reflectToAttribute: true
        },

        /**
         * The text usually displayed in a tooltip popup when the mouse is over the field.
         */
        title: {
          type: String
        }
      };
    }

    static get forwardProps() {
      return ['name', 'type', 'placeholder', 'readonly', 'required', 'invalid', 'title'];
    }

    /** @protected */
    ready() {
      // Create observer dynamically to allow subclasses to override forwardProps
      // Note, this needs to be done before calling `super.ready()` to propagate changes
      // to the validation constraints, e.g. when setting `required` property to `false`,
      // before the observer created by `InputConstraintsMixin` to validate properly.
      this._createMethodObserver(`_forwardPropsChanged(${this.constructor.forwardProps.join(', ')})`);

      super.ready();
    }

    /** @protected */
    _inputElementChanged(input) {
      super._inputElementChanged(input);

      if (input) {
        // Propagate initially defined properties to the slotted input
        this._propagateHostAttributes(
          this.constructor.forwardProps.map((attr) => this[attr] || this.getAttribute(attr))
        );
      }
    }

    /** @private */
    _forwardPropsChanged(...attributesValues) {
      this._propagateHostAttributes(attributesValues);
    }

    /** @private */
    _propagateHostAttributes(attributesValues) {
      const input = this.inputElement;
      const attributeNames = this.constructor.forwardProps;

      attributeNames.forEach((attr, index) => {
        const value = attributesValues[index];
        if (attr === 'invalid') {
          this._setOrToggleAttribute(attr, value, input);
          this._setOrToggleAttribute('aria-invalid', value ? 'true' : false, input);
        } else {
          this._setOrToggleAttribute(attr, value, input);
        }
      });
    }

    /** @protected */
    _setOrToggleAttribute(name, value, node) {
      if (!name || !node) {
        return;
      }

      if (value) {
        node.setAttribute(name, typeof value === 'boolean' ? '' : value);
      } else {
        node.removeAttribute(name);
      }
    }
  };

/**
 * A mixin to forward properties to the input element.
 */
export const ForwardInputPropsMixin = dedupingMixin(ForwardInputPropsMixinImplementation);
