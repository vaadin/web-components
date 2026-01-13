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
          sync: true,
        },

        /** @private */
        __value: {
          type: Number,
          value: () => [],
          sync: true,
        },
      };
    }

    constructor() {
      super();

      this.__thumbIndex = 0;

      this.__onPointerMove = this.__onPointerMove.bind(this);
      this.__onPointerUp = this.__onPointerUp.bind(this);

      this.addEventListener('pointerdown', (e) => this.__onPointerDown(e));
    }

    /**
     * Increments the value
     * @param {number} amount - The amount to increment by.
     */
    stepUp(amount) {
      this.__lastCommittedValue = this.value;
      const increment = amount || this.step || 1;
      const newValue = this.__value[this.__thumbIndex] + increment;
      this.__updateValue(newValue);
      this.__commitValue();
      this.__detectAndDispatchChange();
    }

    /**
     * Decrements the value
     * @param {number} amount - The amount to decrement by.
     */
    stepDown(amount) {
      this.__lastCommittedValue = this.value;
      const decrement = amount || this.step || 1;
      const newValue = this.__value[this.__thumbIndex] - decrement;
      this.__updateValue(newValue);
      this.__commitValue();
      this.__detectAndDispatchChange();
    }

    /** @protected */
    updated(props) {
      super.updated(props);

      if (props.has('value') || props.has('min') || props.has('max')) {
        const values = (this.value || '').split(',');
        values.forEach((value, idx) => {
          this.__updateValue(value, idx);
        });
      }
    }

    /**
     * @param {number} value
     * @param {number} index
     * @private
     */
    __updateValue(value, index = this.__thumbIndex) {
      const min = this.min || 0;
      const max = this.max || 100;
      const step = this.step || 1;

      const minValue = this.__value[index - 1] || min;
      const maxValue = this.__value[index + 1] || max;

      const safeValue = Math.min(Math.max(value, minValue), maxValue);

      const offset = safeValue - min;
      const nearestOffset = Math.round(offset / step) * step;
      const nearestValue = min + nearestOffset;

      const newValue = Math.round(nearestValue);

      const valueCopy = [...this.__value];
      valueCopy[index] = newValue;
      this.__value = valueCopy;
    }

    /** @private */
    __commitValue() {
      this.value = this.__value.join(',');
    }

    /**
     * @param {number} value
     * @return {number}
     * @protected
     */
    __getPercentFromValue(value) {
      const min = this.min || 0;
      const max = this.max || 100;
      return (100 * (value - min)) / (max - min);
    }

    /**
     * @param {number} percent
     * @return {number}
     * @protected
     */
    __getValueFromPercent(percent) {
      const min = this.min || 0;
      const max = this.max || 100;
      return min + percent * (max - min);
    }

    /**
     * @param {PointerEvent} event
     * @return {number}
     * @protected
     */
    _getEventPercent(event) {
      const offset = event.offsetX;
      const size = this.offsetWidth;
      const safeOffset = Math.min(Math.max(offset, 0), size);
      return safeOffset / size;
    }

    /** @private */
    __applyValue(event) {
      const percent = this._getEventPercent(event);
      const newValue = this.__getValueFromPercent(percent);
      this.__updateValue(newValue);
      this.__commitValue();
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

      this._handlePointerDown(event);
    }

    /**
     * @param {PointerEvent} event
     * @protected
     */
    _handlePointerDown(event) {
      const target = event.composedPath()[0];
      // Update value on track click
      if (target.getAttribute('part') !== 'thumb') {
        this.__applyValue(event);
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
      this.__applyValue(event);
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

      this.__detectAndDispatchChange();
    }

    /** @private */
    __detectAndDispatchChange() {
      if (this.__lastCommittedValue !== this.value) {
        this.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  };
