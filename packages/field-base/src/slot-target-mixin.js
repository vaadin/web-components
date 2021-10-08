/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';

/**
 * A mixin to copy the content from a source slot to a target element.
 *
 * @polymerMixin
 */
export const SlotTargetMixin = dedupingMixin(
  (superclass) =>
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
       * A reference to the source slot from which the nodes are copied to the target element.
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

        // Remove any existing clones from the slot target
        if (this.__slotTargetClones) {
          this.__slotTargetClones.forEach((node) => {
            if (node.parentElement === this._slotTarget) {
              this._slotTarget.removeChild(node);
            }
          });
          delete this.__slotTargetClones;
        }

        // Exclude whitespace text nodes
        const nodes = this._sourceSlot
          .assignedNodes({ flatten: true })
          .filter((node) => !(node.nodeType == Node.TEXT_NODE && node.textContent.trim() === ''));

        if (nodes.length > 0) {
          this._slotTarget.innerHTML = '';
          this.__copyNodesToSlotTarget(nodes);
        }
      }

      /**
       * Copies the nodes to the target element.
       *
       * @protected
       * @param {!Array<!Node>} nodes
       */
      __copyNodesToSlotTarget(nodes) {
        this.__slotTargetClones = this.__slotTargetClones || [];
        nodes.forEach((node) => {
          // Clone the nodes and append the clones to the target slot
          const clone = node.cloneNode(true);
          this.__slotTargetClones.push(clone);
          this._slotTarget.appendChild(clone);
          // Observe all changes to the source node to have the clones updated
          this.__sourceSlotObserver.observe(node, {
            attributes: true,
            childList: true,
            subtree: true,
            characterData: true
          });
        });
      }
    }
);
