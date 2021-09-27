/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
import { SlotMixin } from '@vaadin/component-base/src/slot-mixin.js';
import { DelegateFocusMixin } from './delegate-focus-mixin.js';
import { InputMixin } from './input-mixin.js';
import { LabelMixin } from './label-mixin.js';

const TextAreaSlotMixinImplementation = (superclass) =>
  class TextAreaSlotMixinClass extends DelegateFocusMixin(LabelMixin(InputMixin(SlotMixin(superclass)))) {
    get slots() {
      return {
        ...super.slots,
        textarea: () => {
          const native = document.createElement('textarea');
          const value = this.getAttribute('value');
          if (value) {
            native.value = value;
          }
          const name = this.getAttribute('name');
          if (name) {
            native.setAttribute('name', name);
          }
          return native;
        }
      };
    }

    constructor() {
      super();

      // Ensure every instance has unique ID
      const uniqueId = (TextAreaSlotMixinClass._uniqueTextAreaId = 1 + TextAreaSlotMixinClass._uniqueTextAreaId || 0);
      this._textareaId = `${this.localName}-${uniqueId}`;
    }

    /** @protected */
    ready() {
      super.ready();

      const textArea = this._getDirectSlotChild('textarea');
      if (textArea) {
        textArea.id = this._textareaId;

        this._setInputElement(textArea);
        this._setFocusElement(textArea);
      }
    }
  };

/**
 * A mixin to add `<textarea>` element to the corresponding named slot.
 */
export const TextAreaSlotMixin = dedupingMixin(TextAreaSlotMixinImplementation);
