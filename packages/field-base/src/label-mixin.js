/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
// @ts-check -- gradual ts-check pilot, see proto/ts-check
import { LabelController } from './label-controller.js';

/**
 * @typedef {{
 *   ready(): void;
 *   addController(controller: import('lit').ReactiveController): void;
 * }} HostInstance
 */

/**
 * A mixin to provide label via corresponding property or named slot.
 *
 * @polymerMixin
 * @template {new (...args: any[]) => HTMLElement & HostInstance} T
 * @param {T} superclass
 */
export const LabelMixin = (superclass) =>
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

    /**
     * @param {...any} args
     */
    constructor(...args) {
      super(...args);

      /** @type {string | null | undefined} */
      this.label = undefined;

      this._labelController = new LabelController(this);

      this._labelController.addEventListener('slot-content-changed', (event) => {
        this.toggleAttribute('has-label', /** @type {CustomEvent} */ (event).detail.hasContent);
      });
    }

    /** @protected */
    get _labelId() {
      const node = this._labelNode;
      return node?.id;
    }

    /** @protected */
    get _labelNode() {
      return this._labelController.node;
    }

    ready() {
      super.ready();

      this.addController(this._labelController);
    }

    /**
     * @param {string | null | undefined} label
     * @protected
     */
    _labelChanged(label) {
      this._labelController.setLabel(label);
    }
  };
