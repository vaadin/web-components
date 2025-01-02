/**
 * @license
 * Copyright (c) 2019 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ContentController } from './content-controller.js';

/**
 * A mixin providing common functionality for making content collapsible,
 * used by `<vaadin-details>` and `<vaadin-accordion-panel>` elements.
 *
 * @polymerMixin
 */
export const CollapsibleMixin = (superClass) =>
  class CollapsibleMixinClass extends superClass {
    static get properties() {
      return {
        /**
         * If true, the collapsible content is visible.
         * @type {boolean}
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

    constructor() {
      super();

      this._contentController = new ContentController(this);

      this._contentController.addEventListener('slot-content-changed', (event) => {
        const content = event.target.nodes || [];

        // Exclude nodes that are no longer connected
        this._contentElements = content.filter((node) => node.parentNode === this);
      });
    }

    /** @protected */
    ready() {
      super.ready();

      this.addController(this._contentController);

      // Only handle click and not keydown, because `vaadin-details-summary` uses `ButtonMixin`
      // that already covers this logic, and `vaadin-accordion-heading` uses native `<button>`.
      this.addEventListener('click', ({ target }) => {
        if (this.disabled) {
          return;
        }

        // Do not change opened on link click
        if (target.localName === 'a') {
          return;
        }

        const summary = this.focusElement;

        if (summary && (target === summary || summary.contains(target))) {
          this.opened = !this.opened;
        }
      });
    }

    /** @private */
    _openedOrContentChanged(opened, elements) {
      if (elements) {
        elements.forEach((el) => {
          el.setAttribute('aria-hidden', opened ? 'false' : 'true');
        });
      }
    }
  };
