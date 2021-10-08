/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';

/**
 * A mixin that manages keyboard handling.
 * The mixin subscribes to the keyboard events while an actual implementation
 * for the event handlers is left to the client (a component or another mixin).
 *
 * @polymerMixin
 */
export const KeyboardMixin = dedupingMixin(
  (superclass) =>
    class KeyboardMixinClass extends superclass {
      /** @protected */
      ready() {
        super.ready();

        this.addEventListener('keydown', (event) => {
          this._onKeyDown(event);
        });

        this.addEventListener('keyup', (event) => {
          this._onKeyUp(event);
        });
      }

      /**
       * A handler for the `keydown` event. By default, it does nothing.
       * Override the method to implement your own behavior.
       *
       * @param {KeyboardEvent} _event
       * @protected
       */
      _onKeyDown(_event) {
        // To be implemented.
      }

      /**
       * A handler for the `keyup` event. By default, it does nothing.
       * Override the method to implement your own behavior.
       *
       * @param {KeyboardEvent} _event
       * @protected
       */
      _onKeyUp(_event) {
        // To be implemented.
      }
    }
);
