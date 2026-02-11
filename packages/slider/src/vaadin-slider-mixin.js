/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DisabledMixin } from '@vaadin/a11y-base/src/disabled-mixin.js';
import { SlotStylesMixin } from '@vaadin/component-base/src/slot-styles-mixin.js';

/**
 * @polymerMixin
 * @mixes DisabledMixin
 * @mixes SlotStylesMixin
 */
export const SliderMixin = (superClass) =>
  class SliderMixinClass extends SlotStylesMixin(DisabledMixin(superClass)) {
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

        /**
         * When true, the value bubble is always visible,
         * regardless of focus or hover state.
         * @attr {boolean} value-always-visible
         */
        valueAlwaysVisible: {
          type: Boolean,
          value: false,
          sync: true,
        },

        /**
         * When true, displays the min and max values below the slider track.
         * @attr {boolean} min-max-visible
         */
        minMaxVisible: {
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

    /** @protected */
    get slotStyles() {
      const tag = this.localName;

      return [
        `
          ${tag} > input::-webkit-slider-runnable-track {
            height: 100%;
          }

          ${tag} > input::-webkit-slider-thumb {
            appearance: none;
            width: var(--_thumb-width);
            height: 100%;
            /* iOS needs these */
            background: transparent;
            box-shadow: none;
          }

          ${tag} > input::-moz-range-thumb {
            border: 0;
            background: transparent;
            width: var(--_thumb-width);
            height: 100%;
          }

          ${tag}:not([readonly]) > input::-webkit-slider-thumb {
            cursor: var(--vaadin-slider-thumb-cursor, grab);
          }

          ${tag}:not([readonly]) > input::-moz-range-thumb {
            cursor: var(--vaadin-slider-thumb-cursor, grab);
          }

          ${tag}:is([active], [start-active], [end-active]) > input::-webkit-slider-thumb {
            cursor: var(--vaadin-slider-thumb-cursor-active, grabbing);
          }

          ${tag}:is([active], [start-active], [end-active]) > input::-moz-range-thumb {
            cursor: var(--vaadin-slider-thumb-cursor-active, grabbing);
          }

          ${tag}[disabled] > input::-webkit-slider-thumb {
            cursor: var(--vaadin-disabled-cursor, not-allowed);
          }

          ${tag}[disabled] > input::-moz-range-thumb {
            cursor: var(--vaadin-disabled-cursor, not-allowed);
          }
        `,
      ];
    }

    constructor() {
      super();

      this.addEventListener('pointerdown', (e) => this.__onPointerDown(e));
    }

    /** @protected */
    firstUpdated() {
      super.firstUpdated();

      this.__lastCommittedValue = this.value;
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
        min: this.min !== undefined ? this.min : 0,
        max: this.max !== undefined ? this.max : 100,
        step: this.step !== undefined ? this.step : 1,
      };
    }

    /**
     * @param {number} value
     * @return {number}
     * @private
     */
    __getPercentFromValue(value) {
      const { min, max } = this.__getConstraints();
      const safeValue = Math.min(Math.max(value, min), max);
      return (safeValue - min) / (max - min);
    }

    /**
     * Updates bubble visibility for a thumb based on trigger state changes.
     * @param {Map} props - Changed properties from willUpdate
     * @param {object} config
     * @param {string} config.active - Active state property name
     * @param {string} config.focused - Focused state property name
     * @param {string} config.hover - Hover state property name
     * @param {string} config.opened - Bubble opened property name
     * @param {string} [config.otherOpened] - Other thumb's opened property (range slider)
     * @private
     */
    __updateBubbleState(props, { active, focused, hover, opened, otherOpened }) {
      if (props.has(active)) {
        if (this[active]) {
          // When slider is activated by track pointerdown, the hover flag
          // isn't set, but the thumb is actually moved, so we set it here.
          this[hover] = true;
        } else if (props.get(active)) {
          // Close bubble when drag ends unless the thumb has hover
          this[opened] = this[hover];
        }
      }

      if (props.has(focused)) {
        if (this[focused]) {
          this[opened] = true;
          if (otherOpened) {
            this[otherOpened] = false;
          }
        } else if (props.get(focused)) {
          // Close bubble on blur unless the thumb has hover
          this[opened] = this[hover];
        }
      }

      if (props.has(hover)) {
        if (this[hover]) {
          this[opened] = true;
          if (otherOpened) {
            this[otherOpened] = false;
          }
        } else if (props.get(hover)) {
          // Keep bubble open during drag (active state)
          this[opened] = this[active];
        }
      }
    }

    /**
     * @param {PointerEvent} event
     * @private
     */
    __onPointerDown(event) {
      if (!event.composedPath().includes(this.$.controls)) {
        return;
      }

      // Prevent modifying value when readonly
      if (this.readonly) {
        event.preventDefault();
      }
    }

    /** @private */
    __dispatchInputEvent() {
      this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
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
    __onChange(event) {
      event.stopPropagation();
      this.__detectAndDispatchChange();
    }

    /**
     * Fired when the slider value changes during user interaction.
     *
     * @event input
     */

    /**
     * Fired when the user commits a value change.
     *
     * @event change
     */
  };
