/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { deserializeAttributeValue, setOrRemoveAttribute } from './dom-utils.js';

/**
 * A controller that detects if content inside the element overflows its scrolling viewport,
 * and sets the `overflow` attribute on the host with a value that indicates the directions
 * where content is overflowing. Supported values are: `top`, `bottom`, `start`, `end`.
 */
export class OverflowController {
  /** @type {ResizeObserver} */
  #resizeObserver;

  /** @type {MutationObserver} */
  #childObserver;

  /** @type {number} */
  #resizeRaf;

  /** @type {string | undefined} */
  #previousOverflow;

  /** @type {boolean} */
  #changedBeforeResize = false;

  /** @type {string | null} */
  #unstableLayout = null;

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
    const { host } = this;

    this.#resizeObserver = new ResizeObserver(() => this.#onResize());
    this.#resizeObserver.observe(host);

    // Observe initial children
    [...host.children].forEach((child) => {
      this.#resizeObserver.observe(child);
    });

    this.#childObserver = new MutationObserver((mutations) => {
      mutations.forEach(({ addedNodes, removedNodes }) => {
        addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            this.#resizeObserver.observe(node);
          }
        });

        removedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            this.#resizeObserver.unobserve(node);
          }
        });

        if (addedNodes.length === 0 && removedNodes.length > 0) {
          this.#updateState({ sync: true });
        }
      });
    });

    this.#childObserver.observe(host, { childList: true });

    // Update overflow attribute on scroll
    this.scrollTarget.addEventListener('scroll', this.#onScroll);
  }

  #onResize() {
    this.#updateState({ sync: false });
  }

  #onScroll = () => {
    this.#updateState({ sync: true });
  };

  #updateState({ sync }) {
    cancelAnimationFrame(this.#resizeRaf);

    const state = this.#readState();
    if (sync) {
      this.#writeState(state);
      return;
    }

    // A first resize after a change that reverts the change can be caused by the attribute
    // itself, when styles that depend on it change the size of the content
    const reverted = this.#changedBeforeResize && state.overflow === this.#previousOverflow;
    this.#changedBeforeResize = false;

    if (this.#unstableLayout === null || this.#readLayout() !== this.#unstableLayout) {
      this.#resizeRaf = requestAnimationFrame(() => {
        if (reverted) {
          this.#writeVerifiedState();
        } else {
          this.#writeState(state);
        }
      });
    }
  }

  #readState() {
    const target = this.scrollTarget;

    let overflow = '';

    if (target.scrollTop > 0) {
      overflow += ' top';
    }

    if (Math.ceil(target.scrollTop) < Math.ceil(target.scrollHeight - target.clientHeight)) {
      overflow += ' bottom';
    }

    const scrollLeft = Math.abs(target.scrollLeft);
    if (scrollLeft > 0) {
      overflow += ' start';
    }

    if (Math.ceil(scrollLeft) < Math.ceil(target.scrollWidth - target.clientWidth)) {
      overflow += ' end';
    }

    return { overflow: overflow.trim() };
  }

  #readLayout() {
    const { scrollTop, scrollHeight, clientHeight, scrollLeft, scrollWidth, clientWidth } = this.scrollTarget;
    return [scrollTop, scrollHeight, clientHeight, scrollLeft, scrollWidth, clientWidth].join();
  }

  #writeState({ overflow }) {
    const current = this.host.getAttribute('overflow') || '';
    if (overflow !== current) {
      this.#previousOverflow = current;
      this.#changedBeforeResize = true;
      this.#unstableLayout = null;
      setOrRemoveAttribute(this.host, 'overflow', overflow);
    }
  }

  #writeVerifiedState() {
    let { overflow } = this.#readState();
    this.#writeState({ overflow });

    let after = this.#readState();
    if (after.overflow === overflow) {
      return;
    }

    // The new state changed the layout so that the state no longer matches it. Writing the
    // state again would start an endless loop. Keep the state with more overflow values, as
    // its styles usually hide a border, so the content fits without a scrollbar. Then keep
    // the state until the layout changes for another reason.
    if (deserializeAttributeValue(after.overflow).size > deserializeAttributeValue(overflow).size) {
      overflow = after.overflow;
      this.#writeState({ overflow });
      after = this.#readState();
    }
    if (after.overflow !== overflow) {
      this.#unstableLayout = this.#readLayout();
    }
  }
}
