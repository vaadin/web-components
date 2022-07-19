/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import { animationFrame } from './async.js';
import { Debouncer } from './debounce.js';

/**
 * A controller that detects if content inside the element overflows its scrolling viewport,
 * and sets the `overflow` attribute on the host with a value that indicates the directions
 * where content is overflowing. Supported values are: `top`, `bottom`, `start`, `end`.
 */
export class OverflowController {
  constructor(host, scrollTarget) {
    /**
     * The controller host element.
     *
     * @type {HTMLElement}
     */
    this.host = host;

    /**
     * The element that wraps scrollable content.
     * If not set, the host element is used.
     *
     * @type {HTMLElement}
     */
    this.scrollTarget = scrollTarget || host;

    /** @private */
    this.__boundOnScroll = this.__onScroll.bind(this);
  }

  hostConnected() {
    if (!this.initialized) {
      this.initialized = true;

      this.observe();
    }
  }

  /**
   * Setup scroll listener and observers to update overflow.
   * Also performs one-time update synchronously when called.
   * @protected
   */
  observe() {
    this.__resizeObserver = new ResizeObserver(() => {
      this.__debounceOverflow = Debouncer.debounce(this.__debounceOverflow, animationFrame, () => {
        this.__updateOverflow();
      });
    });

    this.__resizeObserver.observe(this.host);

    this.__childObserver = new FlattenedNodesObserver(this.host, (info) => {
      info.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          this.__resizeObserver.observe(node);
        }
      });

      info.removedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          this.__resizeObserver.unobserve(node);
        }
      });

      this.__updateOverflow();
    });

    // Update overflow attribute on scroll
    this.scrollTarget.addEventListener('scroll', this.__boundOnScroll);

    this.__updateOverflow();
  }

  /** @private */
  __onScroll() {
    this.__updateOverflow();
  }

  /** @private */
  __updateOverflow() {
    const target = this.scrollTarget;

    let overflow = '';

    if (target.scrollTop > 0) {
      overflow += ' top';
    }

    if (target.scrollTop < target.scrollHeight - target.clientHeight) {
      overflow += ' bottom';
    }

    const scrollLeft = Math.abs(target.scrollLeft);
    if (scrollLeft > 0) {
      overflow += ' start';
    }

    if (scrollLeft < target.scrollWidth - target.clientWidth) {
      overflow += ' end';
    }

    overflow = overflow.trim();
    if (overflow.length > 0 && this.host.getAttribute('overflow') !== overflow) {
      this.host.setAttribute('overflow', overflow);
    } else if (overflow.length === 0 && this.host.hasAttribute('overflow')) {
      this.host.removeAttribute('overflow');
    }
  }
}
