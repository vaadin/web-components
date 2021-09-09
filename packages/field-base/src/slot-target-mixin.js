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
     * @type {HTMLSlotElement}
     * @protected
     */
    get _sourceSlot() {
      console.warn(`Please implement the '_sourceSlot' property in <${this.localName}>`);
      return null;
    }

    /**
     * @type {HTMLElement}
     * @protected
     */
    get _slotTarget() {
      console.warn(`Please implement the '_slotTarget' property in <${this.localName}>`);
      return null;
    }

    /** @protected */
    _onSlotTargetContentChange() {}

    /** @private */
    __onSourceSlotContentChange() {
      if (!this._slotTarget) {
        return;
      }

      const nodes = this._sourceSlot.assignedNodes({ flatten: true });
      if (nodes.length > 0) {
        this._slotTarget.replaceChildren(...nodes);
      }
    }

    /** @override */
    set textContent(text) {
      if (this._slotTarget) {
        this._slotTarget.textContent = text;
        return;
      }

      super.textContent = text;
    }

    /** @override */
    get textContent() {
      if (this._slotTarget) {
        return this._slotTarget.textContent;
      }

      return super.textContent;
    }

    /** @override */
    set innerHTML(html) {
      if (this._slotTarget) {
        this._slotTarget.innerHTML = html;
        return;
      }

      super.innerHTML = html;
    }

    /** @override */
    get innerHTML() {
      if (this._slotTarget) {
        return this._slotTarget.innerHTML;
      }

      return super.innerHTML;
    }
  };

/**
 * Mixin that moves any nodes added to a source slot to a target element.
 */
export const SlotTargetMixin = dedupingMixin(SlotTargetMixinImplementation);
