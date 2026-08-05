/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { FieldAriaController } from '@vaadin/a11y-base/src/field-aria-controller.js';
import { ErrorController } from './error-controller.js';
import { HelperController } from './helper-controller.js';
import { LabelMixin } from './label-mixin.js';
import { ValidateMixin } from './validate-mixin.js';

/**
 * A mixin to provide common field logic: label, error message and helper text.
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
        },

        /**
         * Error to show when the field is invalid.
         *
         * @attr {string} error-message
         */
        errorMessage: {
          type: String,
        },

        /**
         * String used for the helper text.
         * @attr {string} helper-text
         */
        helperText: {
          type: String,
        },

        /**
         * String used to label the component for screen reader users.
         *
         * @attr {string} accessible-name
         */
        accessibleName: {
          type: String,
        },

        /**
         * A space-separated list of IDs referencing the elements that
         * label the component for screen reader users.
         *
         * @attr {string} accessible-name-ref
         */
        accessibleNameRef: {
          type: String,
        },

        /**
         * A space-separated list of IDs referencing the elements that
         * describe the component for screen reader users. The referenced
         * elements are announced in addition to the helper text and
         * the error message.
         *
         * @attr {string} accessible-description-ref
         */
        accessibleDescriptionRef: {
          type: String,
        },
      };
    }

    constructor() {
      super();

      this._labelController.addEventListener('slot-content-changed', (event) => {
        this.#onLabelSlotContentChange(event);
      });

      this._helperController = new HelperController(this);
      this._helperController.addEventListener('slot-content-changed', (event) => {
        this.#onHelperSlotContentChange(event);
      });

      this._errorController = new ErrorController(this);
      this._errorController.addEventListener('slot-content-changed', (event) => {
        this.#onErrorSlotContentChange(event);
      });

      this._fieldAriaController = new FieldAriaController(this);
    }

    /**
     * @protected
     * @return {HTMLElement}
     */
    get _errorNode() {
      return this._errorController.node;
    }

    /**
     * @protected
     * @return {HTMLElement}
     */
    get _helperNode() {
      return this._helperController.node;
    }

    /** @protected */
    ready() {
      super.ready();

      this.addController(this._fieldAriaController);
      this.addController(this._helperController);
      this.addController(this._errorController);
    }

    /** @protected */
    updated(props) {
      super.updated(props);

      if (props.has('invalid')) {
        this._errorController.setInvalid(this.invalid);
      }

      if (props.has('errorMessage')) {
        this._errorController.setErrorMessage(this.errorMessage);
      }

      if (props.has('helperText')) {
        this._helperController.setHelperText(this.helperText);
      }

      if (props.has('ariaTarget')) {
        this._fieldAriaController.setTarget(this.ariaTarget);
      }

      if (props.has('required')) {
        this._fieldAriaController.setRequired(this.required);
      }

      if (props.has('accessibleName')) {
        this.__updateFieldAriaControllerLabel();
      }

      if (props.has('accessibleName') || props.has('accessibleNameRef')) {
        this.__updateFieldAriaControllerLabelledBy();
      }

      if (props.has('accessibleDescriptionRef')) {
        this.__updateFieldAriaControllerDescribedBy();
      }
    }

    /** @private */
    __updateFieldAriaControllerLabel() {
      this._fieldAriaController.setLabel(this.accessibleName);
    }

    /** @private */
    __updateFieldAriaControllerLabelledBy() {
      let id = null;

      if (this.accessibleNameRef) {
        id = this.accessibleNameRef;
      } else if (this.hasAttribute('has-label') && !this.accessibleName) {
        // Label ID should be only added when the label content is present
        // and not overridden by `accessible-name` which sets `aria-label`.
        id = this._labelNode?.id;
      }

      this._fieldAriaController.setLabelledBy(id);
    }

    /** @private */
    __updateFieldAriaControllerDescribedBy() {
      this._fieldAriaController.setDescribedBy(this.accessibleDescriptionRef);
    }

    #onLabelSlotContentChange(_event) {
      this.__updateFieldAriaControllerLabelledBy();
    }

    #onHelperSlotContentChange(event) {
      const { hasContent } = event.detail;

      this.toggleAttribute('has-helper', hasContent);

      if (hasContent) {
        this._fieldAriaController.setHelperId(this._helperNode?.id);
      } else {
        this._fieldAriaController.setHelperId(null);
      }
    }

    #onErrorSlotContentChange(event) {
      this.toggleAttribute('has-error-message', event.detail.hasContent);

      // This timeout is needed to prevent NVDA from announcing the error message twice:
      // 1. Once adding the `[role=alert]` attribute when updating `has-error-message` (OK).
      // 2. Once linking the error ID with the ARIA target here (unwanted).
      // Related issue: https://github.com/vaadin/web-components/issues/3061.
      setTimeout(() => {
        // Error message ID needs to be dynamically added / removed based on the validity
        // Otherwise assistive technologies would announce the error, even if we hide it.
        if (this.invalid) {
          this._fieldAriaController.setErrorId(this._errorNode?.id);
        } else {
          this._fieldAriaController.setErrorId(null);
        }
      });
    }
  };
