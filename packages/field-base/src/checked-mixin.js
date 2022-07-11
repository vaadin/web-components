/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
import { DisabledMixin } from '@vaadin/component-base/src/disabled-mixin.js';
import { isElementFocused } from '@vaadin/component-base/src/focus-utils.js';
import { DelegateStateMixin } from './delegate-state-mixin.js';
import { InputMixin } from './input-mixin.js';

/**
 * A mixin to manage the checked state.
 *
 * @polymerMixin
 * @mixes DelegateStateMixin
 * @mixes DisabledMixin
 * @mixes InputMixin
 */
export const CheckedMixin = dedupingMixin(
  (superclass) =>
    class CheckedMixinClass extends DelegateStateMixin(DisabledMixin(InputMixin(superclass))) {
      static get properties() {
        return {
          /**
           * True if the element is checked.
           * @type {boolean}
           */
          checked: {
            type: Boolean,
            value: false,
            notify: true,
            reflectToAttribute: true,
          },
        };
      }

      static get delegateProps() {
        return [...super.delegateProps, 'checked'];
      }

      /**
       * @param {Event} event
       * @protected
       * @override
       */
      _onChange(event) {
        const input = event.target;

        this._toggleChecked(input.checked);

        // Clicking the checkbox or radio-button in Safari
        // does not make it focused, so we do it manually.
        if (!isElementFocused(input)) {
          input.focus();
        }
      }

      /** @protected */
      _toggleChecked(checked) {
        this.checked = checked;
      }
    },
);
