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
         * A content area controlled by the toggle element.
         *
         * @protected
         */
        _collapsible: {
          type: Object,
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
      return ['_openedOrToggleChanged(opened, _toggleElement)', '_openedOrCollapsibleChanged(opened, _collapsible)'];
    }

    /** @private */
    _openedOrCollapsibleChanged(opened, collapsible) {
      if (collapsible) {
        collapsible.setAttribute('aria-hidden', opened ? 'false' : 'true');
        collapsible.style.maxHeight = opened ? '' : '0px';
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
