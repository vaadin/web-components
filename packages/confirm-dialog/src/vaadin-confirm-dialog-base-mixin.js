/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * @polymerMixin
 */
export const ConfirmDialogBaseMixin = (superClass) =>
  class ConfirmDialogBaseMixinClass extends superClass {
    static get properties() {
      return {
        /**
         * Set the `aria-label` attribute for assistive technologies like
         * screen readers. An empty string value for this property (the
         * default) means that the `aria-label` attribute is not present.
         */
        ariaLabel: {
          type: String,
          value: '',
        },

        /**
         * Height to be set on the overlay content.
         */
        contentHeight: {
          type: String,
        },

        /**
         * Width to be set on the overlay content.
         */
        contentWidth: {
          type: String,
        },
      };
    }

    static get observers() {
      return [
        '__updateContentHeight(contentHeight, _overlayElement)',
        '__updateContentWidth(contentWidth, _overlayElement)',
      ];
    }

    /** @private */
    __updateDimension(overlay, dimension, value) {
      const prop = `--_vaadin-confirm-dialog-content-${dimension}`;

      if (value) {
        overlay.style.setProperty(prop, value);
      } else {
        overlay.style.removeProperty(prop);
      }
    }

    /** @private */
    __updateContentHeight(height, overlay) {
      if (overlay) {
        this.__updateDimension(overlay, 'height', height);
      }
    }

    /** @private */
    __updateContentWidth(width, overlay) {
      if (overlay) {
        this.__updateDimension(overlay, 'width', width);
      }
    }
  };
