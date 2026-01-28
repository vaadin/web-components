/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DisabledMixin } from '@vaadin/a11y-base/src/disabled-mixin.js';

/**
 * @polymerMixin
 * @mixes DisabledMixin
 */
export const SliderMixin = (superClass) =>
  class SliderMixinClass extends DisabledMixin(superClass) {
    static get properties() {
      return {
        /**
         * The minimum allowed value.
         */
        min: {
          type: Number,
          sync: true,
        },

        /**
         * The maximum allowed value.
         */
        max: {
          type: Number,
          sync: true,
        },

        /**
         * The stepping interval of the slider.
         */
        step: {
          type: Number,
          sync: true,
        },

        /**
         * When true, the user cannot modify the value of the slider.
         * The difference between `disabled` and `readonly` is that the
         * read-only slider remains focusable and is announced by screen
         * readers.
         */
        readonly: {
          type: Boolean,
          reflectToAttribute: true,
        },

        /** @private */
        __value: {
          type: Array,
          sync: true,
        },
      };
    }

    constructor() {
      super();

      this.__onPointerMove = this.__onPointerMove.bind(this);
      this.__onPointerUp = this.__onPointerUp.bind(this);

      // Use separate mousedown listener for focusing the input, as
      // pointerdown fires too early and the global `keyboardActive`
      // flag isn't updated yet, which incorrectly shows focus-ring
      this.addEventListener('mousedown', (e) => this.__onMouseDown(e));
      this.addEventListener('pointerdown', (e) => this.__onPointerDown(e));
    }

    /** @protected */
    firstUpdated() {
      super.firstUpdated();

      this.__lastCommittedValue = this.value;
    }

    /**
     * @param {Event} event
     * @return {number}
     */
    __getThumbIndex(_event) {
      return 0;
    }

    /**
     * @param {number} value
     * @param {number} index
     * @param {number[]} fullValue
     * @private
     */
    __updateValue(value, index, fullValue = this.__value) {
      const { min, max, step } = this.__getConstraints();

      const minValue = fullValue[index - 1] !== undefined ? fullValue[index - 1] : min;
      const maxValue = fullValue[index + 1] !== undefined ? fullValue[index + 1] : max;

      const safeValue = Math.min(Math.max(value, minValue), maxValue);

      const offset = safeValue - minValue;
      const nearestOffset = Math.round(offset / step) * step;
      const nearestValue = minValue + nearestOffset;

      // Ensure the last value matching step is used below the max limit.
      // Example: max = 100, step = 1.5 - force maximum allowed value to 99.
      const newValue = nearestValue <= maxValue ? nearestValue : nearestValue - step;

      this.__value = fullValue.with(index, newValue);
    }

    /**
     * @return {{ min: number, max: number, step: number}}
     * @private
     */
    __getConstraints() {
      return {
        min: this.min || 0,
        max: this.max || 100,
        step: this.step || 1,
      };
    }

    /**
     * @param {number} value
     * @return {number}
     * @private
     */
    __getPercentFromValue(value) {
      const { min, max } = this.__getConstraints();
      return (100 * (value - min)) / (max - min);
    }

    /**
     * @param {number} percent
     * @return {number}
     * @private
     */
    __getValueFromPercent(percent) {
      const { min, max } = this.__getConstraints();
      return min + percent * (max - min);
    }

    /**
     * @param {PointerEvent} event
     * @return {number}
     * @private
     */
    __getEventPercent(event) {
      const offset = event.offsetX;
      const size = this.offsetWidth;
      const safeOffset = Math.min(Math.max(offset, 0), size);
      return safeOffset / size;
    }

    /**
     * @param {PointerEvent} event
     * @return {number}
     * @private
     */
    __getEventValue(event) {
      const percent = this.__getEventPercent(event);
      return this.__getValueFromPercent(percent);
    }

    /**
     * @param {number} percent
     * @return {string}
     * @private
     */
    __getThumbPosition(percent) {
      const controlSize = `calc(100% - var(--_thumb-width))`;
      return `calc(var(--_thumb-width) / 2 + ${controlSize} * ${percent} / 100)`;
    }

    /**
     * @param {PointerEvent} event
     * @private
     */
    __onMouseDown(event) {
      if (!event.composedPath().includes(this.$.controls)) {
        return;
      }

      // Prevent losing focus
      event.preventDefault();

      this.__focusInput(event);
    }

    /**
     * @param {PointerEvent} event
     * @private
     */
    __onPointerDown(event) {
      if (this.disabled || this.readonly || event.button !== 0) {
        return;
      }

      // Only handle pointerdown on the thumb, track or track-fill
      if (!event.composedPath().includes(this.$.controls)) {
        return;
      }

      this.setPointerCapture(event.pointerId);
      this.addEventListener('pointermove', this.__onPointerMove);
      this.addEventListener('pointerup', this.__onPointerUp);
      this.addEventListener('pointercancel', this.__onPointerUp);

      this.__thumbIndex = this.__getThumbIndex(event);

      // Update value on click within a track, but outside a thumb.
      if (event.composedPath()[0] === this.$.controls) {
        const newValue = this.__getEventValue(event);
        this.__updateValue(newValue, this.__thumbIndex);
        this.__commitValue();
      }
    }

    /**
     * @param {PointerEvent} event
     * @private
     */
    __onPointerMove(event) {
      const newValue = this.__getEventValue(event);
      this.__updateValue(newValue, this.__thumbIndex);
      this.__commitValue();
    }

    /**
     * @param {PointerEvent} event
     * @private
     */
    __onPointerUp(event) {
      this.__thumbIndex = null;

      this.releasePointerCapture(event.pointerId);
      this.removeEventListener('pointermove', this.__onPointerMove);
      this.removeEventListener('pointerup', this.__onPointerUp);
      this.removeEventListener('pointercancel', this.__onPointerUp);

      this.__detectAndDispatchChange();
    }

    /**
     * @param {Event} event
     * @private
     */
    __focusInput(_event) {
      this.focus({ focusVisible: false });
    }

    /** @private */
    __detectAndDispatchChange() {
      if (JSON.stringify(this.__lastCommittedValue) !== JSON.stringify(this.value)) {
        this.__lastCommittedValue = this.value;
        this.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }

    /**
     * @param {Event} event
     * @private
     */
    __onInput(event) {
      const index = this.__getThumbIndex(event);
      this.__updateValue(event.target.value, index);
      this.__commitValue();
    }

    /**
     * @param {Event} event
     * @private
     */
    __onChange(event) {
      event.stopPropagation();
      this.__detectAndDispatchChange();
    }

    /**
     * Fired when the user commits a value change.
     *
     * @event change
     */
  };
