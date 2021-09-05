/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
import { DelegateFocusMixin } from './delegate-focus-mixin.js';
import { InputMixin } from './input-mixin.js';
import { SlotMixin } from './slot-mixin.js';

const InputSlotMixinImplementation = (superclass) =>
  class InputSlotMixinClass extends DelegateFocusMixin(InputMixin(SlotMixin(superclass))) {
    static get properties() {
      /**
       * String used to define input type.
       */
      return {
        type: {
          type: String,
          readOnly: true
        }
      };
    }

    get slots() {
      return {
        ...super.slots,
        input: () => {
          const native = document.createElement('input');
          const value = this.getAttribute('value');
          if (value) {
            native.setAttribute('value', value);
          }
          const name = this.getAttribute('name');
          if (name) {
            native.setAttribute('name', name);
          }
          if (this.type) {
            native.setAttribute('type', this.type);
          }
          return native;
        }
      };
    }

    constructor() {
      super();

      // Ensure every instance has unique ID
      const uniqueId = (InputSlotMixinClass._uniqueId = 1 + InputSlotMixinClass._uniqueId || 0);
      this._inputId = `${this.localName}-${uniqueId}`;
    }

    /** @protected */
    ready() {
      super.ready();

      const inputNode = this._getDirectSlotChild('input');
      if (inputNode) {
        inputNode.id = this._inputId;

        this._setInputElement(inputNode);
        this._setFocusElement(inputNode);
      }
    }
  };

/**
 * A mixin to add `<input>` element to the corresponding named slot.
 */
export const InputSlotMixin = dedupingMixin(InputSlotMixinImplementation);
