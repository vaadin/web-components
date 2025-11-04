/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DisabledMixin } from '@vaadin/a11y-base/src/disabled-mixin.js';
import { FocusMixin } from '@vaadin/a11y-base/src/focus-mixin.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';
import { SlotStylesMixin } from '@vaadin/component-base/src/slot-styles-mixin.js';
import { InputMixin } from '@vaadin/field-base/src/input-mixin.js';

/**
 * @polymerMixin
 * @mixes DisabledMixin
 * @mixes FocusMixin
 * @mixes InputMixin
 * @mixes SlotStylesMixin
 */
export const PasswordFieldMixin = (superClass) =>
  class PasswordFieldMixinClass extends SlotStylesMixin(DisabledMixin(FocusMixin(InputMixin(superClass)))) {
    static get properties() {
      return {
        /**
         * Set to true to hide the eye icon which toggles the password visibility.
         * @attr {boolean} reveal-button-hidden
         */
        revealButtonHidden: {
          type: Boolean,
          value: false,
        },

        /**
         * True if the password is visible ([type=text]).
         * @attr {boolean} password-visible
         */
        passwordVisible: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
          readOnly: true,
        },

        /**
         * An object with translated strings used for localization.
         * It has the following structure and default values:
         *
         * ```js
         * {
         *   // Translation of the reveal icon button accessible label
         *   reveal: 'Show password'
         * }
         * ```
         */
        i18n: {
          type: Object,
          value: () => {
            return {
              reveal: 'Show password',
            };
          },
        },
      };
    }

    /** @override */
    static get delegateAttrs() {
      // Do not delegate autocapitalize as it should be always set to "off"
      return super.delegateAttrs.filter((attr) => attr !== 'autocapitalize');
    }

    constructor() {
      super();
      this._setType('password');
      this.__boundRevealButtonClick = this._onRevealButtonClick.bind(this);
      this.__boundRevealButtonMouseDown = this._onRevealButtonMouseDown.bind(this);
      this.__lastChange = '';
    }

    /** @protected */
    get slotStyles() {
      const tag = this.localName;
      return [
        ...super.slotStyles,
        `
          ${tag} [slot="input"]::-ms-reveal {
            display: none;
          }
        `,
      ];
    }

    /** @protected */
    ready() {
      super.ready();

      this._revealPart = this.shadowRoot.querySelector('[part~="reveal-button"]');

      this._revealButtonController = new SlotController(this, 'reveal', 'vaadin-password-field-button', {
        initializer: (btn) => {
          this._revealNode = btn;

          btn.addEventListener('click', this.__boundRevealButtonClick);
          btn.addEventListener('mousedown', this.__boundRevealButtonMouseDown);
        },
      });
      this.addController(this._revealButtonController);

      if (this.inputElement) {
        this.inputElement.autocapitalize = 'off';
      }
    }

    /** @protected */
    updated(props) {
      super.updated(props);

      if (props.has('disabled')) {
        this._revealNode.disabled = this.disabled;
      }

      if (props.has('revealButtonHidden')) {
        this._toggleRevealHidden(this.revealButtonHidden);
      }

      if (props.has('passwordVisible')) {
        this._setType(this.passwordVisible ? 'text' : 'password');
        this._revealNode.setAttribute('aria-pressed', this.passwordVisible ? 'true' : 'false');
      }

      if (props.has('i18n') && this.i18n && this.i18n.reveal) {
        this._revealNode.setAttribute('aria-label', this.i18n.reveal);
      }
    }

    /**
     * Override an event listener inherited from `InputControlMixin`
     * to store the value at the moment of the native `change` event.
     * @param {Event} event
     * @protected
     * @override
     */
    _onChange(event) {
      super._onChange(event);

      this.__lastChange = this.inputElement.value;
    }

    /**
     * Override method inherited from `FocusMixin` to mark field as focused
     * when focus moves to the reveal button using Shift Tab.
     * @param {Event} event
     * @return {boolean}
     * @protected
     */
    _shouldSetFocus(event) {
      return event.target === this.inputElement || event.target === this._revealNode;
    }

    /**
     * Override method inherited from `FocusMixin` to not hide password
     * when focus moves to the reveal button or back to the input.
     * @param {Event} event
     * @return {boolean}
     * @protected
     */
    _shouldRemoveFocus(event) {
      return !(
        event.relatedTarget === this._revealNode ||
        (event.relatedTarget === this.inputElement && event.target === this._revealNode)
      );
    }

    /**
     * Override method inherited from `FocusMixin` to toggle password visibility.
     * @param {boolean} focused
     * @protected
     * @override
     */
    _setFocused(focused) {
      super._setFocused(focused);

      if (!focused) {
        this._setPasswordVisible(false);

        // Detect if `focusout` was prevented and if so, dispatch `change` event manually.
        if (this.__lastChange !== this.inputElement.value) {
          this.__lastChange = this.inputElement.value;
          this.dispatchEvent(new CustomEvent('change', { bubbles: true }));
        }
      } else {
        const isButtonFocused = this.getRootNode().activeElement === this._revealNode;
        // Remove focus-ring from the field when the reveal button gets focused
        this.toggleAttribute('focus-ring', this._keyboardActive && !isButtonFocused);
      }
    }

    /** @private */
    _onRevealButtonClick() {
      this._setPasswordVisible(!this.passwordVisible);
    }

    /** @private */
    _onRevealButtonMouseDown(e) {
      // Cancel the following focusout event
      e.preventDefault();

      // Focus the input to avoid problem with password still visible
      // when user clicks the reveal button and then clicks outside.
      this.inputElement.focus();
    }

    /** @private */
    _toggleRevealHidden(hidden) {
      if (this._revealNode) {
        if (hidden) {
          this._revealPart.setAttribute('hidden', '');
          this._revealNode.setAttribute('tabindex', '-1');
          this._revealNode.setAttribute('aria-hidden', 'true');
        } else {
          this._revealPart.removeAttribute('hidden');
          this._revealNode.setAttribute('tabindex', '0');
          this._revealNode.removeAttribute('aria-hidden');
        }
      }
    }
  };
