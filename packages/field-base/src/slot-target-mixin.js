import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';

const SlotTargetMixinImplementation = (superclass) =>
  class SlotTargetMixinClass extends superclass {
    /** @protected */
    ready() {
      super.ready();

      if (this._sourceSlot) {
        this.__sourceSlotObserver = new MutationObserver(() => this.__checkAndCopyNodesToSlotTarget());

        this.__checkAndCopyNodesToSlotTarget();

        this._sourceSlot.addEventListener('slotchange', () => {
          this.__checkAndCopyNodesToSlotTarget();
        });
      }
    }

    /**
     * A reference to the source slot from which the nodes are copies to the target element.
     *
     * @type {HTMLSlotElement | null}
     * @protected
     */
    get _sourceSlot() {
      console.warn(`Please implement the '_sourceSlot' property in <${this.localName}>`);
      return null;
    }

    /**
     * A reference to the target element to which the nodes are copied from the source slot.
     *
     * @type {HTMLElement | null}
     * @protected
     */
    get _slotTarget() {
      console.warn(`Please implement the '_slotTarget' property in <${this.localName}>`);
      return null;
    }

    /**
     * Copies every node from the source slot to the target element
     * once the source slot' content is changed.
     *
     * @private
     */
    __checkAndCopyNodesToSlotTarget() {
      this.__sourceSlotObserver.disconnect();

      if (!this._slotTarget) {
        return;
      }

      // Exclude whitespace text nodes
      const nodes = this._sourceSlot
        .assignedNodes({ flatten: true })
        .filter((node) => !(node.nodeType == Node.TEXT_NODE && node.textContent.trim() === ''));

      if (nodes.length > 0) {
        this.__copyNodesToSlotTarget(nodes);
      }
    }

    /**
     * Copies the nodes to the target element. Target element is cleared before
     * the nodes are copied.
     *
     * @protected
     * @param {Array<Node>} nodes
     */
    __copyNodesToSlotTarget(nodes) {
      this._slotTarget.innerHTML = '';

      nodes.forEach((node) => {
        // Clone the nodes and append the clones to the target slot
        this._slotTarget.appendChild(node.cloneNode(true));
        // Observe all changes to the source node to have the clones updated
        this.__sourceSlotObserver.observe(node, {
          attributes: true,
          childList: true,
          subtree: true,
          characterData: true
        });
      });
    }
  };

/**
 * A mixin to copy the content from a source slot to a target element.
 */
export const SlotTargetMixin = dedupingMixin(SlotTargetMixinImplementation);
