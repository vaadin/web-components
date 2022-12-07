/**
 * @license
 * Copyright (c) 2019 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

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

        /**
         * An element used to toggle the content visibility.
         *
         * @type {!HTMLElement | undefined}
         * @protected
         */
        _toggleElement: {
          type: Object,
          observer: '_toggleElementChanged',
        },
      };
    }

    static get observers() {
      return ['_openedOrToggleChanged(opened, _toggleElement)', '_openedOrContentChanged(opened, _contentElements)'];
    }

    /** @private */
    _openedOrContentChanged(opened, elements) {
      if (elements) {
        elements.forEach((el) => {
          el.setAttribute('aria-hidden', opened ? 'false' : 'true');
        });
      }
    }

    /** @private */
    _openedOrToggleChanged(opened, toggleElement) {
      if (toggleElement) {
        toggleElement.setAttribute('aria-expanded', opened ? 'true' : 'false');
      }
    }

    /** @private */
    _toggleElementChanged(toggleElement) {
      if (toggleElement) {
        // Only handle click and not keydown, because `vaadin-details-summary` uses `ButtonMixin`
        // that already covers this logic, and `vaadin-accordion-heading` uses native `<button>`.
        toggleElement.addEventListener('click', () => {
          this._toggle();
        });
      }
    }

    /** @private */
    _toggle() {
      this.opened = !this.opened;
    }
  };
