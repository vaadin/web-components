/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
import { LabelMixin } from './label-mixin.js';
import { ValidateMixin } from './validate-mixin.js';

const FieldMixinImplementation = (superclass) =>
  class FieldMixinClass extends ValidateMixin(LabelMixin(superclass)) {
    static get properties() {
      return {
        /**
         * A target element to which ARIA attributes are set.
         * @protected
         */
        ariaTarget: {
          type: Object,
          observer: '_ariaTargetChanged'
        },

        /**
         * Error to show when the field is invalid.
         *
         * @attr {string} error-message
         */
        errorMessage: {
          type: String
        },

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
        'error-message': () => {
          const error = document.createElement('div');
          error.textContent = this.errorMessage;
          error.setAttribute('aria-live', 'assertive');
          return error;
        },
        helper: () => {
          const helper = document.createElement('div');
          helper.textContent = this.helperText;
          return helper;
        }
      };
    }

    static get observers() {
      return ['_updateErrorMessage(invalid, errorMessage)', '__ariaChanged(invalid, _helperId)'];
    }

    /** @protected */
    get _errorNode() {
      return this._getDirectSlotChild('error-message');
    }

    /** @protected */
    get _helperNode() {
      return this._getDirectSlotChild('helper');
    }

    /** @protected */
    get _ariaAttr() {
      return 'aria-describedby';
    }

    constructor() {
      super();

      // Ensure every instance has unique ID
      const uniqueId = (FieldMixinClass._uniqueFieldId = 1 + FieldMixinClass._uniqueFieldId || 0);
      this._errorId = `error-${this.localName}-${uniqueId}`;
      this._helperId = `helper-${this.localName}-${uniqueId}`;

      // Save generated ID to restore later
      this.__savedHelperId = this._helperId;
    }

    /** @protected */
    ready() {
      super.ready();

      if (this._errorNode) {
        this._errorNode.id = this._errorId;

        this._applyCustomError();

        this._updateErrorMessage(this.invalid, this.errorMessage);
      }

      if (this._helperNode) {
        this._currentHelper = this._helperNode;
        this._helperNode.id = this._helperId;

        this._applyCustomHelper();

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
    }

    /** @protected */
    _applyCustomError() {
      const error = this.__errorMessage;
      if (error && error !== this.errorMessage) {
        this.errorMessage = error;
        delete this.__errorMessage;
      }
    }

    /**
     * @param {boolean} invalid
     * @protected
     */
    _updateErrorMessage(invalid, errorMessage) {
      if (!this._errorNode) {
        return;
      }

      // save the custom error message content
      if (this._errorNode.textContent && !errorMessage) {
        this.__errorMessage = this._errorNode.textContent.trim();
      }
      const hasError = Boolean(invalid && errorMessage);
      this._errorNode.textContent = hasError ? errorMessage : '';
      this.toggleAttribute('has-error-message', hasError);
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
      const current = this._currentHelper;

      // Check fot slotted element node that is not the one created by this mixin.
      const customHelper = this.__helperSlot.assignedElements({ flatten: true }).find((node) => node !== current);

      if (customHelper) {
        this.__updateHelperId(customHelper);

        if (current && current.isConnected) {
          current.remove();
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

    /** @protected */
    _ariaTargetChanged(target) {
      if (target) {
        this._updateAriaAttribute(this.invalid, this._helperId);
      }
    }

    /** @protected */
    _updateAriaAttribute(invalid, helperId) {
      const attr = this._ariaAttr;

      if (this.ariaTarget && attr) {
        // For groups, add all IDs to aria-labelledby rather than aria-describedby -
        // that should guarantee that it's announced when the group is entered.
        const ariaIds = attr === 'aria-describedby' ? [helperId] : [this._labelId, helperId];

        // Error message ID needs to be dynamically added / removed based on the validity
        // Otherwise assistive technologies would announce the error, even if we hide it.
        if (invalid) {
          ariaIds.push(this._errorId);
        }

        this.ariaTarget.setAttribute(attr, ariaIds.join(' '));
      }
    }

    /** @private */
    __ariaChanged(invalid, helperId) {
      this._updateAriaAttribute(invalid, helperId);
    }
  };

/**
 * A mixin to provide common field logic: label, error message and helper text.
 */
export const FieldMixin = dedupingMixin(FieldMixinImplementation);
