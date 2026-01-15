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

      this.__onPointerMove = this.__onPointerMove.bind(this);
      this.__onPointerUp = this.__onPointerUp.bind(this);

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
     * @private
     */
    __updateValue(value, index) {
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
     * @param {PointerEvent} event
     * @private
     */
    __onPointerDown(event) {
      // Only handle pointerdown on the thumb, track or track-fill
      const part = event.composedPath()[0].getAttribute('part');
      if (!part || (!part.startsWith('track') && !part.startsWith('thumb'))) {
        return;
      }

      this.setPointerCapture(event.pointerId);
      this.addEventListener('pointermove', this.__onPointerMove);
      this.addEventListener('pointerup', this.__onPointerUp);
      this.addEventListener('pointercancel', this.__onPointerUp);

      this.__thumbIndex = this.__getThumbIndex(event);

      // Update value on track click
      if (part.startsWith('track')) {
        const newValue = this.__getEventValue(event);
        this.__updateValue(newValue, this.__thumbIndex);
        this.__commitValue();
        this.__detectAndDispatchChange();
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

    /** @protected */
    __detectAndDispatchChange() {
      if (JSON.stringify(this.__lastCommittedValue) !== JSON.stringify(this.value)) {
        this.__lastCommittedValue = this.value;
        this.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }

    /** @private */
    __onInput(event) {
      const index = this.__getThumbIndex(event);
      this.__updateValue(event.target.value, index);
      this.__commitValue();
    }

    /** @private */
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
