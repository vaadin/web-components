/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { LabelController } from './label-controller.js';

/**
 * A mixin to provide label via corresponding property or named slot.
 *
 * @polymerMixin
 * @mixes SlotMixin
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
            observer: '_labelChanged'
          }
        };
      }

      /** @protected */
      get _labelId() {
        return this._labelController.labelId;
      }

      /** @protected */
      get _labelNode() {
        return this._labelController.getSlotChild();
      }

      constructor() {
        super();

        // Ensure every instance has unique ID
        const uniqueId = (LabelMixinClass._uniqueLabelId = 1 + LabelMixinClass._uniqueLabelId || 0);
        const labelId = `label-${this.localName}-${uniqueId}`;

        this._labelController = new LabelController(this, labelId);
        this.addController(this._labelController);
      }

      /** @protected */
      _labelChanged(label) {
        this._labelController.setLabel(label);
      }
    }
);
