/**
 * @license
 * Copyright (c) 2000 - 2023 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
import { DisabledMixin } from '@vaadin/component-base/src/disabled-mixin.js';
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
       * @protected
       * @override
       */
      _onChange(event) {
        this._toggleChecked(event.target.checked);
      }

      /** @protected */
      _toggleChecked(checked) {
        this.checked = checked;
      }
    },
);
