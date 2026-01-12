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
          value: 0,
        },

        /**
         * The maximum allowed value.
         */
        max: {
          type: Number,
          value: 100,
        },

        /**
         * The value of the slider.
         */
        value: {
          type: String,
        },
      };
    }
  };
