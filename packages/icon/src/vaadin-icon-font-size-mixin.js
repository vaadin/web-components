/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';
import { needsFontIconSizingFallback } from './vaadin-icon-helpers.js';

const usesFontIconSizingFallback = needsFontIconSizingFallback();

/**
 * Mixin which enables the font icon sizing fallback for browsers that do not support CSS Container Queries.
 * In older versions of Safari, it didn't support Container Queries units used in pseudo-elements. It has been fixed in
 * recent versions, but there's an regression in Safari 26, which caused the same issue to happen when the icon is
 * attached to an element with shadow root.
 * The mixin does nothing if the browser supports CSS Container Query units for pseudo elements.
 *
 * @polymerMixin
 */
export const IconFontSizeMixin = (superclass) =>
  !usesFontIconSizingFallback
    ? superclass
    : class extends ResizeMixin(superclass) {
        static get styles() {
          return css`
            :host::after,
            :host::before {
              font-size: var(--vaadin-icon-visual-size, var(--_vaadin-font-icon-size));
            }
          `;
        }

        /** @protected */
        updated(props) {
          super.updated(props);

          if (props.has('char') || props.has('iconClass') || props.has('ligature')) {
            this.__updateFontIconSize();
          }
        }

        /**
         * @protected
         * @override
         */
        _onResize() {
          // Update when the element is resized
          this.__updateFontIconSize();
        }

        /**
         * Updates the --_vaadin-font-icon-size CSS variable value if font icons are used.
         *
         * @private
         */
        __updateFontIconSize() {
          if (this.char || this.iconClass || this.ligature) {
            const { paddingTop, paddingBottom, height } = getComputedStyle(this);
            const fontIconSize = parseFloat(height) - parseFloat(paddingTop) - parseFloat(paddingBottom);
            this.style.setProperty('--_vaadin-font-icon-size', `${fontIconSize}px`);
          }
        }
      };
