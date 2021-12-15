/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import { animationFrame } from '@vaadin/component-base/src/async.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { FieldAriaController } from './field-aria-controller.js';
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

      // Save generated ID to restore later
      this.__savedHelperId = this._helperId;

      this._fieldAriaController = new FieldAriaController(this);
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

      const helper = this._helperNode;
      if (helper) {
        this.__applyCustomHelper(helper);
      }

      this.__helperSlot = this.shadowRoot.querySelector('[name="helper"]');

      this.__helperSlotObserver = new FlattenedNodesObserver(this.__helperSlot, (info) => {
        const helper = this._currentHelper;

        const newHelper = info.addedNodes.find((node) => node !== helper);
        const oldHelper = info.removedNodes.find((node) => node === helper);

        if (newHelper) {
          // Custom helper is added, remove the previous one.
          if (helper && helper.isConnected) {
            this.removeChild(helper);
          }

          this.__applyCustomHelper(newHelper);

          this.__helperIdObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
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

          this.__helperIdObserver.observe(newHelper, { attributes: true });
        } else if (oldHelper) {
          // The observer does not exist when default helper is removed.
          if (this.__helperIdObserver) {
            this.__helperIdObserver.disconnect();
          }

          this.__applyDefaultHelper(this.helperText);
        }
      });

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
     * @param {HTMLElement} helper
     * @private
     */
    __applyCustomHelper(helper) {
      this.__updateHelperId(helper);
      this._currentHelper = helper;
      this.__toggleHasHelper(helper.children.length > 0 || this.__isNotEmpty(helper.textContent));
    }

    /**
     * @param {string} helperText
     * @private
     */
    __isNotEmpty(helperText) {
      return helperText && helperText.trim() !== '';
    }

    /** @private */
    __attachDefaultHelper() {
      let helper = this.__defaultHelper;

      if (!helper) {
        helper = document.createElement('div');
        helper.setAttribute('slot', 'helper');
        this.__defaultHelper = helper;
      }

      helper.id = this.__savedHelperId;
      this._helperId = helper.id;
      this.appendChild(helper);
      this._currentHelper = helper;

      return helper;
    }

    /**
     * @param {string} helperText
     * @private
     */
    __applyDefaultHelper(helperText) {
      let helper = this._helperNode;

      const hasHelperText = this.__isNotEmpty(helperText);
      if (hasHelperText && !helper) {
        // Create helper lazily
        helper = this.__attachDefaultHelper();
      }

      // Only set text content for default helper
      if (helper && helper === this.__defaultHelper) {
        helper.textContent = helperText;
      }

      this.__toggleHasHelper(hasHelperText);
    }

    /**
     * @param {boolean} hasHelper
     * @private
     */
    __toggleHasHelper(hasHelper) {
      this.toggleAttribute('has-helper', hasHelper);
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
     * @param {HTMLElement} customHelper
     * @private
     */
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

    /**
     * @param {string} helperText
     * @protected
     */
    _helperTextChanged(helperText) {
      this.__applyDefaultHelper(helperText);
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
