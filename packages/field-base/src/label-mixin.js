/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { LabelController } from './label-controller.js';

/**
 * A mixin to provide label via corresponding property or named slot.
 *
 * @polymerMixin
 */
export const LabelMixin = dedupeMixin(
  (superclass) =>
    class LabelMixinClass extends superclass {
      static get properties() {
        return {
          /**
           * The label text for the input node.
           * When no light dom defined via [slot=label], this value will be used.
           */
          label: {
            type: String,
            observer: '_labelChanged',
          },
        };
      }

      constructor() {
        super();

        this._labelController = new LabelController(this);

        this._labelController.addEventListener('slot-content-changed', (event) => {
          this.toggleAttribute('has-label', event.detail.hasContent);
        });
      }

      /** @protected */
      get _labelId() {
        const node = this._labelNode;
        return node && node.id;
      }

      /** @protected */
      get _labelNode() {
        return this._labelController.node;
      }

      /** @protected */
      ready() {
        super.ready();

        this.addController(this._labelController);
      }

      /** @protected */
      _labelChanged(label) {
        this._labelController.setLabel(label);
      }
    },
);
