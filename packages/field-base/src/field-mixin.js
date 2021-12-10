/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { animationFrame } from '@vaadin/component-base/src/async.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
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
 * @mixes ValidateMixin
 */
export const FieldMixin = (superclass) =>
  class FieldMixinClass extends ValidateMixin(LabelMixin(ControllerMixin(superclass))) {
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
      return [
        '__observeOffsetHeight(errorMessage, invalid, label, helperText)',
        '_updateErrorMessage(invalid, errorMessage)',
        '_invalidChanged(invalid)',
        '_requiredChanged(required)',
        '_helperIdChanged(_helperId)'
      ];
    }

    /**
     * @protected
     * @return {HTMLElement}
     */
    get _errorNode() {
      return this._getDirectSlotChild('error-message');
    }

    /**
     * @protected
     * @return {HTMLElement}
     */
    get _helperNode() {
      return this._getDirectSlotChild('helper');
    }

    constructor() {
      super();

      // Ensure every instance has unique ID
      const uniqueId = (FieldMixinClass._uniqueFieldId = 1 + FieldMixinClass._uniqueFieldId || 0);
      this._errorId = `error-${this.localName}-${uniqueId}`;
      this._helperId = `helper-${this.localName}-${uniqueId}`;

      this._fieldAriaController = new FieldAriaController(this);
      this._helperController = new HelperController(this, this._helperId);
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

      this.addController(this._helperController);
      this.addController(this._fieldAriaController);
    }

    /** @private */
    __applyCustomError() {
      const error = this.__errorMessage;
      if (error && error !== this.errorMessage) {
        this.errorMessage = error;
        delete this.__errorMessage;
      }
    }

    /**
     * Dispatch an event if a specific size measurement property has changed.
     * Supporting multiple properties here is needed for `vaadin-text-area`.
     * @protected
     */
    _dispatchIronResizeEventIfNeeded(prop, value) {
      const oldSize = '__old' + prop;
      if (this[oldSize] !== undefined && this[oldSize] !== value) {
        this.dispatchEvent(new CustomEvent('iron-resize', { bubbles: true, composed: true }));
      }

      this[oldSize] = value;
    }

    /** @private */
    __observeOffsetHeight() {
      this.__observeOffsetHeightDebouncer = Debouncer.debounce(
        this.__observeOffsetHeightDebouncer,
        animationFrame,
        () => {
          this._dispatchIronResizeEventIfNeeded('Height', this.offsetHeight);
        }
      );
    }

    /**
     * @protected
     * @override
     */
    _toggleHasLabelAttribute() {
      super._toggleHasLabelAttribute();

      // Label ID should be only added when the label content is present.
      // Otherwise, it may conflict with an `aria-label` attribute possibly added by the user.
      if (this.hasAttribute('has-label')) {
        this._fieldAriaController.setLabelId(this._labelId);
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
     * @param {string} helperId
     * @protected
     */
    _helperIdChanged(helperId) {
      this._fieldAriaController.setHelperId(helperId);
    }

    /**
     * @param {boolean} required
     * @protected
     */
    _invalidChanged(invalid) {
      // Error message ID needs to be dynamically added / removed based on the validity
      // Otherwise assistive technologies would announce the error, even if we hide it.
      if (invalid) {
        this._fieldAriaController.setErrorId(this._errorId);
      } else {
        this._fieldAriaController.setErrorId(null);
      }
    }
  };
