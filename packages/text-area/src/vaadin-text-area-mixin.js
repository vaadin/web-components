/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';
import { InputFieldMixin } from '@vaadin/field-base/src/input-field-mixin.js';
import { LabelledInputController } from '@vaadin/field-base/src/labelled-input-controller.js';
import { TextAreaController } from '@vaadin/field-base/src/text-area-controller.js';

/**
 * A mixin providing common text area functionality.
 *
 * @polymerMixin
 * @mixes InputFieldMixin
 * @mixes ResizeMixin
 */
export const TextAreaMixin = (superClass) =>
  class TextAreaMixinClass extends ResizeMixin(InputFieldMixin(superClass)) {
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

        /**
         * A regular expression that the value is checked against.
         * The pattern must match the entire value, not just some subset.
         */
        pattern: {
          type: String,
        },

        /**
         * Minimum number of rows to show. Default is two rows.
         *
         * When using a custom slotted textarea, the minimum number of rows are not applied for backwards compatibility.
         *
         * @attr {number} min-rows
         */
        minRows: {
          type: Number,
          value: 2,
          observer: '__minRowsChanged',
        },

        /**
         * Maximum number of rows to expand to before the text area starts scrolling. This effectively sets a max-height
         * on the `input-field` part. By default, it is not set, and the text area grows with the content without
         * constraints.
         * @attr {number} max-rows
         */
        maxRows: {
          type: Number,
        },
      };
    }

    static get delegateAttrs() {
      return [...super.delegateAttrs, 'maxlength', 'minlength', 'pattern'];
    }

    static get constraints() {
      return [...super.constraints, 'maxlength', 'minlength', 'pattern'];
    }

    static get observers() {
      return ['__updateMinHeight(minRows, inputElement)', '__updateMaxHeight(maxRows, inputElement, _inputField)'];
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
      this._updateHeight();
      this.__scrollPositionUpdated();
    }

    /** @protected */
    _onScroll() {
      this.__scrollPositionUpdated();
    }

    /** @protected */
    ready() {
      super.ready();

      this.__textAreaController = new TextAreaController(this, (input) => {
        this._setInputElement(input);
        this._setFocusElement(input);
        this.stateTarget = input;
        this.ariaTarget = input;
      });
      this.addController(this.__textAreaController);
      this.addController(new LabelledInputController(this.inputElement, this._labelController));

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

      const inputFieldScrollTop = inputField.scrollTop;
      const inputWidth = getComputedStyle(input).width;

      // Save page scroll around the brief textarea collapse below.
      // Pinning the input-field's height would capture the previous cycle's rendered height and feed it
      // back into this cycle's scrollHeight measurement, oscillating under fractional rounding.
      const pageScrollX = window.scrollX;
      const pageScrollY = window.scrollY;

      // Fix the input width so its scrollHeight isn't affected by
      // the host's disappearing scrollbars.
      input.style.maxWidth = inputWidth;

      // Clear the height of the textarea to allow measuring a reduced scroll height
      input.style.alignSelf = 'flex-start';
      input.style.height = 'auto';

      const inputHeight = input.scrollHeight;
      if (inputHeight > input.clientHeight) {
        input.style.height = `${inputHeight}px`;
      }

      // Restore
      input.style.removeProperty('max-width');
      input.style.removeProperty('align-self');
      inputField.scrollTop = inputFieldScrollTop;

      // Restore scroll if the brief collapse caused the browser to adjust it.
      if (window.scrollX !== pageScrollX || window.scrollY !== pageScrollY) {
        window.scrollTo({ left: pageScrollX, top: pageScrollY, behavior: 'instant' });
      }

      // Update max height in case this update was triggered by style changes
      // affecting line height, paddings or margins.
      this.__updateMaxHeight(this.maxRows);
    }

    /** @private */
    __updateMinHeight(minRows) {
      if (!this.inputElement) {
        return;
      }

      // For minimum height, just set the number of rows on the native textarea,
      // which causes the input container to grow as well.
      // Do not override this on custom slotted textarea as number of rows may
      // have been configured there.
      if (this.inputElement === this.__textAreaController.defaultNode) {
        this.inputElement.rows = Math.max(minRows, 1);
      }
    }

    /** @private */
    __updateMaxHeight(maxRows) {
      if (!this._inputField || !this.inputElement) {
        return;
      }

      if (maxRows) {
        // For maximum height, we need to constrain the height of the input
        // container to prevent it from growing further. For this we take the
        // line height of the native textarea times the number of rows, and add
        // other properties affecting the height of the input container.
        const inputStyle = getComputedStyle(this.inputElement);
        const inputFieldStyle = getComputedStyle(this._inputField);

        const lineHeight = parseFloat(inputStyle.lineHeight);
        const contentHeight = lineHeight * maxRows;
        const marginsAndPaddings =
          parseFloat(inputStyle.paddingTop) +
          parseFloat(inputStyle.paddingBottom) +
          parseFloat(inputStyle.marginTop) +
          parseFloat(inputStyle.marginBottom) +
          parseFloat(inputFieldStyle.borderTopWidth) +
          parseFloat(inputFieldStyle.borderBottomWidth) +
          parseFloat(inputFieldStyle.paddingTop) +
          parseFloat(inputFieldStyle.paddingBottom);
        const maxHeight = Math.ceil(contentHeight + marginsAndPaddings);
        this._inputField.style.setProperty('max-height', `${maxHeight}px`);
      } else {
        this._inputField.style.removeProperty('max-height');
      }
    }

    /**
     * @private
     */
    __minRowsChanged(minRows) {
      if (minRows < 1) {
        console.warn('<vaadin-text-area> minRows must be at least 1.');
      }
    }

    /**
     * Scrolls the textarea to the start if it has a vertical scrollbar.
     */
    scrollToStart() {
      this._inputField.scrollTop = 0;
    }

    /**
     * Scrolls the textarea to the end if it has a vertical scrollbar.
     */
    scrollToEnd() {
      this._inputField.scrollTop = this._inputField.scrollHeight;
    }

    /**
     * Returns true if the current textarea value satisfies all constraints (if any).
     * @return {boolean}
     * @override
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
  };
