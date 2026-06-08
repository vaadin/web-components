/**
 * @license
 * Copyright (c) 2017 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { OverlayMixin } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';
import { setOverlayStateAttribute } from '@vaadin/overlay/src/vaadin-overlay-utils.js';

/**
 * A mixin providing overflow detection for dialog-like overlays. Sets the
 * `overflow` attribute to `top`, `bottom`, or `top bottom` depending on how the
 * content part is scrolled, so that overflow indicators can be styled in CSS.
 */
export const DialogOverlayBaseMixin = (superClass) =>
  class DialogOverlayBaseMixin extends OverlayMixin(superClass) {
    /** @protected */
    ready() {
      super.ready();

      // Update overflow attribute on resize
      this.__resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(() => {
          this._onOverlayResize();
        });
      });
      this.__resizeObserver.observe(this.$.resizerContainer);

      // Update overflow attribute on scroll
      this.$.content.addEventListener('scroll', () => {
        this.__updateOverflow();
      });

      // Update overflow attribute on content change
      this.shadowRoot.addEventListener('slotchange', () => {
        this.__updateOverflow();
      });
    }

    /**
     * Override to implement custom logic on dialog overlay resize.
     * @protected
     */
    _onOverlayResize() {
      this.__updateOverflow();
    }

    /** @private */
    __updateOverflow() {
      let overflow = '';

      const content = this.$.content;

      if (content.scrollTop > 0) {
        overflow += ' top';
      }

      if (content.scrollTop < content.scrollHeight - content.clientHeight) {
        overflow += ' bottom';
      }

      const value = overflow.trim();
      if (value.length > 0 && this.getAttribute('overflow') !== value) {
        setOverlayStateAttribute(this, 'overflow', value);
      } else if (value.length === 0 && this.hasAttribute('overflow')) {
        setOverlayStateAttribute(this, 'overflow', null);
      }
    }
  };
