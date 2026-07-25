/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

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
    } else {
      this.#resizeRaf = requestAnimationFrame(() => this.#writeState(state));
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

  #writeState({ overflow }) {
    if (overflow) {
      this.host.setAttribute('overflow', overflow);
    } else {
      this.host.removeAttribute('overflow');
    }
  }
}
