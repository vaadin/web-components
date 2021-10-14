/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
import { SlotMixin } from '@vaadin/component-base/src/slot-mixin.js';

/**
 * A mixin to provide label via corresponding property or named slot.
 *
 * @polymerMixin
 * @mixes SlotMixin
 */
export const LabelMixin = dedupingMixin(
  (superclass) =>
    class LabelMixinClass extends SlotMixin(superclass) {
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
      get slots() {
        return {
          ...super.slots,
          label: () => {
            const label = document.createElement('label');
            label.textContent = this.label;
            return label;
          }
        };
      }

      /** @protected */
      get _labelNode() {
        return this._getDirectSlotChild('label');
      }

      constructor() {
        super();

        // Ensure every instance has unique ID
        const uniqueId = (LabelMixinClass._uniqueLabelId = 1 + LabelMixinClass._uniqueLabelId || 0);
        this._labelId = `label-${this.localName}-${uniqueId}`;

        /**
         * @type {MutationObserver}
         * @private
         */
        this.__labelNodeObserver = new MutationObserver(() => {
          this._toggleHasLabelAttribute();
        });
      }

      /** @protected */
      ready() {
        super.ready();

        if (this._labelNode) {
          this._labelNode.id = this._labelId;
          this._toggleHasLabelAttribute();

          this.__labelNodeObserver.observe(this._labelNode, { childList: true });
        }
      }

      /** @protected */
      _labelChanged(label) {
        if (this._labelNode) {
          this._labelNode.textContent = label;
          this._toggleHasLabelAttribute();
        }
      }

      /** @protected */
      _toggleHasLabelAttribute() {
        if (this._labelNode) {
          const hasLabel = this._labelNode.children.length > 0 || this._labelNode.textContent.trim() !== '';

          this.toggleAttribute('has-label', hasLabel);
          this.dispatchEvent(new CustomEvent('has-label-changed', { detail: { value: hasLabel } }));
        }
      }
    }
);
