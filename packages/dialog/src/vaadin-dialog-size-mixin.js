/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * @polymerMixin
 */
export const DialogSizeMixin = (superClass) =>
  class DialogSizeMixinClass extends superClass {
    static get properties() {
      return {
        /**
         * Set the width of the overlay.
         * If a unitless number is provided, pixels are assumed.
         */
        width: {
          type: String,
        },

        /**
         * Set the height of the overlay.
         * If a unitless number is provided, pixels are assumed.
         */
        height: {
          type: String,
        },
      };
    }

    static get observers() {
      return ['__sizeChanged(width, height)'];
    }

    /** @private */
    __positionChanged(top, left) {
      requestAnimationFrame(() => this.$.overlay.setBounds({ top, left }));
    }

    /** @private */
    __sizeChanged(width, height) {
      requestAnimationFrame(() => this.$.overlay.setBounds({ width, height }, false));
    }
  };
