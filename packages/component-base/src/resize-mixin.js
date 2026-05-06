/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
// @ts-check -- gradual ts-check pilot, see proto/ts-check
import { dedupeMixin } from '@open-wc/dedupe-mixin';

/**
 * @typedef {import('lit').LitElement & import('./polylit-mixin.js').PolylitMixinClass} VaadinElement
 *
 * @typedef {Element & { resizables?: Set<Resizable>; _onResize?: (rect: DOMRectReadOnly) => void }} Resizable
 */

const observer = new ResizeObserver((entries) => {
  setTimeout(() => {
    entries.forEach((entry) => {
      if (!entry.target.isConnected) {
        return;
      }

      const target = /** @type {Resizable} */ (entry.target);

      // Notify child resizables, if any
      if (target.resizables) {
        target.resizables.forEach((resizable) => {
          resizable._onResize?.(entry.contentRect);
        });
      } else {
        target._onResize?.(entry.contentRect);
      }
    });
  });
});

/**
 * A mixin that uses a ResizeObserver to listen to host size changes.
 *
 * @polymerMixin
 * @template {new (...args: any[]) => VaadinElement} T
 * @param {T} superclass
 */
const ResizeMixinImplementation = (superclass) =>
  class ResizeMixinClass extends superclass {
    /**
     * When true, the parent element resize will be also observed.
     * Override this getter and return `true` to enable this.
     *
     * @protected
     */
    get _observeParent() {
      return false;
    }

    /**
     * @param {...any} args
     */
    constructor(...args) {
      super(...args);
      /** @type {Resizable | null} */
      this.__parent = null;
    }

    connectedCallback() {
      super.connectedCallback();
      observer.observe(this);

      if (this._observeParent) {
        const parent = /** @type {Resizable} */ (
          this.parentNode instanceof ShadowRoot ? this.parentNode.host : this.parentNode
        );

        if (!parent.resizables) {
          parent.resizables = new Set();
          observer.observe(parent);
        }

        parent.resizables.add(/** @type {Resizable} */ (/** @type {unknown} */ (this)));
        this.__parent = parent;
      }
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      observer.unobserve(this);

      const parent = this.__parent;
      if (this._observeParent && parent) {
        const resizables = parent.resizables;

        if (resizables) {
          resizables.delete(/** @type {Resizable} */ (/** @type {unknown} */ (this)));

          if (resizables.size === 0) {
            observer.unobserve(parent);
          }
        }

        this.__parent = null;
      }
    }

    /**
     * A handler invoked on host resize. By default, it does nothing.
     * Override the method to implement your own behavior.
     *
     * @param {DOMRectReadOnly} _contentRect
     * @protected
     */
    _onResize(_contentRect) {
      // To be implemented.
    }
  };

export const ResizeMixin = dedupeMixin(ResizeMixinImplementation);
