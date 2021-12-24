/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
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
         * When true, the component does not render tokens for every selected value.
         * Instead, only the number of currently selected items is shown.
         * @attr {boolean} compact-mode
         */
        compactMode: {
          type: Boolean
        },

        /**
         * Custom function for generating the display label when in compact mode.
         *
         * This function receives the array of selected items and should return
         * a string value that will be used as the display label.
         */
        compactModeLabelGenerator: {
          type: Object
        },

        /**
         * A full set of items to filter the visible options from.
         * The items can be of either `String` or `Object` type.
         */
        items: {
          type: Array
        },

        /**
         * The item property used for a visual representation of the item.
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

    /**
     * Retrieves the component display label when in compact mode.
     * @protected
     */
    _getCompactModeLabel(items) {
      if (typeof this.compactModeLabelGenerator === 'function') {
        return this.compactModeLabelGenerator(items);
      }

      const suffix = items.length === 0 || items.length > 1 ? 'values' : 'value';
      return `${items.length} ${suffix}`;
    }
  };
