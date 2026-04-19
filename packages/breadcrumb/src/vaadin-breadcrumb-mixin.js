/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/icon/vaadin-icon.js';
import { html, render } from 'lit';
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
         * Programmatic item data. When set, renders `<vaadin-breadcrumb-item>`
         * elements into light DOM. Each object has `text` (label), optional
         * `path` (navigation target), and optional `prefix` (icon name string).
         *
         * @type {Array<{text: string, path?: string, prefix?: string}>}
         */
        items: {
          type: Array,
          value: () => [],
        },

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

      if (props.has('items')) {
        this.__renderItems(this.items);
      }
    }

    /**
     * Renders `<vaadin-breadcrumb-item>` elements into light DOM
     * based on the `items` array property.
     * @param {Array<{text: string, path?: string, prefix?: string}>} items
     * @private
     */
    __renderItems(items = []) {
      render(
        html`${items.map(
          (item) => html`
            <vaadin-breadcrumb-item .path="${item.path || null}">
              ${item.prefix ? html`<vaadin-icon icon="${item.prefix}" slot="prefix"></vaadin-icon>` : ''} ${item.text}
            </vaadin-breadcrumb-item>
          `,
        )}`,
        this,
        { renderBefore: null },
      );
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
