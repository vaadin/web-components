/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { CSSPropertyObserver } from '@vaadin/component-base/src/css-property-observer.js';

/**
 * An extension of CSSPropertyObserver that takes a Document or ShadowRoot and
 * listens for changes to CSS custom properties on its `:root` or `:host` element
 * via the `::before` pseudo-element.
 *
 * WARNING: For internal use only. Do not use this class in custom components.
 */
export class RootCSSPropertyObserver extends CSSPropertyObserver {
  #root;
  #styleSheet = new CSSStyleSheet();

  /**
   * Gets or creates the CSSPropertyObserver for the given root.
   * @param {DocumentOrShadowRoot} root
   * @returns {RootCSSPropertyObserver}
   */
  static for(root) {
    root.__cssPropertyObserver ||= new RootCSSPropertyObserver(root);
    return root.__cssPropertyObserver;
  }

  constructor(root) {
    super(root.host ?? root.documentElement);
    this.#root = root;
  }

  connect() {
    super.connect();
    this.#root.adoptedStyleSheets = this.#root.adoptedStyleSheets.filter((s) => s !== this.#styleSheet);
    this.#root.adoptedStyleSheets.unshift(this.#styleSheet);
  }

  disconnect() {
    super.disconnect();
    this.#root.adoptedStyleSheets = this.#root.adoptedStyleSheets.filter((s) => s !== this.#styleSheet);
  }

  /** @override */
  _updateStyles() {
    this.#styleSheet.replaceSync(`
      :root::before, :host::before {
        content: '' !important;
        position: absolute !important;
        top: -9999px !important;
        left: -9999px !important;
        visibility: hidden !important;
        transition: 1ms allow-discrete step-end !important;
        transition-property: ${[...this.properties].join(', ')} !important;
      }
    `);
  }
}
