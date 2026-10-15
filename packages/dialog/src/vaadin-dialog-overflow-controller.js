/**
 * @license
 * Copyright (c) 2017 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { setOverlayStateAttribute } from '@vaadin/overlay/src/vaadin-overlay-utils.js';

/**
 * A controller that detects if the content part of a dialog overlay overflows
 * its scrolling viewport vertically, and sets the `overflow` attribute on the
 * overlay (and its owner) with `top`, `bottom`, or `top bottom` accordingly, so
 * that overflow indicators can be styled in CSS.
 */
export class DialogOverflowController {
  constructor(host) {
    /**
     * The overlay element that hosts the controller.
     * @type {HTMLElement}
     */
    this.host = host;
  }

  hostConnected() {
    if (!this.__initialized) {
      this.__initialized = true;

      const { host } = this;

      // Update overflow attribute on resize
      this.__resizeObserver = new ResizeObserver(() => this.__updateState());
      this.__resizeObserver.observe(host.$.resizerContainer);

      // Update overflow attribute on scroll
      host.$.content.addEventListener('scroll', () => this.__updateState(true));

      // Update overflow attribute on content change
      host.shadowRoot.addEventListener('slotchange', () => this.__updateState(true));
    }
  }

  /**
   * Forces a synchronous overflow update. Call after changing content that
   * affects whether the content part overflows.
   */
  update() {
    this.__updateState(true);
  }

  /** @private */
  __updateState(sync = false) {
    cancelAnimationFrame(this.__updateRaf);

    if (sync) {
      this.__writeState(this.__readState());
    } else {
      // Defer reading until the animation frame so that layout has settled
      // after a resize (some browsers report stale metrics synchronously).
      this.__updateRaf = requestAnimationFrame(() => this.__writeState(this.__readState()));
    }
  }

  /** @private */
  __readState() {
    const content = this.host.$.content;

    let overflow = '';

    if (content.scrollTop > 0) {
      overflow += ' top';
    }

    if (content.scrollTop < content.scrollHeight - content.clientHeight) {
      overflow += ' bottom';
    }

    return overflow.trim();
  }

  /** @private */
  __writeState(value) {
    const { host } = this;

    if (value.length > 0) {
      setOverlayStateAttribute(host, 'overflow', value);
    } else {
      setOverlayStateAttribute(host, 'overflow', null);
    }
  }
}
