/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { LabelController } from './label-controller.js';

/**
 * A mixin to provide label via corresponding property or named slot.
 *
 * @polymerMixin
 * @mixes ControllerMixin
 */
export const LabelMixin = dedupingMixin(
  (superclass) =>
    class LabelMixinClass extends ControllerMixin(superclass) {
      static get properties() {
        return {
          /**
           * The label text for the input node.
           * When no light dom defined via [slot=label], this value will be used.
           */
          label: {
            type: String,
            observer: '_labelChanged',
          },
        };
      }

      /** @protected */
      get _labelId() {
        return this._labelController.labelId;
      }

      /** @protected */
      get _labelNode() {
        return this._labelController.node;
      }

      constructor() {
        super();

        this._labelController = new LabelController(this);
      }

      /** @protected */
      ready() {
        super.ready();

        this.addController(this._labelController);
      }

      /** @protected */
      _labelChanged(label) {
        this._labelController.setLabel(label);
      }
    },
);
