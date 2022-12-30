/**
 * @license
 * Copyright (c) 2019 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ContentController } from './content-controller.js';

/**
 * A mixin providing common details functionality.
 *
 * @polymerMixin
 */
export const DetailsMixin = (superClass) =>
  class DetailsMixinClass extends superClass {
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
         * List of elements passed to the details default slot.
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
    }

    /** @protected */
    ready() {
      super.ready();

      // Only handle click and not keydown, because `vaadin-details-summary` uses `ButtonMixin`
      // that already covers this logic, and `vaadin-accordion-heading` uses native `<button>`.
      this.addEventListener('click', (event) => {
        if (event.target === this.focusElement) {
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
