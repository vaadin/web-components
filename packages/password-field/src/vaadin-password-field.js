/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { TextField } from '@vaadin/text-field/src/vaadin-text-field.js';

const ownTemplate = html`
  <div part="reveal-button" slot="suffix">
    <slot name="reveal"></slot>
  </div>
`;

let memoizedTemplate;

export class PasswordField extends TextField {
  static get is() {
    return 'vaadin-password-field';
  }

  static get version() {
    return '22.0.0-alpha1';
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
      }
    };
  }

  get slots() {
    return {
      ...super.slots,
      reveal: () => {
        const btn = document.createElement('button');
        btn.setAttribute('type', 'button');
        btn.setAttribute('tabindex', '0');
        return btn;
      }
    };
  }

  /** @protected */
  get _revealNode() {
    return this._getDirectSlotChild('reveal');
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
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();

    if (this._revealNode) {
      this._revealNode.setAttribute('aria-label', 'Show password');
      this._revealNode.addEventListener('click', this.__boundRevealButtonClick);
      this._revealNode.addEventListener('touchend', this.__boundRevealButtonTouchend);
    }

    if (this.inputElement) {
      this.inputElement.autocapitalize = 'off';
    }

    this._toggleRevealHidden(this.revealButtonHidden);
    this._updateToggleState(false);
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();

    if (this._revealNode) {
      this._revealNode.removeEventListener('click', this.__boundRevealButtonClick);
      this._revealNode.removeEventListener('touchend', this.__boundRevealButtonTouchend);
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

  /** @protected */
  _setFocused(focused) {
    super._setFocused(focused);

    if (!focused) {
      this._setPasswordVisible(false);
    }
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
}
