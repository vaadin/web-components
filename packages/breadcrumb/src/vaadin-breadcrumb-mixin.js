/**
 * @license
 * Copyright (c) 2025 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A mixin providing common breadcrumb functionality.
 *
 * @polymerMixin
 */
export const BreadcrumbMixin = (superClass) =>
  class BreadcrumbMixinClass extends superClass {
    static get properties() {
      return {
        /**
         * Accessible label for the breadcrumb navigation.
         * Applied as `aria-label` on the internal `<nav>` element.
         */
        label: {
          type: String,
          value: 'Breadcrumb',
        },
      };
    }

    /** @protected */
    firstUpdated() {
      super.firstUpdated();

      // Use presentation role on the host since <nav> is in shadow DOM
      if (!this.hasAttribute('role')) {
        this.setAttribute('role', 'presentation');
      }

      // Observe slot changes to update aria-current on last item
      const slot = this.shadowRoot.querySelector('slot');
      if (slot) {
        slot.addEventListener('slotchange', () => {
          this.__updateAriaCurrent();
        });
      }
    }

    /** @protected */
    updated(props) {
      super.updated(props);

      if (props.has('label')) {
        const nav = this.shadowRoot.querySelector('nav');
        if (nav) {
          nav.setAttribute('aria-label', this.label || '');
        }
      }
    }

    /**
     * Sets `aria-current="page"` on the last breadcrumb item if it has no href.
     * @private
     */
    __updateAriaCurrent() {
      const items = this.__getItems();
      items.forEach((item, index) => {
        if (index === items.length - 1 && item.href == null) {
          item.setAttribute('aria-current', 'page');
        } else {
          item.removeAttribute('aria-current');
        }
      });
    }

    /**
     * Returns all slotted breadcrumb items.
     * @private
     * @return {Array<Element>}
     */
    __getItems() {
      const slot = this.shadowRoot.querySelector('slot');
      if (!slot) {
        return [];
      }
      return slot.assignedElements().filter((el) => el.tagName.toLowerCase() === 'vaadin-breadcrumb-item');
    }
  };
