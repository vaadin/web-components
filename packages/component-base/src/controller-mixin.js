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

/**
 * A mixin for connecting controllers to the element.
 *
 * @polymerMixin
 */
export const ControllerMixin = dedupingMixin(
  (superClass) =>
    class ControllerMixinClass extends superClass {
      constructor() {
        super();

        /**
         * @type {Set<import('lit').ReactiveController>}
         */
        this.__controllers = new Set();
      }

      /** @protected */
      connectedCallback() {
        super.connectedCallback();

        this.__controllers.forEach((c) => {
          c.hostConnected && c.hostConnected();
        });
      }

      /** @protected */
      disconnectedCallback() {
        super.disconnectedCallback();

        this.__controllers.forEach((c) => {
          c.hostDisconnected && c.hostDisconnected();
        });
      }

      /**
       * Registers a controller to participate in the element update cycle.
       *
       * @param {import('lit').ReactiveController} controller
       * @protected
       */
      addController(controller) {
        this.__controllers.add(controller);
        // Call hostConnected if a controller is added after the element is attached.
        if (this.$ !== undefined && this.isConnected && controller.hostConnected) {
          controller.hostConnected();
        }
      }

      /**
       * Removes a controller from the element.
       *
       * @param {import('lit').ReactiveController} controller
       * @protected
       */
      removeController(controller) {
        this.__controllers.delete(controller);
      }
    },
);
