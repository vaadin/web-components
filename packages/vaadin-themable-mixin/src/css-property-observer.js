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
  #properties = new Set();

  constructor(root, name, callback) {
    this.#root = root;
    this.#name = name;

    const styleSheet = new CSSStyleSheet();
    styleSheet.replaceSync(`
      :is(:root, :host)::before {
        content: '';
        position: absolute;
        top: -9999px;
        left: -9999px;
        visibility: hidden;
        transition: 1ms allow-discrete step-end;
        transition-property: var(--${this.#name}-props);
      }
    `);
    this.#root.adoptedStyleSheets.unshift(styleSheet);

    this.#rootHost.addEventListener('transitionstart', (event) => callback(event));
    this.#rootHost.addEventListener('transitionend', (event) => callback(event));
  }

  observe(property) {
    this.#properties.add(property);
    this.#rootHost.style.setProperty(`--${this.#name}-props`, [...this.#properties].join(', '));
  }

  get #rootHost() {
    return this.#root.documentElement ?? this.#root.host;
  }
}
