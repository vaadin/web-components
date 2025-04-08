/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import StyleObserver from 'style-observer';
import { gatherMatchingStyleRules } from './css-injection-utils.js';

const injectedClasses = new Set();

const injectableInstances = new Set();

function injectInstanceStyles(el) {
  const rules = gatherMatchingStyleRules(el);

  if (rules.length > 0) {
    el.__injectedStyleSheet = new CSSStyleSheet();

    rules.forEach((ruleList) => {
      for (const rule of ruleList) {
        el.__injectedStyleSheet.insertRule(rule.cssText, el.__injectedStyleSheet.cssRules.length);
      }
    });

    el.shadowRoot.adoptedStyleSheets.push(el.__injectedStyleSheet);
  }
}

function cleanupInstanceStyles(el) {
  if (el.__injectedStyleSheet) {
    el.shadowRoot.adoptedStyleSheets.splice(el.shadowRoot.adoptedStyleSheets.indexOf(el.__injectedStyleSheet, 1));
  }
}

function injectClassInstanceStyles(componentClass) {
  injectableInstances.forEach((ref) => {
    const instance = ref.deref();
    if (instance instanceof componentClass) {
      injectInstanceStyles(instance);
    } else if (!instance) {
      // Clean up the weak reference to a GC'd instance
      injectableInstances.delete(ref);
    }
  });
}

function cleanupClassInstanceStyles(componentClass) {
  injectableInstances.forEach((ref) => {
    const instance = ref.deref();
    if (instance instanceof componentClass) {
      cleanupInstanceStyles(instance);
    } else if (!instance) {
      // Clean up the weak reference to a GC'd instance
      injectableInstances.delete(ref);
    }
  });
}

const observer = new StyleObserver((records) => {
  records.forEach((record) => {
    const { property, value, oldValue } = record;

    const tagName = property.slice(2).replace('-css-inject', '');
    const componentClass = customElements.get(tagName);

    if (componentClass) {
      if (value === '1') {
        // Allow future instances inject own styles
        injectedClasses.add(componentClass);
        // Inject styles for already existing instances
        injectClassInstanceStyles(componentClass);
      } else if (oldValue === '1') {
        // Disallow future instances inject own styles
        injectedClasses.delete(componentClass);
        // Cleanup styles for already existing instances
        cleanupClassInstanceStyles(componentClass);
      }
    }
  });
});

function observeRoot(componentClass, root = document.documentElement) {
  const { cssInjectPropName } = componentClass;

  // If styles for custom property are already loaded, store this class
  // in a registry so that evert instance of it would auto-inject styles
  const value = getComputedStyle(root).getPropertyValue(cssInjectPropName);
  if (value === '1') {
    injectedClasses.add(componentClass);
  }

  // Observe custom property that would trigger injection for this class
  observer.observe(root, cssInjectPropName);
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
        // Initialize custom property for this class with 0 as default
        // so that changing it to 1 would inject styles to instances
        CSS.registerProperty({
          name: this.cssInjectPropName,
          syntax: '<number>',
          inherits: true,
          initialValue: '0',
        });

        observeRoot(this);
      }
    }

    static get cssInjectPropName() {
      return `--${this.is}-css-inject`;
    }

    constructor() {
      super();
      // Store a weak reference to the instance
      injectableInstances.add(new WeakRef(this));
    }

    /** @protected */
    connectedCallback() {
      super.connectedCallback();

      const root = this.getRootNode();
      if (root !== document) {
        observeRoot(this.constructor, root.host);
      }

      if (!injectedClasses.has(this.constructor)) {
        return;
      }

      injectInstanceStyles(this);
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();

      cleanupInstanceStyles(this);
    }
  };
