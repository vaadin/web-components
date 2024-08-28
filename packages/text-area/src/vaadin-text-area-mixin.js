/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
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
      };
    }

    static get delegateAttrs() {
      return [...super.delegateAttrs, 'maxlength', 'minlength', 'pattern'];
    }

    static get constraints() {
      return [...super.constraints, 'maxlength', 'minlength', 'pattern'];
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
    }

    /** @protected */
    _onScroll() {}

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

      this.addEventListener('animationend', this._onAnimationEnd);

      this._scrollContainer = this.shadowRoot.querySelector('#scroll-container');

      this._updateHeight();
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
      const scrollContainer = this._scrollContainer;

      if (!input || !scrollContainer) {
        return;
      }

      const scrollTop = scrollContainer.scrollTop;

      // Only clear the height when the content shortens to minimize scrollbar flickering.
      const valueLength = this.value ? this.value.length : 0;

      if (this._oldValueLength >= valueLength) {
        const scrollContainerHeight = getComputedStyle(scrollContainer).height;
        const inputWidth = getComputedStyle(input).width;

        // Temporarily fix the height of the wrapping scroll container to prevent changing the browsers scroll
        // position while resetting the textareas height. If the textarea had a large height, then removing its height
        // will reset its height to the default of two rows. That might reduce the height of the page, and the
        // browser might adjust the scroll position before we can restore the measured height of the textarea.
        scrollContainer.style.display = 'block';
        scrollContainer.style.height = scrollContainerHeight;

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
      scrollContainer.style.removeProperty('display');
      scrollContainer.style.removeProperty('height');
      scrollContainer.scrollTop = scrollTop;
    }

    /**
     * Scrolls the textarea to the start if it has a vertical scrollbar.
     */
    scrollToStart() {
      this._scrollContainer.scrollTop = 0;
    }

    /**
     * Scrolls the textarea to the end if it has a vertical scrollbar.
     */
    scrollToEnd() {
      this._scrollContainer.scrollTop = this._scrollContainer.scrollHeight;
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
