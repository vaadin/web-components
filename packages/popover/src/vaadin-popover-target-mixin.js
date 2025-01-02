/**
 * @license
 * Copyright (c) 2024 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { microTask } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';

/**
 * A mixin providing popover target functionality.
 *
 * @polymerMixin
 */
export const PopoverTargetMixin = (superClass) =>
  class PopoverTargetMixinClass extends superClass {
    static get properties() {
      return {
        /**
         * The id of the element to be used as `target` value.
         * The element should be in the DOM by the time when
         * the attribute is set, otherwise a warning is shown.
         */
        for: {
          type: String,
          observer: '__forChanged',
        },

        /**
         * Reference to the DOM element used both to trigger the overlay
         * by user interaction and to visually position it on the screen.
         *
         * Defaults to an element referenced with `for` attribute, in
         * which case it must be located in the same shadow scope.
         */
        target: {
          type: Object,
        },

        /** @private */
        __isConnected: {
          type: Boolean,
          sync: true,
        },
      };
    }

    static get observers() {
      return ['__targetOrConnectedChanged(target, __isConnected)'];
    }

    /** @protected */
    connectedCallback() {
      super.connectedCallback();

      this.__isConnected = true;
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();

      this.__isConnected = false;
    }

    /** @private */
    __forChanged(forId) {
      if (forId) {
        this.__setTargetByIdDebouncer = Debouncer.debounce(this.__setTargetByIdDebouncer, microTask, () =>
          this.__setTargetById(forId),
        );
      }
    }

    /** @private */
    __setTargetById(targetId) {
      if (!this.isConnected) {
        return;
      }

      const target = this.getRootNode().getElementById(targetId);

      if (target) {
        this.target = target;
      } else {
        console.warn(`No element with id="${targetId}" set via "for" property found on the page.`);
      }
    }

    /** @private */
    __targetOrConnectedChanged(target, isConnected) {
      if (this.__previousTarget && (this.__previousTarget !== target || !isConnected)) {
        this._removeTargetListeners(this.__previousTarget);
      }

      if (target && isConnected) {
        this._addTargetListeners(target);
      }

      this.__previousTarget = target;
    }

    /**
     * @param {HTMLElement} _target
     * @protected
     */
    _addTargetListeners(_target) {
      // To be implemented.
    }

    /**
     * @param {HTMLElement} _target
     * @protected
     */
    _removeTargetListeners(_target) {
      // To be implemented.
    }
  };
