/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import StyleObserver from 'style-observer';
import { gatherMatchingStyleRules } from './css-injection-utils.js';

/**
 * @type {WeakMap<HTMLElement, object>}
 */
const observedHosts = new WeakMap();

/**
 * Gets or creates an object with the stored values for given host.
 *
 * @param {HTMLElement} host reference to the `<html>` element or shadow root host
 * @return {object} an object with tag names and instances for given host
 */
function getHostMap(host) {
  if (!observedHosts.has(host)) {
    observedHosts.set(host, {
      tagNames: new Set(),
      instances: new Set(),
    });
  }
  return observedHosts.get(host);
}

/**
 * Find enclosing host to observe for custom CSS property changes, which is either
 * an `<html>` element or a closest shadow host not implementing this mixin.
 *
 * @param {HTMLElement} element
 * @return {HTMLElement}
 */
function findHost(element) {
  const root = element.getRootNode();
  const host = root === document ? root.documentElement : root.host;

  // If element is nested in shadow root of another element implementing the mixin,
  // then use its host. Example: `vaadin-input-container` -> `vaadin-text-field`.
  return host.constructor.cssInjectPropName ? findHost(host) : host;
}

/**
 * Find enclosing root for given element to father style rules from.
 *
 * @param {HTMLElement} element
 * @return {DocumentOrShadowRoot}
 */
function findRoot(element) {
  const root = element.getRootNode();
  if (root === document) {
    return root;
  }

  if (root.host && root.host.constructor.cssInjectPropName) {
    return findRoot(root.host);
  }

  return root;
}

/**
 * @param {HTMLElement} element
 */
function injectInstanceStyles(element) {
  const rules = gatherMatchingStyleRules(element, findRoot(element));

  if (rules.length > 0) {
    element.__injectedStyleSheet = new CSSStyleSheet();

    rules.forEach((ruleList) => {
      for (const rule of ruleList) {
        element.__injectedStyleSheet.insertRule(rule.cssText, element.__injectedStyleSheet.cssRules.length);
      }
    });

    // Insert injected stylesheet as the first one to ensure it applies
    // before any custom styles applied with `registerStyles()` API
    element.shadowRoot.adoptedStyleSheets.unshift(element.__injectedStyleSheet);
  }
}

/**
 * @param {HTMLElement} element
 */
function cleanupInstanceStyles(element) {
  if (element.__injectedStyleSheet) {
    const index = element.shadowRoot.adoptedStyleSheets.indexOf(element.__injectedStyleSheet);
    if (index > -1) {
      element.shadowRoot.adoptedStyleSheets.splice(index, 1);
    }

    element.__injectedStyleSheet = undefined;
  }
}

/**
 * Dynamically injects styles to the instances matching the given component type.
 * @param {Function} componentClass
 * @param {Set<HTMLElement>} instances
 */
function injectClassInstanceStyles(componentClass, instances) {
  instances.forEach((instance) => {
    if (instance instanceof componentClass) {
      injectInstanceStyles(instance);
    }
  });
}

/**
 * Removes styles from the instances matching the given component type.
 * @param {Function} componentClass
 * @param {Set<HTMLElement>} instances
 */
function cleanupClassInstanceStyles(componentClass, instances) {
  instances.forEach((instance) => {
    if (instance instanceof componentClass) {
      cleanupInstanceStyles(instance);
    }
  });
}

const observer = new StyleObserver((records) => {
  records.forEach((record) => {
    const { property, value, oldValue, target } = record;

    const tagName = property.slice(2).replace('-css-inject', '');
    const componentClass = customElements.get(tagName);

    if (componentClass) {
      // Only apply styles changes to given host
      const hostMap = getHostMap(target);

      if (value === '1') {
        // Allow future instances inject own styles
        hostMap.tagNames.add(tagName);
        // Inject styles for already existing instances
        injectClassInstanceStyles(componentClass, hostMap.instances);
      } else if (oldValue === '1') {
        // Disallow future instances inject own styles
        hostMap.tagNames.delete(tagName);
        // Cleanup styles for already existing instances
        cleanupClassInstanceStyles(componentClass, hostMap.instances);
      }
    }
  });
});

function observeHost(componentClass, host) {
  const { cssInjectPropName, is } = componentClass;

  const hostMap = getHostMap(host);

  // If styles for custom property are already loaded for this root,
  // store corresponding tag name so that we can inject styles
  const value = getComputedStyle(host).getPropertyValue(cssInjectPropName);
  if (value === '1') {
    hostMap.tagNames.add(is);
  }

  // Observe custom property that would trigger injection for this class
  observer.observe(host, cssInjectPropName);
}

/**
 * Mixin for internal use only. Do not use it in custom components.
 *
 * @polymerMixin
 */
export const CssInjectionMixin = (superClass) =>
  class CssInjectionMixinClass extends superClass {
    static finalize() {
      super.finalize();

      if (this.is) {
        const propName = this.cssInjectPropName;

        // Initialize custom property for this class with 0 as default
        // so that changing it to 1 would inject styles to instances
        // Use `inherits: true` so that property defined on `<html>`
        // would apply to components instances within shadow roots
        CSS.registerProperty({
          name: propName,
          syntax: '<number>',
          inherits: true,
          initialValue: '0',
        });
      }
    }

    static get cssInjectPropName() {
      return `--${this.is}-css-inject`;
    }

    /** @protected */
    connectedCallback() {
      super.connectedCallback();

      // Find proper host element to observe
      const host = findHost(this);

      // Store this instance in the map for given host
      this.__storedHost = host;
      getHostMap(host).instances.add(this);

      // Observe host for custom CSS property injection
      observeHost(this.constructor, host);

      // If custom CSS property is already set, inject styles
      if (getHostMap(host).tagNames.has(this.constructor.is)) {
        injectInstanceStyles(this);
      }
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();

      // Cleanup instance from the previous host
      getHostMap(this.__storedHost).instances.delete(this);
      this.__storedHost = undefined;

      cleanupInstanceStyles(this);
    }
  };
