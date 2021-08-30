/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
import { LabelMixin } from './label-mixin.js';
import { InputMixin } from './input-mixin.js';

const AriaLabelMixinImplementation = (superclass) =>
  class AriaLabelMixinClass extends InputMixin(LabelMixin(superclass)) {
    constructor() {
      super();

      this.__preventDuplicateLabelClick = this.__preventDuplicateLabelClick.bind(this);
    }

    /** @protected */
    connectedCallback() {
      super.connectedCallback();

      if (this._labelNode) {
        this._labelNode.addEventListener('click', this.__preventDuplicateLabelClick);
      }
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();

      if (this._labelNode) {
        this._labelNode.removeEventListener('click', this.__preventDuplicateLabelClick);
      }
    }

    /**
     * Override an observer from `InputMixin`.
     * @protected
     * @override
     */
    _inputElementChanged(input) {
      super._inputElementChanged(input);

      if (input) {
        input.setAttribute('aria-labelledby', this._labelId);

        this._labelNode.setAttribute('for', input.id);
      }
    }

    /**
     * The native platform fires an event for both the click on the label, and also
     * the subsequent click on the native input element caused by label click.
     * This results in two click events arriving at the host, but we only want one.
     * This method prevents the duplicate click and ensures the correct isTrusted event
     * with the correct event.target arrives at the host.
     * @private
     */
    __preventDuplicateLabelClick() {
      const inputClickHandler = (e) => {
        e.stopImmediatePropagation();
        this.inputElement.removeEventListener('click', inputClickHandler);
      };
      this.inputElement.addEventListener('click', inputClickHandler);
    }
  };

/**
 * A mixin to link an input element with a slotted `<label>` element.
 */
export const AriaLabelMixin = dedupingMixin(AriaLabelMixinImplementation);
