/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/* eslint-disable es/no-optional-chaining */
import StyleObserver from 'style-observer';
import { collectTagScopedCSSRules } from './css-rules.js';
import { cleanupStyleSheet, injectStyleSheet } from './css-utils.js';

export class CSSInjector {
  /** @type {Document | ShadowRoot} */
  #root;

  /** @type {Map<string, Element[]>} */
  #componentsByTag = new Map();

  /** @type {Map<string, CSSStyleSheet>} */
  #styleSheetsByTag = new Map();

  #styleObserver = new StyleObserver((records) => {
    records.forEach((record) => {
      const { property, value, oldValue } = record;
      const tagName = property.slice(2).replace('-css-inject', '');
      if (value === '1') {
        this.#componentStylesAdded(tagName);
      } else if (oldValue === '1') {
        this.#componentStylesRemoved(tagName);
      }
    });
  });

  constructor(root) {
    this.#root = root;
  }

  componentConnected(component) {
    const { is: tagName, cssInjectPropName } = component.constructor;

    if (this.#componentsByTag.has(tagName)) {
      this.#componentsByTag.get(tagName).add(component);
    } else {
      this.#componentsByTag.set(tagName, new Set([component]));
    }

    const stylesheet = this.#styleSheetsByTag.get(tagName);
    if (stylesheet) {
      injectStyleSheet(component, stylesheet);
      return;
    }

    // If styles for custom property are already loaded for this root,
    // store corresponding tag name so that we can inject styles
    const value = getComputedStyle(this.rootHost).getPropertyValue(cssInjectPropName);
    if (value === '1') {
      this.#componentStylesAdded(tagName);
    }

    // Observe custom property that would trigger injection for this class
    this.#styleObserver.observe(this.rootHost, cssInjectPropName);
  }

  componentDisconnected(component) {
    const { is: tagName } = component.constructor;

    cleanupStyleSheet(component);

    this.#componentsByTag.get(tagName)?.delete(component);
  }

  #componentStylesAdded(tagName) {
    const stylesheet = this.#styleSheetsByTag.get(tagName) || new CSSStyleSheet();

    const cssText = this.#collectComponentCSSRules(tagName)
      .map((rule) => rule.cssText)
      .join('\n');
    stylesheet.replaceSync(cssText);

    this.#componentsByTag.get(tagName)?.forEach((component) => {
      injectStyleSheet(component, stylesheet);
    });

    this.#styleSheetsByTag.set(tagName, stylesheet);
  }

  #componentStylesRemoved(tagName) {
    this.#componentsByTag.get(tagName)?.forEach((component) => {
      cleanupStyleSheet(component);
    });

    this.#styleSheetsByTag.delete(tagName);
  }

  #collectComponentCSSRules(tagName) {
    // Global stylesheets
    const rules = collectTagScopedCSSRules(document, tagName);

    // Scoped stylesheets
    if (this.#root !== document) {
      rules.push(...collectTagScopedCSSRules(this.#root, tagName));
    }

    return rules;
  }

  get rootHost() {
    return this.#root === document ? this.#root.documentElement : this.#root.host;
  }
}
