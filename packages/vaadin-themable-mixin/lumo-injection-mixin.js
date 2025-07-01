/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { LumoInjector } from './src/lumo-injector.js';

/**
 * @type {Set<string>}
 */
const registeredProperties = new Set();

/**
 * Find enclosing root for given element to gather style rules from.
 *
 * @param {HTMLElement} element
 * @return {DocumentOrShadowRoot}
 */
function findRoot(element) {
  const root = element.getRootNode();

  if (root.host && root.host.constructor.version) {
    return findRoot(root.host);
  }

  return root;
}

/**
 * Mixin for internal use only. Do not use it in custom components.
 *
 * @polymerMixin
 */
export const LumoInjectionMixin = (superClass) =>
  class LumoInjectionMixinClass extends superClass {
    static finalize() {
      super.finalize();

      const propName = this.lumoInjectPropName;

      // Prevent registering same property twice when a class extends
      // another class using this mixin, since `finalize()` is called
      // by LitElement for all superclasses in the prototype chain.
      if (this.is && !registeredProperties.has(propName)) {
        registeredProperties.add(propName);

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

    static get lumoInjectPropName() {
      return `--${this.is}-lumo-inject`;
    }

    /** @protected */
    connectedCallback() {
      super.connectedCallback();

      if (this.isConnected) {
        const root = findRoot(this);
        root.__lumoInjector ||= new LumoInjector(root);
        this.__lumoInjector = root.__lumoInjector;
        this.__lumoInjector.componentConnected(this);
      }
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();

      // Check if LumoInjector is defined. It might be unavailable if the component
      // is moved within the DOM during connectedCallback and becomes disconnected
      // before LumoInjector is assigned.
      if (this.__lumoInjector) {
        this.__lumoInjector.componentDisconnected(this);
        this.__lumoInjector = undefined;
      }
    }
  };
