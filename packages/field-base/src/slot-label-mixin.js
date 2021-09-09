import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
import { LabelMixin } from './label-mixin.js';
import { SlotTargetMixin } from './slot-target-mixin.js';

const SlotLabelMixinImplementation = (superclass) =>
  class SlotLabelMixinClass extends SlotTargetMixin(LabelMixin(superclass)) {
    /** @protected */
    get _slotTarget() {
      return this._labelNode;
    }

    /** @protected */
    ready() {
      super.ready();

      if (this._labelNode) {
        this._toggleHasLabelAttribute();
      }
    }
  };

export const SlotLabelMixin = dedupingMixin(SlotLabelMixinImplementation);
