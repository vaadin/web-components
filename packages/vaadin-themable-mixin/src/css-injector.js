/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { CSSPropertyObserver } from './css-property-observer.js';
import { extractTagScopedCSSRules } from './css-rules.js';
import { cleanupStyleSheet, injectStyleSheet } from './css-utils.js';

/**
 * Implements auto-injection of component-scoped CSS styles from document
 * style sheets into the Shadow DOM of the corresponding Vaadin components.
 *
 * Styles are scoped to a component using the following syntax:
 *
 * 1. `@media vaadin-text-field { ... }` - a media query with a tag name
 * 2. `@import "styles.css" vaadin-text-field` - an import rule with a tag name
 *
 * The class observes the custom property `--{tagName}-css-inject`,
 * which indicates the presence of styles for the given component in
 * the document style sheets. When the property is set to `1`, the class
 * recursively searches all document style sheets for any CSS rules that
 * are scoped to the given component tag name using the syntax described
 * above. The found rules are then injected into the shadow DOM of all
 * subscribed components through the adoptedStyleSheets API.
 *
 * The class also observes the custom property to remove the styles when
 * the property is set to `0`.
 *
 * If a root element is provided, the class will additionally search for
 * component-scoped styles in the root element's style sheets. This is
 * useful for embedded Flow applications that are fully isolated from
 * the main document and load styles into a component's shadow DOM
 * rather than the main document.
 *
 * WARNING: For internal use only. Do not use this class in custom components.
 *
 * @private
 */
export class CSSInjector {
  /** @type {Document | ShadowRoot} */
  #root;

  /** @type {CSSPropertyObserver} */
  #cssPropertyObserver;

  /** @type {Map<string, CSSStyleSheet>} */
  #styleSheetsByTag = new Map();

  constructor(root = document) {
    this.#root = root;
    this.#cssPropertyObserver = new CSSPropertyObserver(this.#root, 'vaadin-css-injector', (propertyName) => {
      const tagName = propertyName.slice(2).replace('-css-inject', '');
      this.#updateComponentStyleSheet(tagName);
    });
  }

  /**
   * Adds a component to the list of elements monitored for component-scoped
   * styles in global style sheets. If the styles have already been detected,
   * they are injected into the component's shadow DOM immediately. Otherwise,
   * the class watches the custom property `--{tagName}-css-inject` to trigger
   * injection when the styles are added to the document or root element.
   *
   * @param {HTMLElement} component
   */
  componentConnected(component) {
    const { is: tagName, cssInjectPropName } = component.constructor;

    const stylesheet = this.#styleSheetsByTag.get(tagName) ?? new CSSStyleSheet();
    injectStyleSheet(component, stylesheet);
    this.#styleSheetsByTag.set(tagName, stylesheet);

    this.#updateComponentStyleSheet(tagName);

    this.#cssPropertyObserver.observe(cssInjectPropName);
  }

  /**
   * Removes the component from the list of elements monitored for
   * component-scoped styles and cleans up any previously injected
   * styles from the component's shadow DOM.
   *
   * @param {HTMLElement} component
   */
  componentDisconnected(component) {
    cleanupStyleSheet(component);
  }

  #updateComponentStyleSheet(tagName) {
    const roots = new Set([document, this.#root]);

    const cssText = [...roots]
      .flatMap((root) => extractTagScopedCSSRules(root, tagName))
      .map((rule) => rule.cssText)
      .join('\n');

    const stylesheet = this.#styleSheetsByTag.get(tagName) ?? new CSSStyleSheet();
    stylesheet.replaceSync(cssText);
    this.#styleSheetsByTag.set(tagName, stylesheet);
  }
}
