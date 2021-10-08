/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
import { LabelMixin } from './label-mixin.js';
import { SlotTargetMixin } from './slot-target-mixin.js';

/**
 * A mixin to forward any content from the default slot to the label node.
 *
 * @polymerMixin
 * @mixes LabelMixin
 * @mixes SlotTargetMixin
 */
export const SlotLabelMixin = dedupingMixin(
  (superclass) =>
    class SlotLabelMixinClass extends SlotTargetMixin(LabelMixin(superclass)) {
      /** @protected */
      get _slotTarget() {
        return this._labelNode;
      }

      /** @protected */
      ready() {
        super.ready();

        if (this._labelNode) {
          // The default slot's content is moved to the label node
          // only after `LabelMixin` is initialized which means
          // we should manually toggle the `has-label` attribute
          // respecting the new label content.
          this._toggleHasLabelAttribute();
        }
      }
    }
);
