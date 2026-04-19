/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';

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
         * The accessible label for the breadcrumb navigation.
         * Mapped to `aria-label` on the host element.
         *
         * @type {string}
         */
        label: {
          type: String,
          value: 'Breadcrumb',
          attribute: false,
        },
      };
    }

    /** @protected */
    firstUpdated() {
      super.firstUpdated();

      // By default, if the user hasn't provided a custom role,
      // the role attribute is set to "navigation".
      if (!this.hasAttribute('role')) {
        this.setAttribute('role', 'navigation');
      }

      this.setAttribute('aria-label', this.label);

      this._itemsController = new SlotController(this, '', 'vaadin-breadcrumb-item', {
        observe: true,
        multiple: true,
      });
      this._itemsController.initAddedNode = () => {
        this.__updateCurrentItem();
      };
      this._itemsController.teardownNode = () => {
        this.__updateCurrentItem();
      };
      this.addController(this._itemsController);
    }

    /** @protected */
    updated(props) {
      super.updated(props);

      if (props.has('label')) {
        this.setAttribute('aria-label', this.label);
      }
    }

    /**
     * Updates the `current` property on breadcrumb items:
     * removes `current` from all items and sets it on the last one.
     * @private
     */
    __updateCurrentItem() {
      const items = this._itemsController.nodes;
      if (!items || items.length === 0) {
        return;
      }
      items.forEach((item) => {
        item.current = false;
      });
      items[items.length - 1].current = true;
    }
  };
