/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { CSSInjector } from './src/css-injector.js';

/**
 * Find enclosing root for given element to father style rules from.
 *
 * @param {HTMLElement} element
 * @return {DocumentOrShadowRoot}
 */
function findRoot(element) {
  const root = element.getRootNode();

  if (root.host && root.host.constructor.cssInjectPropName) {
    return findRoot(root.host);
  }

  return root;
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
      const root = findRoot(this);
      root.__cssInjector ||= new CSSInjector(root);
      this.__cssInjector = root.__cssInjector;
      this.__cssInjector.componentConnected(this);
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();

      this.__cssInjector.componentDisconnected(this);
      this.__cssInjector = undefined;
    }
  };
