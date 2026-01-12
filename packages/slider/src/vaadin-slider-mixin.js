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

        /** @private */
        __value: {
          type: Number,
          value: 0,
        },
      };
    }

    constructor() {
      super();

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
      const newValue = this.__value + increment;
      this.__updateValue(newValue, true);
      this.__detectAndDispatchChange();
    }

    /**
     * Decrements the value
     * @param {number} amount - The amount to decrement by.
     */
    stepDown(amount) {
      this.__lastCommittedValue = this.value;
      const decrement = amount || this.step || 1;
      const newValue = this.__value - decrement;
      this.__updateValue(newValue, true);
      this.__detectAndDispatchChange();
    }

    /** @protected */
    updated(props) {
      super.updated(props);

      if (props.has('value') || props.has('min') || props.has('max')) {
        const value = this.value || '0';
        this.__updateValue(value);
      }
    }

    /**
     * @param {number} value
     * @param {boolean} commit
     * @private
     */
    __updateValue(value, commit) {
      const min = this.min || 0;
      const max = this.max || 100;
      const step = this.step || 1;

      const safeValue = Math.min(Math.max(value, min), max);

      const offset = safeValue - min;
      const nearestOffset = Math.round(offset / step) * step;
      const nearestValue = min + nearestOffset;

      const newValue = Math.round(nearestValue);
      this.__value = newValue;

      if (commit) {
        this.value = `${this.__value}`;
      }
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

    /** @private */
    __applyValue(offset) {
      const size = this.offsetWidth;
      const safeOffset = Math.min(Math.max(offset, 0), size);
      const percent = safeOffset / size;
      const newValue = this.__getValueFromPercent(percent);
      this.__updateValue(newValue, true);
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

      this.__detectAndDispatchChange();
    }

    /** @private */
    __detectAndDispatchChange() {
      if (this.__lastCommittedValue !== this.value) {
        this.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  };
