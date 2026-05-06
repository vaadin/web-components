/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
// @ts-check -- gradual ts-check pilot, see proto/ts-check
import { dedupeMixin } from '@open-wc/dedupe-mixin';

/**
 * @typedef {import('lit').LitElement & import('./polylit-mixin.js').PolylitMixinClass & { _createMethodObserver(observer: string): void }} VaadinElement
 */

/**
 * A mixin to delegate properties and attributes to a target element.
 *
 * @polymerMixin
 * @template {new (...args: any[]) => VaadinElement} T
 * @param {T} superclass
 */
const DelegateStateMixinImplementation = (superclass) => {
  return class DelegateStateMixinClass extends superclass {
    static get properties() {
      return {
        /**
         * A target element to which attributes and properties are delegated.
         * @protected
         */
        stateTarget: {
          type: Object,
          observer: '_stateTargetChanged',
        },
      };
    }

    /**
     * An array of the host attributes to delegate to the target element.
     */
    static get delegateAttrs() {
      return [];
    }

    /**
     * An array of the host properties to delegate to the target element.
     */
    static get delegateProps() {
      return [];
    }

    /**
     * @param {...any} args
     */
    constructor(...args) {
      super(...args);
      /** @type {HTMLElement | null | undefined} */
      this.stateTarget = undefined;
    }

    ready() {
      super.ready();

      this._createDelegateAttrsObserver();
      this._createDelegatePropsObserver();
    }

    /**
     * @param {HTMLElement | null | undefined} target
     * @protected
     */
    _stateTargetChanged(target) {
      if (target) {
        this._ensureAttrsDelegated();
        this._ensurePropsDelegated();
      }
    }

    /** @protected */
    _createDelegateAttrsObserver() {
      this._createMethodObserver(`_delegateAttrsChanged(${this.__ctor().delegateAttrs.join(', ')})`);
    }

    /** @protected */
    _createDelegatePropsObserver() {
      this._createMethodObserver(`_delegatePropsChanged(${this.__ctor().delegateProps.join(', ')})`);
    }

    /** @protected */
    _ensureAttrsDelegated() {
      this.__ctor().delegateAttrs.forEach((name) => {
        this._delegateAttribute(name, /** @type {Record<string, unknown>} */ (this)[name]);
      });
    }

    /** @protected */
    _ensurePropsDelegated() {
      this.__ctor().delegateProps.forEach((name) => {
        this._delegateProperty(name, /** @type {Record<string, unknown>} */ (this)[name]);
      });
    }

    /**
     * @param {...unknown} values
     * @protected
     */
    _delegateAttrsChanged(...values) {
      this.__ctor().delegateAttrs.forEach((name, index) => {
        this._delegateAttribute(name, values[index]);
      });
    }

    /**
     * @param {...unknown} values
     * @protected
     */
    _delegatePropsChanged(...values) {
      this.__ctor().delegateProps.forEach((name, index) => {
        this._delegateProperty(name, values[index]);
      });
    }

    /**
     * @param {string} name
     * @param {unknown} value
     * @protected
     */
    _delegateAttribute(name, value) {
      if (!this.stateTarget) {
        return;
      }

      if (name === 'invalid') {
        this._delegateAttribute('aria-invalid', value ? 'true' : false);
      }

      if (typeof value === 'boolean') {
        this.stateTarget.toggleAttribute(name, value);
      } else if (value) {
        this.stateTarget.setAttribute(name, /** @type {string} */ (value));
      } else {
        this.stateTarget.removeAttribute(name);
      }
    }

    /**
     * @param {string} name
     * @param {unknown} value
     * @protected
     */
    _delegateProperty(name, value) {
      if (!this.stateTarget) {
        return;
      }

      /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (this.stateTarget))[name] = value;
    }

    /**
     * Returns this.constructor cast to its actual mixin type, since
     * `this.constructor` is typed as `Function` by TS.
     *
     * @returns {typeof DelegateStateMixinClass}
     * @private
     */
    __ctor() {
      return /** @type {typeof DelegateStateMixinClass} */ (/** @type {unknown} */ (this.constructor));
    }
  };
};

export const DelegateStateMixin = dedupeMixin(DelegateStateMixinImplementation);
