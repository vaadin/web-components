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
          notify: true,
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

      this.__onPointerMove = this.__onPointerMove.bind(this);
      this.__onPointerUp = this.__onPointerUp.bind(this);

      this.addEventListener('pointerdown', (e) => this.__onPointerDown(e));
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
     * @param {boolean} commit
     * @private
     */
    __updateValue(index, value, commitValue) {
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

      if (commitValue) {
        this.value = this.__values.join(',');
      }
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

    /**
     * @param {number} percent
     * @return {number}
     * @private
     */
    __getValueFromPercent(percent) {
      const min = this.min || 0;
      const max = this.max || 100;
      return min + percent * (max - min);
    }

    /** @private */
    __applyValue(offset) {
      const size = this.offsetWidth;
      const safeOffset = Math.min(Math.max(offset, 0), size);
      const percent = safeOffset / size;
      const newValue = this.__getValueFromPercent(percent);
      this.__updateValue(0, newValue, true);
    }

    /**
     * @param {PointerEvent} event
     * @private
     */
    __onPointerDown(event) {
      this.setPointerCapture(event.pointerId);
      this.addEventListener('pointermove', this.__onPointerMove);
      window.addEventListener('pointerup', this.__onPointerUp);
      window.addEventListener('pointercancel', this.__onPointerUp);

      this.__lastCommittedValue = this.value;

      const thumb = event
        .composedPath()
        .find((node) => node.nodeType === Node.ELEMENT_NODE && node.getAttribute('part') === 'thumb');

      // Update value on track click
      if (!thumb) {
        const { offsetX } = event;
        this.__applyValue(offsetX);
      }
    }

    /**
     * @param {PointerEvent} event
     * @private
     */
    __onPointerMove(event) {
      if (event.target !== this) {
        return;
      }
      event.preventDefault(); // Prevent text selection
      this.__applyValue(event.offsetX);
    }

    /**
     * @param {PointerEvent} event
     * @private
     */
    __onPointerUp(event) {
      this.releasePointerCapture(event.pointerId);
      this.removeEventListener('pointermove', this.__onPointerMove);
      window.removeEventListener('pointerup', this.__onPointerUp);
      window.removeEventListener('pointercancel', this.__onPointerUp);

      if (this.__lastCommittedValue !== this.value) {
        this.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  };
