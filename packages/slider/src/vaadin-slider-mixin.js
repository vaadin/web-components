/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * @polymerMixin
 */
export const SliderMixin = (superClass) =>
  class SliderMixinClass extends superClass {
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

        /** @private */
        __value: {
          type: Array,
          sync: true,
        },
      };
    }

    constructor() {
      super();

      this.__thumbIndex = 0;
    }

    /**
     * @param {number} value
     * @param {number} index
     * @private
     */
    __updateValue(value, index = this.__thumbIndex) {
      const { min, max, step } = this.__getConstraints();

      const minValue = this.__value[index - 1] || min;
      const maxValue = this.__value[index + 1] || max;

      const safeValue = Math.min(Math.max(value, minValue), maxValue);

      const offset = safeValue - min;
      const nearestOffset = Math.round(offset / step) * step;
      const nearestValue = min + nearestOffset;

      const newValue = Math.round(nearestValue);

      this.__value = this.__value.with(index, newValue);
    }

    /**
     * @return {{ min: number, max: number}}
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

    /** @private */
    __detectAndDispatchChange() {
      if (this.__lastCommittedValue !== this.value) {
        this.__lastCommittedValue = this.value;
        this.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }

    /** @private */
    __onInput(event) {
      this.__updateValue(event.target.value);
      this.__commitValue();
      this.__detectAndDispatchChange();
    }

    /** @private */
    __onChange(event) {
      event.stopPropagation();
    }
  };
