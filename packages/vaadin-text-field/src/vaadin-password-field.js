/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DomModule } from '@polymer/polymer/lib/elements/dom-module.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { TextFieldElement } from './vaadin-text-field.js';

const $_documentContainer = html` <style>
    @font-face {
      font-family: 'vaadin-password-field-icons';
      src: url(data:application/font-woff;charset=utf-8;base64,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)
        format('woff');
      font-weight: normal;
      font-style: normal;
    }
  </style>
  <dom-module id="vaadin-password-field-template">
    <template>
      <style>
        [part='reveal-button'][hidden] {
          display: none !important;
        }

        input::-ms-reveal {
          display: none;
        }
      </style>

      <div
        part="reveal-button"
        on-mousedown="_revealButtonMouseDown"
        on-touchend="_togglePasswordVisibilityTouchend"
        on-click="_togglePasswordVisibility"
        hidden$="[[revealButtonHidden]]"
      ></div>
    </template>
  </dom-module>`;

document.head.appendChild($_documentContainer.content);
let memoizedTemplate;

/**
 * `<vaadin-password-field>` is a Web Component for password field control in forms.
 *
 * ```html
 * <vaadin-password-field label="Password">
 * </vaadin-password-field>
 * ```
 *
 * ### Styling
 *
 * See [`<vaadin-text-field>`](#/elements/vaadin-text-field) for the styling documentation.
 *
 * In addition to vaadin-text-field parts, here's the list of vaadin-password-field specific parts
 *
 * Part name       | Description
 * ----------------|----------------------------------------------------
 * `reveal-button` | The eye icon which toggles the password visibility
 *
 * In addition to vaadin-text-field state attributes, here's the list of vaadin-password-field specific attributes
 *
 * Attribute    | Description | Part name
 * -------------|-------------|------------
 * `password-visible` | Set when the password is visible | :host
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @fires {Event} input - Fired when the value is changed by the user: on every typing keystroke, and the value is cleared using the clear button.
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 *
 * @extends TextFieldElement
 */
class PasswordFieldElement extends TextFieldElement {
  static get is() {
    return 'vaadin-password-field';
  }

  static get version() {
    return '21.0.4';
  }

  static get properties() {
    return {
      /**
       * Set to true to hide the eye icon which toggles the password visibility.
       * @attr {boolean} reveal-button-hidden
       * @type {boolean}
       */
      revealButtonHidden: {
        type: Boolean,
        value: false
      },

      /**
       * True if the password is visible ([type=text]).
       * @attr {boolean} password-visible
       * @type {boolean}
       */
      passwordVisible: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        observer: '_passwordVisibleChange',
        readOnly: true
      }
    };
  }

  static get template() {
    if (!memoizedTemplate) {
      // Clone the superclass template
      memoizedTemplate = super.template.cloneNode(true);

      // Retrieve this element's dom-module template
      const thisTemplate = DomModule.import(this.is + '-template', 'template');
      const revealButton = thisTemplate.content.querySelector('[part="reveal-button"]');
      const styles = thisTemplate.content.querySelector('style');

      // Append reveal-button and styles to the text-field template
      const inputField = memoizedTemplate.content.querySelector('[part="input-field"]');
      inputField.appendChild(revealButton);
      memoizedTemplate.content.appendChild(styles);
    }

    return memoizedTemplate;
  }

  /** @protected */
  ready() {
    super.ready();
    this.inputElement.type = 'password';
    this.inputElement.autocapitalize = 'off';

    this.addEventListener('focusout', () => {
      if (!this._passwordVisibilityChanging) {
        this._setPasswordVisible(false);
        if (this._cachedChangeEvent) {
          this._onChange(this._cachedChangeEvent);
        }
      }
    });
  }

  /**
   * @param {!Event} e
   * @protected
   */
  _onChange(e) {
    const slotted = this.querySelector(`${this._slottedTagName}[slot="${this._slottedTagName}"]`);
    if (slotted) {
      e.stopPropagation();
    }
    if (this._passwordVisibilityChanging) {
      this._cachedChangeEvent = e;
    } else {
      this._cachedChangeEvent = null;
      super._onChange(e);
    }
  }

  /** @private */
  _revealButtonMouseDown(e) {
    if (this.hasAttribute('focused')) {
      e.preventDefault();
    }
  }

  /** @private */
  _togglePasswordVisibilityTouchend(e) {
    // Cancel the following click event
    e.preventDefault();
    this._togglePasswordVisibility();
    this.inputElement.focus();
  }

  /** @private */
  _togglePasswordVisibility() {
    this._passwordVisibilityChanging = true;
    this.inputElement.blur();
    this._setPasswordVisible(!this.passwordVisible);
    this.inputElement.focus();
    this._passwordVisibilityChanging = false;
  }

  /** @private */
  _passwordVisibleChange(passwordVisible) {
    this.inputElement.type = passwordVisible ? 'text' : 'password';
  }
}

customElements.define(PasswordFieldElement.is, PasswordFieldElement);

export { PasswordFieldElement };
