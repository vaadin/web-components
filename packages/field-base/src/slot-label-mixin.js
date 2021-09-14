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

/**
 * A mixin to forward any content from the default slot to the label node.
 */
export const SlotLabelMixin = dedupingMixin(SlotLabelMixinImplementation);
