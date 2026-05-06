/**
 * @license
 * Copyright (c) 2019 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
// @ts-check -- gradual ts-check pilot, see proto/ts-check
import { ContentController } from './content-controller.js';

/**
 * @typedef {{
 *   ready(): void;
 *   addController(controller: import('lit').ReactiveController): void;
 * }} HostInstance
 *
 * @typedef {new (...args: any[]) => HTMLElement & HostInstance} HostBaseClass
 */

/**
 * A mixin providing common functionality for making content collapsible,
 * used by `<vaadin-details>` and `<vaadin-accordion-panel>` elements.
 *
 * @polymerMixin
 * @template {HostBaseClass} T
 * @param {T} superClass
 */
export const CollapsibleMixin = (superClass) =>
  class CollapsibleMixinClass extends superClass {
    static get properties() {
      return {
        /**
         * If true, the collapsible content is visible.
         */
        opened: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
          notify: true,
        },

        /**
         * List of elements assigned to the default `<slot>`
         * that represent the collapsible content.
         *
         * @protected
         */
        _contentElements: {
          type: Array,
        },
      };
    }

    static get observers() {
      return ['_openedOrContentChanged(opened, _contentElements)'];
    }

    /**
     * @param {...any} args
     */
    constructor(...args) {
      super(...args);

      // Type-only declarations: assign each property its existing default so
      // the setter call is a no-op and Lit's reactive-property observers do
      // not fire during construction.
      /** @type {boolean} */
      this.opened = false;
      /** @type {HTMLElement[] | undefined} */
      this._contentElements = undefined;

      this._contentController = new ContentController(this);

      this._contentController.addEventListener('slot-content-changed', (event) => {
        const content = /** @type {{ nodes?: HTMLElement[] }} */ (event.target).nodes || [];

        // Exclude nodes that are no longer connected
        this._contentElements = content.filter((node) => node.parentNode === this);
      });
    }

    ready() {
      super.ready();

      this.addController(this._contentController);

      // Only handle click and not keydown, because `vaadin-details-summary` uses `ButtonMixin`
      // that already covers this logic, and `vaadin-accordion-heading` uses native `<button>`.
      this.addEventListener('click', ({ target }) => {
        if (/** @type {{ disabled?: boolean }} */ (this).disabled) {
          return;
        }

        // Do not change opened on link click
        if (target instanceof HTMLElement && target.localName === 'a') {
          return;
        }

        const summary = /** @type {{ focusElement?: HTMLElement }} */ (this).focusElement;

        if (summary && target instanceof Node && (target === summary || summary.contains(target))) {
          this.opened = !this.opened;
        }
      });
    }

    /**
     * @private
     * @param {boolean} opened
     * @param {HTMLElement[] | undefined} elements
     */
    _openedOrContentChanged(opened, elements) {
      if (elements) {
        elements.forEach((el) => {
          el.setAttribute('aria-hidden', opened ? 'false' : 'true');
        });
      }
    }
  };
