/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * @polymerMixin
 */
export const MultiSelectComboBoxMixin = (base) =>
  class extends base {
    static get properties() {
      return {
        /**
         * A full set of items to filter the visible options from.
         * The items can be of either `String` or `Object` type.
         */
        items: {
          type: Array
        },

        /**
         * The item property used for a visual representation of the item.
         * @attr {string} item-label-path
         */
        itemLabelPath: {
          type: String
        }
      };
    }

    /**
     * Returns the item display label.
     * @protected
     */
    _getItemLabel(item, itemLabelPath) {
      return item && Object.prototype.hasOwnProperty.call(item, itemLabelPath) ? item[itemLabelPath] : item;
    }
  };
