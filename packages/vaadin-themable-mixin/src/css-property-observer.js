/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * WARNING: For internal use only. Do not use this class in custom components.
 *
 * @private
 */
export class CSSPropertyObserver {
  #root;
  #callback;
  #properties = new Set();
  #styleSheet;
  #isConnected = false;

  constructor(root, callback) {
    this.#root = root;
    this.#callback = callback;
    this.#styleSheet = new CSSStyleSheet();
  }

  #handleTransitionEvent(event) {
    const { propertyName } = event;
    if (this.#properties.has(propertyName)) {
      this.#callback(propertyName);
    }
  }

  observe(property) {
    this.connect();

    if (this.#properties.has(property)) {
      return;
    }

    this.#properties.add(property);

    this.#styleSheet.replaceSync(`
      :root::before, :host::before {
        content: '' !important;
        position: absolute !important;
        top: -9999px !important;
        left: -9999px !important;
        visibility: hidden !important;
        transition: 1ms allow-discrete step-end !important;
        transition-property: ${[...this.#properties].join(', ')} !important;
      }
    `);
  }

  connect() {
    if (this.#isConnected) {
      return;
    }

    this.#root.adoptedStyleSheets.unshift(this.#styleSheet);

    this.#rootHost.addEventListener('transitionstart', (event) => this.#handleTransitionEvent(event));
    this.#rootHost.addEventListener('transitionend', (event) => this.#handleTransitionEvent(event));

    this.#isConnected = true;
  }

  disconnect() {
    this.#properties.clear();

    this.#root.adoptedStyleSheets = this.#root.adoptedStyleSheets.filter((s) => s !== this.#styleSheet);

    this.#rootHost.removeEventListener('transitionstart', this.#handleTransitionEvent);
    this.#rootHost.removeEventListener('transitionend', this.#handleTransitionEvent);

    this.#isConnected = false;
  }

  get #rootHost() {
    return this.#root.documentElement ?? this.#root.host;
  }
}
