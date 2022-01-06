/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { SlotMixin } from '@vaadin/component-base/src/slot-mixin.js';
import { FieldAriaController } from './field-aria-controller.js';
import { HelperController } from './helper-controller.js';
import { LabelMixin } from './label-mixin.js';
import { ValidateMixin } from './validate-mixin.js';

/**
 * A mixin to provide common field logic: label, error message and helper text.
 *
 * @polymerMixin
 * @mixes ControllerMixin
 * @mixes LabelMixin
 * @mixes SlotMixin
 * @mixes ValidateMixin
 */
export const FieldMixin = (superclass) =>
  class FieldMixinClass extends ValidateMixin(LabelMixin(ControllerMixin(SlotMixin(superclass)))) {
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

    /** @protected */
    get slots() {
      return {
        ...super.slots,
        'error-message': () => {
          const error = document.createElement('div');
          error.textContent = this.errorMessage;
          return error;
        }
      };
    }

    static get observers() {
      return ['_updateErrorMessage(invalid, errorMessage)', '_invalidChanged(invalid)', '_requiredChanged(required)'];
    }

    /**
     * @protected
     * @return {HTMLElement}
     */
    get _errorNode() {
      return this._getDirectSlotChild('error-message');
    }

    /** @protected */
    get _helperId() {
      return this._helperController.helperId;
    }

    /**
     * @protected
     * @return {HTMLElement}
     */
    get _helperNode() {
      return this._helperController.node;
    }

    constructor() {
      super();

      // Ensure every instance has unique ID
      const uniqueId = (FieldMixinClass._uniqueFieldId = 1 + FieldMixinClass._uniqueFieldId || 0);
      this._errorId = `error-${this.localName}-${uniqueId}`;

      this._fieldAriaController = new FieldAriaController(this);
      this._helperController = new HelperController(this);

      this.addController(this._fieldAriaController);
      this.addController(this._helperController);

      this._labelController.addEventListener('label-changed', (event) => {
        const { hasLabel, node } = event.detail;
        this.__labelChanged(hasLabel, node);
      });

      this._helperController.addEventListener('helper-changed', (event) => {
        const { hasHelper, node } = event.detail;
        this.__helperChanged(hasHelper, node);
      });
    }

    /** @protected */
    ready() {
      super.ready();

      const error = this._errorNode;
      if (error) {
        error.id = this._errorId;

        this.__applyCustomError();

        this._updateErrorMessage(this.invalid, this.errorMessage);
      }
    }

    /** @private */
    __applyCustomError() {
      const error = this.__errorMessage;
      if (error && error !== this.errorMessage) {
        this.errorMessage = error;
        delete this.__errorMessage;
      }
    }

    /** @private */
    __helperChanged(hasHelper, helperNode) {
      if (hasHelper) {
        this._fieldAriaController.setHelperId(helperNode.id);
      } else {
        this._fieldAriaController.setHelperId(null);
      }
    }

    /** @private */
    __labelChanged(hasLabel, labelNode) {
      // Label ID should be only added when the label content is present.
      // Otherwise, it may conflict with an `aria-label` attribute possibly added by the user.
      if (hasLabel) {
        this._fieldAriaController.setLabelId(labelNode.id);
      } else {
        this._fieldAriaController.setLabelId(null);
      }
    }

    /**
     * @param {boolean} invalid
     * @param {string | null | undefined} errorMessage
     * @protected
     */
    _updateErrorMessage(invalid, errorMessage) {
      const error = this._errorNode;
      if (!error) {
        return;
      }

      // save the custom error message content
      if (error.textContent && !errorMessage) {
        this.__errorMessage = error.textContent.trim();
      }
      const hasError = Boolean(invalid && errorMessage);
      error.textContent = hasError ? errorMessage : '';
      error.hidden = !hasError;
      this.toggleAttribute('has-error-message', hasError);

      // Role alert will make the error message announce immediately
      // as the field becomes invalid
      if (hasError) {
        error.setAttribute('role', 'alert');
      } else {
        error.removeAttribute('role');
      }
    }

    /**
     * @param {string} helperText
     * @protected
     */
    _helperTextChanged(helperText) {
      this._helperController.setHelperText(helperText);
    }

    /**
     * @param {HTMLElement | null | undefined} target
     * @protected
     */
    _ariaTargetChanged(target) {
      if (target) {
        this._fieldAriaController.setTarget(target);
      }
    }

    /**
     * @param {boolean} required
     * @protected
     */
    _requiredChanged(required) {
      this._fieldAriaController.setRequired(required);
    }

    /**
     * @param {boolean} required
     * @protected
     */
    _invalidChanged(invalid) {
      // This timeout is needed to prevent NVDA from announcing the error message twice:
      // 1. Once adding the `[role=alert]` attribute by the `_updateErrorMessage` method (OK).
      // 2. Once linking the error ID with the ARIA target here (unwanted).
      // Related issue: https://github.com/vaadin/web-components/issues/3061.
      setTimeout(() => {
        // Error message ID needs to be dynamically added / removed based on the validity
        // Otherwise assistive technologies would announce the error, even if we hide it.
        if (invalid) {
          this._fieldAriaController.setErrorId(this._errorId);
        } else {
          this._fieldAriaController.setErrorId(null);
        }
      });
    }
  };
