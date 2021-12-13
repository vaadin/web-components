/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';

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
      get _labelNode() {
        return this._labelController.getSlotChild('label');
      }

      constructor() {
        super();

        // Ensure every instance has unique ID
        const uniqueId = (LabelMixinClass._uniqueLabelId = 1 + LabelMixinClass._uniqueLabelId || 0);
        this._labelId = `label-${this.localName}-${uniqueId}`;

        this._labelController = new SlotController(
          this,
          'label',
          () => document.createElement('label'),
          (host, node, isCustom) => {
            // Do not override custom content.
            if (!isCustom) {
              node.textContent = host.label;
            }

            // Do not override custom label id.
            if (!node.id) {
              node.id = host._labelId;
            }

            this._toggleHasLabelAttribute(node);

            const labelNodeObserver = new MutationObserver(() => {
              this._toggleHasLabelAttribute(node);
            });

            labelNodeObserver.observe(node, { childList: true, subtree: true, characterData: true });
          }
        );

        this.addController(this._labelController);
      }

      /** @protected */
      _labelChanged(label) {
        const labelNode = this._labelNode;
        if (labelNode) {
          labelNode.textContent = label;
          this._toggleHasLabelAttribute(labelNode);
        }
      }

      /** @protected */
      _toggleHasLabelAttribute(labelNode) {
        if (labelNode) {
          const hasLabel = labelNode.children.length > 0 || labelNode.textContent.trim() !== '';
          this.toggleAttribute('has-label', hasLabel);
        }
      }
    }
);
