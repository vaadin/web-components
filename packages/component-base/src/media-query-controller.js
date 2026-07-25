/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A controller for listening on media query changes.
 */
export class MediaQueryController {
  /** @type {MediaQueryList | null} */
  #mediaQuery = null;

  constructor(query, callback) {
    /**
     * The CSS media query to evaluate.
     *
     * @type {string}
     * @protected
     */
    this.query = query;

    /**
     * Function to call when media query changes.
     *
     * @type {Function}
     * @protected
     */
    this.callback = callback;
  }

  hostConnected() {
    this.#removeListener();

    this.#mediaQuery = window.matchMedia(this.query);

    this.#addListener();

    this.#queryHandler(this.#mediaQuery);
  }

  hostDisconnected() {
    this.#removeListener();
  }

  #addListener() {
    if (this.#mediaQuery) {
      this.#mediaQuery.addListener(this.#queryHandler);
    }
  }

  #removeListener() {
    if (this.#mediaQuery) {
      this.#mediaQuery.removeListener(this.#queryHandler);
    }

    this.#mediaQuery = null;
  }

  #queryHandler = (mediaQuery) => {
    if (typeof this.callback === 'function') {
      this.callback(mediaQuery.matches);
    }
  };
}
