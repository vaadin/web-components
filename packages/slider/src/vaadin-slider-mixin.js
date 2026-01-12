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
        },

        /**
         * The maximum allowed value.
         */
        max: {
          type: Number,
        },

        /**
         * The stepping interval of the slider.
         */
        step: {
          type: Number,
        },

        /**
         * The value of the slider.
         */
        value: {
          type: String,
        },
      };
    }

    /** @private */
    get __thumbs() {
      return [...this.shadowRoot.querySelectorAll('[part="thumb"]')];
    }

    constructor() {
      super();

      /** @type {string[]} */
      this.__values = [];
    }

    /** @protected */
    updated(props) {
      super.updated(props);

      if (props.has('value') || props.has('min') || props.has('max')) {
        const value = this.value || '0';
        this.__updateValue(0, value);
      }
    }

    /**
     * @param {number} index
     * @param {number} value
     * @private
     */
    __updateValue(index, value) {
      const min = this.min || 0;
      const max = this.max || 100;
      const step = this.step || 1;

      const thumbMinValue = min;
      const thumbMaxValue = max;

      const safeValue = Math.min(Math.max(value, thumbMinValue), thumbMaxValue);

      const offset = safeValue - min;
      const nearestOffset = Math.round(offset / step) * step;
      const nearestValue = min + nearestOffset;

      const newValue = Math.round(nearestValue);

      this.__values[index] = newValue;
      this.__updateThumb(index, newValue);
      this.__updateTrackFill();
    }

    /**
     * @param {number} index
     * @param {number} value
     * @private
     */
    __updateThumb(index, value) {
      if (!this.__thumbs[index]) {
        return;
      }
      this.__thumbs[index].style.setProperty('inset-inline-start', `${this.__getPercentFromValue(value)}%`);
    }

    /** @private */
    __updateTrackFill() {
      const trackFillStart = 0;
      const trackFillEnd = `${100 - this.__getPercentFromValue(this.__values[0])}%`;
      // Ensure thumb always covers the fill
      const trackFillEndClamp = `clamp(var(--_thumb-size) / 2, ${trackFillEnd}, 100% - var(--_thumb-size) / 2)`;
      this.$.fill.style.setProperty('inset-inline', `${trackFillStart} ${trackFillEndClamp}`);
    }

    /**
     * @param {number} value
     * @return {number}
     * @private
     */
    __getPercentFromValue(value) {
      const min = this.min || 0;
      const max = this.max || 100;
      return (100 * (value - min)) / (max - min);
    }
  };
