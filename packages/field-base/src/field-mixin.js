/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { animationFrame } from '@vaadin/component-base/src/async.js';
import { LabelMixin } from './label-mixin.js';
import { ValidateMixin } from './validate-mixin.js';

/**
 * A mixin to provide common field logic: label, error message and helper text.
 *
 * @polymerMixin
 * @mixes LabelMixin
 * @mixes ValidateMixin
 */
export const FieldMixin = (superclass) =>
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

    /** @protected */
    get slots() {
      return {
        ...super.slots,
        'error-message': () => {
          const error = document.createElement('div');
          error.textContent = this.errorMessage;
          error.setAttribute('aria-live', 'assertive');
          return error;
        }
      };
    }

    static get observers() {
      return [
        '__ariaChanged(invalid, _helperId)',
        '__observeOffsetHeight(errorMessage, invalid, label, helperText)',
        '_updateErrorMessage(invalid, errorMessage)'
      ];
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
    __applyCustomHelper(helper) {
      this.__updateHelperId(helper);
      this._currentHelper = helper;
      this.__toggleHasHelper(helper.children.length > 0 || this.__isNotEmpty(helper.textContent));
    }

    /** @private */
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
      this.appendChild(helper);
      this._currentHelper = helper;

      return helper;
    }

    /** @private */
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

    /** @private */
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
     * @param {boolean} invalid
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

    /** @protected */
    _helperTextChanged(helperText) {
      this.__applyDefaultHelper(helperText);
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
