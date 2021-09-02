/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
import { SlotMixin } from './slot-mixin.js';

const HelperTextMixinImplementation = (superclass) =>
  class HelperTextMixinClass extends SlotMixin(superclass) {
    static get properties() {
      return {
        /**
         * String used for the helper text.
         * @attr {string} helper-text
         */
        helperText: {
          type: String,
          observer: '_helperTextChanged'
        },

        /** @protected */
        _helperId: String
      };
    }

    get slots() {
      return {
        ...super.slots,
        helper: () => {
          const helper = document.createElement('div');
          helper.textContent = this.helperText;
          return helper;
        }
      };
    }

    /** @protected */
    get _helperNode() {
      return this._getDirectSlotChild('helper');
    }

    constructor() {
      super();

      // Ensure every instance has unique ID
      const uniqueId = (HelperTextMixinClass._uniqueId = 1 + HelperTextMixinClass._uniqueId || 0);
      this._helperId = `helper-${this.localName}-${uniqueId}`;

      // Save generated ID to restore later
      this.__savedHelperId = this._helperId;
    }

    /** @protected */
    connectedCallback() {
      super.connectedCallback();

      if (this._helperNode) {
        this._currentHelper = this._helperNode;
        this._helperNode.id = this._helperId;

        this._applyCustomHelper();
      }
    }

    /** @protected */
    ready() {
      super.ready();

      this.__helperSlot = this.shadowRoot.querySelector('[name="helper"]');
      this.__helperSlot.addEventListener('slotchange', this.__onHelperSlotChange.bind(this));
      this.__helperIdObserver = new MutationObserver((mutationRecord) => {
        mutationRecord.forEach((mutation) => {
          // only handle helper nodes
          if (
            mutation.type === 'attributes' &&
            mutation.attributeName === 'id' &&
            mutation.target === this._currentHelper &&
            mutation.target.id !== this.__savedHelperId
          ) {
            this.__updateHelperId(mutation.target);
          }
        });
      });

      this.__helperIdObserver.observe(this, { attributes: true, subtree: true });
    }

    /** @private */
    __updateHelperId(customHelper) {
      let newId;

      if (customHelper.id) {
        newId = customHelper.id;
      } else {
        newId = this.__savedHelperId;
        customHelper.id = newId;
      }

      this._helperId = newId;
    }

    /** @private */
    __onHelperSlotChange() {
      // Check fot slotted element node that is not the one created by this mixin.
      const customHelper = this.__helperSlot
        .assignedElements({ flatten: true })
        .find((node) => node !== this._currentHelper);

      if (customHelper) {
        this.__updateHelperId(customHelper);

        if (this._currentHelper.isConnected) {
          this._currentHelper.remove();
        }

        this._applyCustomHelper();

        this._currentHelper = customHelper;
      }
    }

    /** @protected */
    _applyCustomHelper() {
      const helper = this._helperNode.textContent;
      if (helper !== this.helperText) {
        this.helperText = helper;
      }
    }

    /** @protected */
    _helperTextChanged(helper) {
      if (this._helperNode) {
        this._helperNode.textContent = helper;
      }

      this.toggleAttribute('has-helper', Boolean(helper));
    }
  };

/**
 * A mixin to provide helper text via corresponding property or named slot.
 */
export const HelperTextMixin = dedupingMixin(HelperTextMixinImplementation);
