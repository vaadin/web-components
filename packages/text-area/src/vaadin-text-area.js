/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PolymerElement, html } from '@polymer/polymer';
import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';
import { CharLengthMixin } from '@vaadin/field-base/src/char-length-mixin.js';
import { InputFieldMixin } from '@vaadin/field-base/src/input-field-mixin.js';
import { TextAreaSlotMixin } from '@vaadin/field-base/src/text-area-slot-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import '@vaadin/input-container/src/vaadin-input-container.js';
import '@vaadin/text-field/src/vaadin-input-field-shared-styles.js';

/**
 * `<vaadin-text-area>` is a web component for multi-line text input.
 *
 * ```html
 * <vaadin-text-area label="Comment"></vaadin-text-area>
 * ```
 *
 * ### Prefixes and suffixes
 *
 * These are child elements of a `<vaadin-text-area>` that are displayed
 * inline with the input, before or after.
 * In order for an element to be considered as a prefix, it must have the slot
 * attribute set to `prefix` (and similarly for `suffix`).
 *
 * ```html
 * <vaadin-text-area label="Description">
 *   <div slot="prefix">Details:</div>
 *   <div slot="suffix">The end!</div>
 * </vaadin-text-area>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name       | Description
 * ----------------|----------------
 * `label`         | The label element wrapper
 * `input-field`   | The element that wraps prefix, textarea and suffix
 * `error-message` | The error message element wrapper
 * `helper-text`   | The helper text element wrapper
 *
 * The following state attributes are available for styling:
 *
 * Attribute           | Description                               | Part name
 * --------------------|-------------------------------------------|----------
 * `disabled`          | Set when the element is disabled          | :host
 * `has-value`         | Set when the element has a value          | :host
 * `has-label`         | Set when the element has a label          | :host
 * `has-helper`        | Set when the element has helper text      | :host
 * `has-error-message` | Set when the element has an error message | :host
 * `invalid`           | Set when the element is invalid           | :host
 * `focused`           | Set when the element is focused           | :host
 * `focus-ring`        | Set when the element is keyboard focused  | :host
 * `readonly`          | Set when the element is readonly          | :host
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @fires {Event} input - Fired when the value is changed by the user: on every typing keystroke, and the value is cleared using the clear button.
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 *
 * @extends HTMLElement
 * @mixes CharLengthMixin
 * @mixes InputFieldMixin
 * @mixes TextAreaSlotMixin
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
export class TextArea extends CharLengthMixin(
  InputFieldMixin(TextAreaSlotMixin(ThemableMixin(ElementMixin(PolymerElement))))
) {
  static get is() {
    return 'vaadin-text-area';
  }

  static get template() {
    return html`
      <style include="vaadin-input-field-shared-styles">
        :host {
          animation: 1ms vaadin-text-area-appear;
        }

        [part='container'] {
          flex: auto;
        }

        /* The label, helper text and the error message should neither grow nor shrink. */
        [part='label'],
        [part='helper-text'],
        [part='error-message'] {
          flex: none;
        }

        [part='input-field'] {
          overflow: auto;
          -webkit-overflow-scrolling: touch;
        }

        ::slotted(textarea) {
          -webkit-appearance: none;
          -moz-appearance: none;
          flex: auto;
          white-space: nowrap;
          width: 100%;
          height: 100%;
          outline: none;
          resize: none;
          margin: 0;
          padding: 0;
          border: 0;
          border-radius: 0;
          min-width: 0;
          font: inherit;
          font-size: 1em;
          line-height: normal;
          color: inherit;
          background-color: transparent;
          /* Disable default invalid style in Firefox */
          box-shadow: none;
        }

        [part='input-field'] ::slotted(*) {
          align-self: flex-start;
        }

        @keyframes vaadin-text-area-appear {
          to {
            opacity: 1;
          }
        }
      </style>

      <div part="container">
        <div part="label">
          <slot name="label"></slot>
          <span part="indicator" aria-hidden="true"></span>
        </div>

        <vaadin-input-container
          part="input-field"
          readonly="[[readonly]]"
          disabled="[[disabled]]"
          invalid="[[invalid]]"
          theme$="[[theme]]"
        >
          <slot name="prefix" slot="prefix"></slot>
          <slot name="textarea"></slot>
          <slot name="suffix" slot="suffix"></slot>
          <div id="clearButton" part="clear-button" slot="suffix"></div>
        </vaadin-input-container>

        <div part="helper-text">
          <slot name="helper"></slot>
        </div>

        <div part="error-message">
          <slot name="error-message"></slot>
        </div>
      </div>
    `;
  }

  /**
   * Used by `ClearButtonMixin` as a reference to the clear button element.
   * @protected
   */
  get clearElement() {
    return this.$.clearButton;
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();

    this._inputField = this.shadowRoot.querySelector('[part=input-field]');
    this._updateHeight();
  }

  /** @protected */
  ready() {
    super.ready();
    this.addEventListener('animationend', this._onAnimationEnd);
  }

  /** @private */
  _onAnimationEnd(e) {
    if (e.animationName.indexOf('vaadin-text-area-appear') === 0) {
      this._updateHeight();
    }
  }

  /**
   * @param {unknown} newVal
   * @param {unknown} oldVal
   * @protected
   * @override
   */
  _valueChanged(newVal, oldVal) {
    super._valueChanged(newVal, oldVal);

    this._updateHeight();
  }

  /** @private */
  _updateHeight() {
    const input = this.inputElement;
    const inputField = this._inputField;

    if (!input || !inputField) {
      return;
    }

    const scrollTop = inputField.scrollTop;

    // Only clear the height when the content shortens to minimize scrollbar flickering.
    const valueLength = this.value ? this.value.length : 0;

    if (this._oldValueLength >= valueLength) {
      const inputFieldHeight = getComputedStyle(inputField).height;
      const inputWidth = getComputedStyle(input).width;

      // Temporarily fix the height of the wrapping input field container to prevent changing the browsers scroll
      // position while resetting the textareas height. If the textarea had a large height, then removing its height
      // will reset its height to the default of two rows. That might reduce the height of the page, and the
      // browser might adjust the scroll position before we can restore the measured height of the textarea.
      inputField.style.display = 'block';
      inputField.style.height = inputFieldHeight;

      // Fix the input element width so its scroll height isn't affected by host's disappearing scrollbars
      input.style.maxWidth = inputWidth;

      // Clear the height of the textarea to allow measuring a reduced scroll height
      input.style.height = 'auto';
    }
    this._oldValueLength = valueLength;

    const inputHeight = input.scrollHeight;
    if (inputHeight > input.clientHeight) {
      input.style.height = inputHeight + 'px';
    }

    // Restore
    input.style.removeProperty('max-width');
    inputField.style.removeProperty('display');
    inputField.style.removeProperty('height');
    inputField.scrollTop = scrollTop;

    this._dispatchIronResizeEventIfNeeded('InputHeight', inputHeight);
  }
}

customElements.define(TextArea.is, TextArea);
