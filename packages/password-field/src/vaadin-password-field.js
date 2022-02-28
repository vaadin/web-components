/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-password-field-button.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';
import { SlotStylesMixin } from '@vaadin/field-base/src/slot-styles-mixin.js';
import { TextField } from '@vaadin/text-field/src/vaadin-text-field.js';

const ownTemplate = html`
  <div part="reveal-button" slot="suffix">
    <slot name="reveal"></slot>
  </div>
`;

let memoizedTemplate;

/**
 * `<vaadin-password-field>` is an extension of `<vaadin-text-field>` component for entering passwords.
 *
 * ```html
 * <vaadin-password-field label="Password"></vaadin-password-field>
 * ```
 *
 * ### Styling
 *
 * `<vaadin-password-field>` provides the same set of shadow DOM parts and state attributes as `<vaadin-text-field>`.
 * See [`<vaadin-text-field>`](#/elements/vaadin-text-field) for the styling documentation.
 *
 * In addition to `<vaadin-text-field>` parts, the following parts are available for theming:
 *
 * Part name       | Description
 * ----------------|----------------------------------------------------
 * `reveal-button` | The eye icon which toggles the password visibility
 *
 * In addition to `<vaadin-text-field>` state attributes, the following state attributes are available for theming:
 *
 * Attribute          | Description
 * -------------------|---------------------------------
 * `password-visible` | Set when the password is visible
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @fires {Event} input - Fired when the value is changed by the user: on every typing keystroke, and the value is cleared using the clear button.
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 *
 * @extends TextField
 * @mixes SlotStylesMixin
 */
export class PasswordField extends SlotStylesMixin(TextField) {
  static get is() {
    return 'vaadin-password-field';
  }

  static get template() {
    if (!memoizedTemplate) {
      // Clone the superclass template
      memoizedTemplate = super.template.cloneNode(true);

      // Retrieve this element's dom-module template
      const revealButton = ownTemplate.content.querySelector('[part="reveal-button"]');

      // Append reveal-button and styles to the text-field template
      const inputField = memoizedTemplate.content.querySelector('[part="input-field"]');
      inputField.appendChild(revealButton);
    }

    return memoizedTemplate;
  }

  static get properties() {
    return {
      /**
       * Set to true to hide the eye icon which toggles the password visibility.
       * @attr {boolean} reveal-button-hidden
       */
      revealButtonHidden: {
        type: Boolean,
        observer: '_revealButtonHiddenChanged',
        value: false
      },

      /**
       * True if the password is visible ([type=text]).
       * @attr {boolean} password-visible
       */
      passwordVisible: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        observer: '_passwordVisibleChanged',
        readOnly: true
      },

      /**
       * An object with translated strings used for localization.
       * It has the following structure and default values:
       *
       * ```
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
            reveal: 'Show password'
          };
        }
      }
    };
  }

  static get observers() {
    return ['__i18nChanged(i18n.*)'];
  }

  /** @protected */
  get slotStyles() {
    const tag = this.localName;
    return [
      `
        ${tag} [slot="input"]::-ms-reveal {
          display: none;
        }
      `
    ];
  }

  /** @protected */
  get _revealNode() {
    return this._revealButtonController && this._revealButtonController.node;
  }

  constructor() {
    super();
    this._setType('password');
    this.__boundRevealButtonClick = this._onRevealButtonClick.bind(this);
    this.__boundRevealButtonTouchend = this._onRevealButtonTouchend.bind(this);
  }

  /** @protected */
  ready() {
    super.ready();

    this._revealPart = this.shadowRoot.querySelector('[part="reveal-button"]');

    this._revealButtonController = new SlotController(
      this,
      'reveal',
      () => document.createElement('vaadin-password-field-button'),
      (host, btn) => {
        btn.disabled = host.disabled;

        btn.addEventListener('click', host.__boundRevealButtonClick);
        btn.addEventListener('touchend', host.__boundRevealButtonTouchend);
      }
    );
    this.addController(this._revealButtonController);

    this.__updateAriaLabel(this.i18n);

    this._updateToggleState(false);
    this._toggleRevealHidden(this.revealButtonHidden);

    if (this.inputElement) {
      this.inputElement.autocapitalize = 'off';
    }
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
    } else {
      const isButtonFocused = this.getRootNode().activeElement === this._revealNode;
      // Remove focus-ring from the field when the reveal button gets focused
      this.toggleAttribute('focus-ring', this._keyboardActive && !isButtonFocused);
    }
  }

  /** @private */
  __updateAriaLabel(i18n) {
    if (i18n.reveal && this._revealNode) {
      this._revealNode.setAttribute('aria-label', i18n.reveal);
    }
  }

  /** @private */
  __i18nChanged(i18n) {
    this.__updateAriaLabel(i18n.base);
  }

  /** @private */
  _revealButtonHiddenChanged(hidden) {
    this._toggleRevealHidden(hidden);
  }

  /** @private */
  _togglePasswordVisibility() {
    this._setPasswordVisible(!this.passwordVisible);
  }

  /** @private */
  _onRevealButtonClick() {
    this._togglePasswordVisibility();
  }

  /** @private */
  _onRevealButtonTouchend(e) {
    // Cancel the following click event
    e.preventDefault();
    this._togglePasswordVisibility();
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

  /** @private */
  _updateToggleState(passwordVisible) {
    if (this._revealNode) {
      this._revealNode.setAttribute('aria-pressed', passwordVisible ? 'true' : 'false');
    }
  }

  /** @private */
  _passwordVisibleChanged(passwordVisible) {
    this._setType(passwordVisible ? 'text' : 'password');

    this._updateToggleState(passwordVisible);
  }

  /**
   * Override method inherited from `DisabledMixin` to synchronize the reveal button
   * disabled state with the password field disabled state.
   * @param {boolean} disabled
   * @param {boolean} oldDisabled
   * @protected
   */
  _disabledChanged(disabled, oldDisabled) {
    super._disabledChanged(disabled, oldDisabled);

    if (this._revealNode) {
      this._revealNode.disabled = disabled;
    }
  }
}

customElements.define(PasswordField.is, PasswordField);
