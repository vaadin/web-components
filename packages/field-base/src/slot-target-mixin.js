import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';

const SlotTargetMixinImplementation = (superclass) =>
  class SlotTargetMixinClass extends superclass {
    /** @protected */
    ready() {
      super.ready();

      if (this._sourceSlot) {
        this.__forwardNodesToSlotTarget();

        this._sourceSlot.addEventListener('slotchange', () => {
          this.__forwardNodesToSlotTarget();
        });
      }
    }

    /**
     * A reference to the source slot from which the nodes are forwarded to the target element.
     *
     * @type {HTMLSlotElement | null}
     * @protected
     */
    get _sourceSlot() {
      console.warn(`Please implement the '_sourceSlot' property in <${this.localName}>`);
      return null;
    }

    /**
     * A reference to the target element to which the nodes are forwarded from the source slot.
     *
     * @type {HTMLElement | null}
     * @protected
     */
    get _slotTarget() {
      console.warn(`Please implement the '_slotTarget' property in <${this.localName}>`);
      return null;
    }

    /**
     * Forwards every node from the source slot to the target element
     * once the source slot' content is changed.
     *
     * @private
     */
    __forwardNodesToSlotTarget() {
      if (!this._slotTarget) {
        return;
      }

      let nodes = this._sourceSlot.assignedNodes({ flatten: true });
      // issue 2709 - whitespace becomes a node
      nodes = nodes.filter(node => !(node.nodeValue === " " && node.nodeType === 3));
      if (nodes.length > 0) {
        this._slotTarget.replaceChildren(...nodes);
      }
    }
  };

/**
 * A mixin to forward the content from a source slot to a target element.
 */
export const SlotTargetMixin = dedupingMixin(SlotTargetMixinImplementation);
