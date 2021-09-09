import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';

const SlotTargetMixinImplementation = (superclass) =>
  class SlotTargetMixinClass extends superclass {
    constructor() {
      super();

      /**
       * @type {MutationObserver}
       * @private
       */
      this.__slotTargetObserver = new MutationObserver(() => {
        this._onSlotTargetContentChange();
      });
    }

    /** @protected */
    ready() {
      super.ready();

      if (this._slotTarget) {
        // Observe for changes in the target element.
        this.__slotTargetObserver.observe(this._slotTarget, {
          childList: true
        });
      }

      if (this._sourceSlot) {
        // Observe for changes in the source slot.
        this._sourceSlot.addEventListener('slotchange', () => {
          this.__onSourceSlotContentChange();
        });

        this.__onSourceSlotContentChange();
      }
    }

    /**
     * A reference to the source slot from which the content is forwarded to the target element.
     *
     * @type {HTMLSlotElement | null}
     * @protected
     */
    get _sourceSlot() {
      console.warn(`Please implement the '_sourceSlot' property in <${this.localName}>`);
      return null;
    }

    /**
     * A reference to the target element to which the content is forwarded from the source slot.
     *
     * @type {HTMLElement | null}
     * @protected
     */
    get _slotTarget() {
      console.warn(`Please implement the '_slotTarget' property in <${this.localName}>`);
      return null;
    }

    /**
     * A callback method that is called once the target element's content is changed.
     *
     * By default, it does nothing. Override the method to implement your own behavior.
     *
     * @protected
     */
    _onSlotTargetContentChange() {}

    /**
     * Forwards every node from the source slot to the target element
     * once the source slot' content is changed.
     *
     * @private
     */
    __onSourceSlotContentChange() {
      if (!this._slotTarget) {
        return;
      }

      const nodes = this._sourceSlot.assignedNodes({ flatten: true });
      if (nodes.length > 0) {
        this._slotTarget.replaceChildren(...nodes);
      }
    }
  };

/**
 * A mixin to forward the content from a source slot to a target element.
 */
export const SlotTargetMixin = dedupingMixin(SlotTargetMixinImplementation);
