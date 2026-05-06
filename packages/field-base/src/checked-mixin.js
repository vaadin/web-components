/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
// @ts-check -- gradual ts-check pilot, see proto/ts-check
import { DisabledMixin } from '@vaadin/a11y-base/src/disabled-mixin.js';
import { DelegateStateMixin } from '@vaadin/component-base/src/delegate-state-mixin.js';
import { InputMixin } from './input-mixin.js';

/**
 * A mixin to manage the checked state.
 *
 * @polymerMixin
 * @mixes DelegateStateMixin
 * @mixes DisabledMixin
 * @mixes InputMixin
 * @template {new (...args: any[]) => HTMLElement} T
 * @param {T} superclass
 */
export const CheckedMixin = (superclass) =>
  class CheckedMixinClass extends DelegateStateMixin(DisabledMixin(InputMixin(superclass))) {
    static get properties() {
      return {
        /**
         * True if the element is checked.
         */
        checked: {
          type: Boolean,
          value: false,
          notify: true,
          reflectToAttribute: true,
          sync: true,
        },
      };
    }

    static get delegateProps() {
      // @ts-expect-error -- delegateProps is a static field added by DelegateStateMixin; not surfaced through the typed mixin chain.
      return [...super.delegateProps, 'checked'];
    }

    /**
     * @param {...any} args
     */
    constructor(...args) {
      super(...args);
      /** @type {boolean} */
      this.checked = false;
    }

    /**
     * @param {Event} event
     * @protected
     * @override
     */
    _onChange(event) {
      const input = /** @type {HTMLInputElement} */ (event.target);

      this._toggleChecked(input.checked);
    }

    /**
     * @param {boolean} checked
     * @protected
     */
    _toggleChecked(checked) {
      this.checked = checked;
    }
  };
