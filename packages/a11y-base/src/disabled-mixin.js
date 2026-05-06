/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
// @ts-check -- gradual ts-check pilot, see proto/ts-check
import { dedupeMixin } from '@open-wc/dedupe-mixin';

/**
 * A mixin to provide disabled property for field components.
 *
 * @polymerMixin
 * @template {new (...args: any[]) => HTMLElement} T
 * @param {T} superclass
 */
const DisabledMixinImplementation = (superclass) => {
  return class DisabledMixinClass extends superclass {
    static get properties() {
      return {
        /**
         * If true, the user cannot interact with this element.
         */
        disabled: {
          type: Boolean,
          value: false,
          observer: '_disabledChanged',
          reflectToAttribute: true,
          sync: true,
        },
      };
    }

    /**
     * @param {...any} args
     */
    constructor(...args) {
      super(...args);
      /** @type {boolean} */
      this.disabled = false;
    }

    /**
     * @param {boolean} disabled
     * @protected
     */
    _disabledChanged(disabled) {
      this._setAriaDisabled(disabled);
    }

    /**
     * @param {boolean} disabled
     * @protected
     */
    _setAriaDisabled(disabled) {
      if (disabled) {
        this.setAttribute('aria-disabled', 'true');
      } else {
        this.removeAttribute('aria-disabled');
      }
    }

    /**
     * Overrides the default element `click` method in order to prevent
     * firing the `click` event when the element is disabled.
     * @override
     */
    click() {
      if (!this.disabled) {
        super.click();
      }
    }
  };
};

export const DisabledMixin = dedupeMixin(DisabledMixinImplementation);
