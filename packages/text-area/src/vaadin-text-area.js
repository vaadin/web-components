/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/input-container/src/vaadin-input-container.js';
import { html, PolymerElement } from '@polymer/polymer';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';
import { InputFieldMixin } from '@vaadin/field-base/src/input-field-mixin.js';
import { LabelledInputController } from '@vaadin/field-base/src/labelled-input-controller.js';
import { PatternMixin } from '@vaadin/field-base/src/pattern-mixin.js';
import { inputFieldShared } from '@vaadin/field-base/src/styles/input-field-shared-styles.js';
import { TextAreaController } from '@vaadin/field-base/src/text-area-controller.js';
import { registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles('vaadin-text-area', inputFieldShared, { moduleId: 'vaadin-text-area-styles' });

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
 * The following custom properties are available for styling:
 *
 * Custom property                | Description                | Default
 * -------------------------------|----------------------------|---------
 * `--vaadin-field-default-width` | Default width of the field | `12em`
 *
 * `<vaadin-text-area>` provides the same set of shadow DOM parts and state attributes as `<vaadin-text-field>`.
 * See [`<vaadin-text-field>`](#/elements/vaadin-text-field) for the styling documentation.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/custom-theme/styling-components) documentation.
 *
 * @fires {Event} input - Fired when the value is changed by the user: on every typing keystroke, and the value is cleared using the clear button.
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 * @fires {CustomEvent} validated - Fired whenever the field is validated.
 *
 * @extends HTMLElement
 * @mixes InputFieldMixin
 * @mixes ElementMixin
 * @mixes PatternMixin
 * @mixes ThemableMixin
 * @mixes ResizeMixin
 */
export class TextArea extends ResizeMixin(PatternMixin(InputFieldMixin(ThemableMixin(ElementMixin(PolymerElement))))) {
  static get is() {
    return 'vaadin-text-area';
  }

  static get template() {
    return html`
      <style>
        :host {
          animation: 1ms vaadin-text-area-appear;
        }

        .vaadin-text-area-container {
          flex: auto;
        }

        /* The label, helper text and the error message should neither grow nor shrink. */
        [part='label'],
        [part='helper-text'],
        [part='error-message'] {
          flex: none;
        }

        [part='input-field'] {
          flex: auto;
          overflow: auto;
          -webkit-overflow-scrolling: touch;
        }

        ::slotted(textarea) {
          -webkit-appearance: none;
          -moz-appearance: none;
          flex: auto;
          overflow: hidden;
          width: 100%;
          height: 100%;
          outline: none;
          resize: none;
          margin: 0;
          padding: 0 0.25em;
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

        /* Override styles from <vaadin-input-container> */
        [part='input-field'] ::slotted(textarea) {
          align-self: stretch;
          white-space: pre-wrap;
        }

        [part='input-field'] ::slotted(:not(textarea)) {
          align-self: flex-start;
        }

        /* Workaround https://bugzilla.mozilla.org/show_bug.cgi?id=1739079 */
        :host([disabled]) ::slotted(textarea) {
          user-select: none;
        }

        @keyframes vaadin-text-area-appear {
          to {
            opacity: 1;
          }
        }
      </style>

      <div class="vaadin-text-area-container">
        <div part="label">
          <slot name="label"></slot>
          <span part="required-indicator" aria-hidden="true"></span>
        </div>

        <vaadin-input-container
          part="input-field"
          readonly="[[readonly]]"
          disabled="[[disabled]]"
          invalid="[[invalid]]"
          theme$="[[_theme]]"
          on-scroll="__scrollPositionUpdated"
        >
          <slot name="prefix" slot="prefix"></slot>
          <slot name="textarea"></slot>
          <slot name="suffix" slot="suffix"></slot>
          <div id="clearButton" part="clear-button" slot="suffix" aria-hidden="true"></div>
        </vaadin-input-container>

        <div part="helper-text">
          <slot name="helper"></slot>
        </div>

        <div part="error-message">
          <slot name="error-message"></slot>
        </div>
      </div>

      <slot name="tooltip"></slot>
    `;
  }

  static get properties() {
    return {
      /**
       * Maximum number of characters (in Unicode code points) that the user can enter.
       */
      maxlength: {
        type: Number,
      },

      /**
       * Minimum number of characters (in Unicode code points) that the user can enter.
       */
      minlength: {
        type: Number,
      },
    };
  }

  static get delegateAttrs() {
    return [...super.delegateAttrs, 'maxlength', 'minlength'];
  }

  static get constraints() {
    return [...super.constraints, 'maxlength', 'minlength'];
  }

  /**
   * Used by `InputControlMixin` as a reference to the clear button element.
   * @protected
   */
  get clearElement() {
    return this.$.clearButton;
  }

  /**
   * @protected
   * @override
   */
  _onResize() {
    this.__scrollPositionUpdated();
  }

  /** @protected */
  ready() {
    super.ready();

    this.addController(
      new TextAreaController(this, (input) => {
        this._setInputElement(input);
        this._setFocusElement(input);
        this.stateTarget = input;
        this.ariaTarget = input;
      }),
    );
    this.addController(new LabelledInputController(this.inputElement, this._labelController));

    this._tooltipController = new TooltipController(this);
    this._tooltipController.setPosition('top');
    this.addController(this._tooltipController);

    this.addEventListener('animationend', this._onAnimationEnd);

    this._inputField = this.shadowRoot.querySelector('[part=input-field]');

    // Wheel scrolling results in async scroll events. Preventing the wheel
    // event, scrolling manually and then synchronously updating the scroll position CSS variable
    // allows us to avoid some jumpy behavior that would occur on wheel otherwise.
    this._inputField.addEventListener('wheel', (e) => {
      const scrollTopBefore = this._inputField.scrollTop;
      this._inputField.scrollTop += e.deltaY;

      if (scrollTopBefore !== this._inputField.scrollTop) {
        e.preventDefault();
        this.__scrollPositionUpdated();
      }
    });

    this._updateHeight();
    this.__scrollPositionUpdated();
  }

  /** @private */
  __scrollPositionUpdated() {
    this._inputField.style.setProperty('--_text-area-vertical-scroll-position', '0px');
    this._inputField.style.setProperty('--_text-area-vertical-scroll-position', `${this._inputField.scrollTop}px`);
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
      input.style.height = `${inputHeight}px`;
    }

    // Restore
    input.style.removeProperty('max-width');
    inputField.style.removeProperty('display');
    inputField.style.removeProperty('height');
    inputField.scrollTop = scrollTop;
  }

  /**
   * Returns true if the current textarea value satisfies all constraints (if any).
   * @return {boolean}
   */
  checkValidity() {
    if (!super.checkValidity()) {
      return false;
    }

    // Native <textarea> does not support pattern attribute, so we have a custom logic
    // according to WHATWG spec for <input>, with tests inspired by web-platform-tests
    // https://html.spec.whatwg.org/multipage/input.html#the-pattern-attribute

    if (!this.pattern || !this.inputElement.value) {
      // Mark as valid if there is no pattern, or the value is empty
      return true;
    }

    try {
      const match = this.inputElement.value.match(this.pattern);
      return match ? match[0] === match.input : false;
    } catch (_) {
      // If the pattern can not be compiled, then report as valid
      return true;
    }
  }
}

customElements.define(TextArea.is, TextArea);
