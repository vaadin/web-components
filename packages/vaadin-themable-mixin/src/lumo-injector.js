/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { CSSPropertyObserver } from './css-property-observer.js';
import { cleanupLumoStyleSheet, injectLumoStyleSheet, applyInstanceStyles } from './css-utils.js';
import { parseStyleSheets } from './lumo-modules.js';

/**
 * Implements auto-injection of CSS styles from document style sheets
 * into the Shadow DOM of corresponding Vaadin components.
 *
 * Styles to be injected are defined as reusable modules using the
 * following syntax, based on media queries and custom properties:
 *
 * ```css
 * \@media lumo_base-field {
 *  #label {
 *    color: gray;
 *  }
 * }
 *
 * \@media lumo_text-field {
 *   #input {
 *     color: yellow;
 *   }
 * }
 *
 * \@media lumo_email-field {
 *   #input {
 *     color: green;
 *   }
 * }
 *
 * html {
 *   --vaadin-text-field-lumo-inject: 1;
 *   --vaadin-text-field-lumo-inject-modules:
 *      lumo_base-field,
 *      lumo_text-field;
 *
 *   --vaadin-email-field-lumo-inject: 1;
 *   --vaadin-email-field-lumo-inject-modules:
 *      lumo_base-field,
 *      lumo_email-field;
 * }
 * ```
 *
 * The class observes the custom property `--{tagName}-lumo-inject`,
 * which indicates whether styles are present for the given component
 * in the document style sheets. When the property is set to `1`, the
 * class recursively searches all document style sheets for CSS modules
 * listed in the `--{tagName}-lumo-inject-modules` property that apply to
 * the given component tag name. The found rules are then injected
 * into the component's Shadow DOM using the `adoptedStyleSheets` API,
 * in the order specified in the `--{tagName}-lumo-inject-modules` property.
 * The same module can be used in multiple components.
 *
 * The class also removes the injected styles when the property is set to `0`.
 *
 * If a root element is provided, the class will additionally search for
 * CSS modules in the root element's style sheets. This is useful for
 * embedded Flow applications that are fully isolated from the main document
 * and load styles into a component’s Shadow DOM instead of the main document.
 *
 * WARNING: For internal use only. Do not use this class in custom components.
 *
 * @private
 */
export class LumoInjector {
  /** @type {Document | ShadowRoot} */
  #root;

  /** @type {CSSPropertyObserver} */
  #cssPropertyObserver;

  /** @type {Map<string, CSSStyleSheet>} */
  #styleSheetsByTag = new Map();

  /** @type {Map<string, Set<HTMLElement>>} */
  #componentsByTag = new Map();

  constructor(root = document) {
    this.#root = root;
    this.#cssPropertyObserver = new CSSPropertyObserver(this.#root, 'vaadin-lumo-injector', (propertyName) => {
      const tagName = propertyName.slice(2).replace('-lumo-inject', '');
      this.#updateComponentStyleSheet(tagName);
    });
  }

  /**
   * Adds a component to the list of elements monitored for style injection.
   * If the styles have already been detected, they are injected into the
   * component's shadow DOM immediately. Otherwise, the class watches the
   * custom property `--{tagName}-lumo-inject` to trigger injection when
   * the styles are added to the document or root element.
   *
   * @param {HTMLElement} component
   */
  componentConnected(component) {
    const { is: tagName } = component.constructor;

    this.#componentsByTag.set(tagName, this.#componentsByTag.get(tagName) ?? new Set());
    this.#componentsByTag.get(tagName).add(component);

    this.#updateComponentStyleSheet(tagName);

    this.#cssPropertyObserver.observe(`--${tagName}-lumo-inject`);
  }

  /**
   * Removes the component from the list of elements monitored for
   * style injection and cleans up any previously injected styles.
   *
   * @param {HTMLElement} component
   */
  componentDisconnected(component) {
    const { is: tagName } = component.constructor;
    this.#componentsByTag.get(tagName)?.delete(component);

    component.__lumoInjectorStyleSheet = undefined;
    applyInstanceStyles(component);
  }

  #updateComponentStyleSheet(tagName) {
    const { tags, modules } = parseStyleSheets(this.#rootStyleSheets);

    const cssText = (tags.get(tagName) ?? [])
      .flatMap((moduleName) => modules.get(moduleName) ?? [])
      .map((rule) => rule.cssText)
      .join('\n');

    const stylesheet = this.#styleSheetsByTag.get(tagName) ?? new CSSStyleSheet();
    stylesheet.disabled = !cssText;
    stylesheet.replaceSync(cssText);
    this.#styleSheetsByTag.set(tagName, stylesheet);

    this.#componentsByTag.get(tagName)?.forEach((component) => {
      component.__lumoInjectorStyleSheet = stylesheet;
      applyInstanceStyles(component);
    });
  }

  get #rootStyleSheets() {
    let styleSheets = new Set();

    for (const root of [this.#root, document]) {
      styleSheets = styleSheets.union(new Set(root.styleSheets));
      styleSheets = styleSheets.union(new Set(root.adoptedStyleSheets));
    }

    return [...styleSheets];
  }
}
