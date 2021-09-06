/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';

const DelegateStateMixinImplementation = (superclass) =>
  class DelegateStateMixinClass extends superclass {
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
     * A target element to which attributes and properties are delegated.
     */
    get _delegateStateTarget() {
      console.warn(`Please implement the '_delegateStateTarget' property in <${this.localName}>`);
      return null;
    }

    /** @protected */
    ready() {
      super.ready();

      this._createDelegateAttrsObserver();
      this._ensureAttrsDelegated();

      this._createDelegatePropsObserver();
      this._ensurePropsDelegated();
    }

    /** @protected */
    _createDelegateAttrsObserver() {
      this._createMethodObserver(`_delegateAttrsChanged(${this.constructor.delegateAttrs.join(', ')})`);
    }

    /** @protected */
    _createDelegatePropsObserver() {
      this._createMethodObserver(`_delegatePropsChanged(${this.constructor.delegateProps.join(', ')})`);
    }

    /** @protected */
    _ensureAttrsDelegated() {
      this.constructor.delegateAttrs.forEach((name) => {
        this._delegateAttribute(name, this[name]);
      });
    }

    /** @protected */
    _ensurePropsDelegated() {
      this.constructor.delegateProps.forEach((name) => {
        this._delegateProperty(name, this[name]);
      });
    }

    /** @protected */
    _delegateAttrsChanged(...values) {
      this.constructor.delegateAttrs.forEach((name, index) => {
        this._delegateAttribute(name, values[index]);
      });
    }

    /** @protected */
    _delegatePropsChanged(...values) {
      this.constructor.delegateProps.forEach((name, index) => {
        this._delegateProperty(name, values[index]);
      });
    }

    /** @protected */
    _delegateAttribute(name, value) {
      if (!this._delegateStateTarget) {
        return;
      }

      if (name === 'invalid') {
        this._delegateAttribute('aria-invalid', value ? 'true' : false);
      }

      if (typeof value === 'boolean') {
        this._delegateStateTarget.toggleAttribute(name, value);
      } else if (value) {
        this._delegateStateTarget.setAttribute(name, value);
      } else {
        this._delegateStateTarget.removeAttribute(name);
      }
    }

    /** @protected */
    _delegateProperty(name, value) {
      if (!this._delegateStateTarget) {
        return;
      }

      this._delegateStateTarget[name] = value;
    }
  };

/**
 * A mixin to delegate properties and attributes to a target element.
 */
export const DelegateStateMixin = dedupingMixin(DelegateStateMixinImplementation);
