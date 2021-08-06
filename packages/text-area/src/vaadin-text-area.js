/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PolymerElement, html } from '@polymer/polymer';
import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';
import { TextFieldMixin } from '@vaadin/field-base/src/text-field-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import '@vaadin/input-container/src/vaadin-input-container.js';
import '@vaadin/text-field/src/vaadin-input-field-shared-styles.js';

export class TextArea extends TextFieldMixin(ThemableMixin(ElementMixin(PolymerElement))) {
  static get is() {
    return 'vaadin-text-area';
  }

  static get version() {
    return '22.0.0-alpha1';
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

        .textarea-wrapper {
          display: grid;
          flex: 1 1 auto;
          align-self: stretch;
        }

        .textarea-wrapper::after {
          content: attr(data-replicated-value) ' ';
          white-space: pre-wrap;
          visibility: hidden;
        }

        ::slotted(textarea) {
          -webkit-appearance: none;
          -moz-appearance: none;
          flex: auto;
          white-space: nowrap;
          overflow: hidden;
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

        ::slotted(textarea),
        .textarea-wrapper::after {
          grid-area: 1 / 1 / 2 / 2;
          box-sizing: border-box;
          padding: 0 0.25em;
          overflow-wrap: break-word;
          word-wrap: break-word;
          word-break: break-word;
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
        </div>

        <vaadin-input-container
          part="input-field"
          readonly="[[readonly]]"
          disabled="[[disabled]]"
          invalid="[[invalid]]"
          theme$="[[theme]]"
        >
          <slot name="prefix" slot="prefix"></slot>
          <div class="textarea-wrapper">
            <slot name="textarea"></slot>
          </div>
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

  get slots() {
    const slots = super.slots;

    delete slots.input;

    return {
      ...slots,
      textarea: () => {
        const native = document.createElement('textarea');
        const value = this.getAttribute('value');
        if (value) {
          native.setAttribute('value', value);
        }
        const name = this.getAttribute('name');
        if (name) {
          native.setAttribute('name', name);
        }
        return native;
      }
    };
  }

  /**
   * Used by `ClearButtonMixin` as a reference to the clear button element.
   * @protected
   */
  get clearElement() {
    return this.$.clearButton;
  }

  /**
   * Override getter provided by `InputMixin` to use a different slot.
   * @protected
   */
  get _inputNode() {
    return this._getDirectSlotChild('textarea');
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();

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
   */
  _valueChanged(newVal, oldVal) {
    super._valueChanged(newVal, oldVal);

    this._updateHeight();
  }

  /** @private */
  _updateHeight() {
    if (this._inputNode) {
      /* https://css-tricks.com/the-cleanest-trick-for-autogrowing-textareas/ */
      this.__textAreaWrapper = this.__textAreaWrapper || this.shadowRoot.querySelector('.textarea-wrapper');
      this.__textAreaWrapper.dataset.replicatedValue = this._inputNode.value;
      // getComputedStyle is expensive, maybe we can use ResizeObserver in the future
      this._dispatchIronResizeEventIfNeeded('InputHeight', getComputedStyle(this.__textAreaWrapper).height);
    }
  }
}
