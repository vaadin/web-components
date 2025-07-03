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
  #name;
  #callback;
  #properties = new Set();

  constructor(root, name, callback) {
    this.#root = root;
    this.#name = name;
    this.#callback = callback;

    const styleSheet = new CSSStyleSheet();
    styleSheet.replaceSync(`
      :is(:root, :host)::before {
        content: '' !important;
        position: absolute !important;
        top: -9999px !important;
        left: -9999px !important;
        visibility: hidden !important;
        transition: 1ms allow-discrete step-end !important;
        transition-property: var(--${this.#name}-props) !important;
      }
    `);
    this.#root.adoptedStyleSheets.unshift(styleSheet);

    this.#rootHost.addEventListener('transitionstart', (event) => this.#handleTransitionEvent(event));
    this.#rootHost.addEventListener('transitionend', (event) => this.#handleTransitionEvent(event));
  }

  #handleTransitionEvent(event) {
    const { propertyName } = event;
    if (this.#properties.has(propertyName)) {
      this.#callback(propertyName);
    }
  }

  observe(property) {
    this.#properties.add(property);
    this.#rootHost.style.setProperty(`--${this.#name}-props`, [...this.#properties].join(', '));
  }

  get #rootHost() {
    return this.#root.documentElement ?? this.#root.host;
  }
}
