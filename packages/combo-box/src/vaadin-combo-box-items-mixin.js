/**
 * @license
 * Copyright (c) 2015 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { get } from '@vaadin/component-base/src/path-utils.js';
import { ComboBoxBaseMixin } from './vaadin-combo-box-base-mixin.js';
import { ComboBoxPlaceholder } from './vaadin-combo-box-placeholder.js';

/**
 * Checks if the value is supported as an item value in this control.
 *
 * @param {unknown} value
 * @return {boolean}
 */
function isValidValue(value) {
  return value !== undefined && value !== null;
}

/**
 * Returns the index of the first item that satisfies the provided testing function
 * ignoring placeholder items.
 *
 * @param {Array<ComboBoxItem | string>} items
 * @param {Function} callback
 * @return {number}
 */
function findItemIndex(items, callback) {
  return items.findIndex((item) => {
    if (item instanceof ComboBoxPlaceholder) {
      return false;
    }

    return callback(item);
  });
}

/**
 * @polymerMixin
 * @mixes ComboBoxBaseMixin
 */
export const ComboBoxItemsMixin = (superClass) =>
  class ComboBoxItemsMixinClass extends ComboBoxBaseMixin(superClass) {
    static get properties() {
      return {
        /**
         * A full set of items to filter the visible options from.
         * The items can be of either `String` or `Object` type.
         * @type {!Array<!ComboBoxItem | string> | undefined}
         */
        items: {
          type: Array,
          sync: true,
          observer: '_itemsChanged',
        },

        /**
         * A subset of items, filtered based on the user input. Filtered items
         * can be assigned directly to omit the internal filtering functionality.
         * The items can be of either `String` or `Object` type.
         * @type {!Array<!ComboBoxItem | string> | undefined}
         */
        filteredItems: {
          type: Array,
          observer: '_filteredItemsChanged',
          sync: true,
        },

        /**
         * Filtering string the user has typed into the input field.
         * @type {string}
         */
        filter: {
          type: String,
          value: '',
          notify: true,
          sync: true,
        },

        /**
         * A function that is used to generate the label for dropdown
         * items based on the item. Receives one argument:
         * - `item` The item to generate the label for.
         */
        itemLabelGenerator: {
          type: Object,
        },

        /**
         * Path for label of the item. If `items` is an array of objects, the
         * `itemLabelPath` is used to fetch the displayed string label for each
         * item.
         *
         * The item label is also used for matching items when processing user
         * input, i.e., for filtering and selecting items.
         * @attr {string} item-label-path
         * @type {string}
         */
        itemLabelPath: {
          type: String,
          value: 'label',
          observer: '_itemLabelPathChanged',
          sync: true,
        },

        /**
         * Path for the value of the item. If `items` is an array of objects, the
         * `itemValuePath:` is used to fetch the string value for the selected
         * item.
         *
         * The item value is used in the `value` property of the combo box,
         * to provide the form value.
         * @attr {string} item-value-path
         * @type {string}
         */
        itemValuePath: {
          type: String,
          value: 'value',
          sync: true,
        },
      };
    }

    /**
     * @param {Object} props
     * @protected
     */
    updated(props) {
      super.updated(props);

      if (props.has('filter')) {
        this._filterChanged(this.filter);
      }

      if (props.has('itemLabelGenerator')) {
        this.requestContentUpdate();
      }
    }

    /**
     * Override an event listener from `ComboBoxBaseMixin` to handle
     * batched setting of both `opened` and `filter` properties.
     * @param {!Event} event
     * @protected
     * @override
     */
    _onInput(event) {
      const filter = this._inputElementValue;

      // When opening dropdown on user input, both `opened` and `filter` properties are set.
      // Perform a batched property update instead of relying on sync property observers.
      // This is necessary to avoid an extra data-provider request for loading first page.
      const props = {};

      if (this.filter === filter) {
        // Filter and input value might get out of sync, while keyboard navigating for example.
        // Afterwards, input value might be changed to the same value as used in filtering.
        // In situation like these, we need to make sure all the filter changes handlers are run.
        this._filterChanged(this.filter);
      } else {
        props.filter = filter;
      }

      if (!this.opened && !this._isClearButton(event) && !this.autoOpenDisabled) {
        props.opened = true;
      }

      this.setProperties(props);
    }

    /**
     * Override method from `ComboBoxBaseMixin` to handle item label path.
     * @protected
     * @override
     */
    _getItemLabel(item) {
      if (typeof this.itemLabelGenerator === 'function' && item) {
        return this.itemLabelGenerator(item) || '';
      }

      let label = item && this.itemLabelPath ? get(this.itemLabelPath, item) : undefined;
      if (label === undefined || label === null) {
        label = item ? item.toString() : '';
      }
      return label;
    }

    /** @protected */
    _getItemValue(item) {
      let value = item && this.itemValuePath ? get(this.itemValuePath, item) : undefined;
      if (value === undefined) {
        value = item ? item.toString() : '';
      }
      return value;
    }

    /** @private */
    _itemLabelPathChanged(itemLabelPath) {
      if (typeof itemLabelPath !== 'string') {
        console.error('You should set itemLabelPath to a valid string');
      }
    }

    /** @private */
    _filterChanged(filter) {
      // Scroll to the top of the list whenever the filter changes.
      this._scrollIntoView(0);

      this._focusedIndex = -1;

      if (this.items) {
        this.filteredItems = this._filterItems(this.items, filter);
      } else {
        // With certain use cases (e. g., external filtering), `items` are
        // undefined. Filtering is unnecessary per se, but the filteredItems
        // observer should still be invoked to update focused item.
        this._filteredItemsChanged(this.filteredItems);
      }
    }

    /** @private */
    _itemsChanged(items, oldItems) {
      this._ensureItemsOrDataProvider(() => {
        this.items = oldItems;
      });

      if (items) {
        this.filteredItems = items.slice(0);
      } else if (oldItems) {
        // Only clear filteredItems if the component had items previously but got cleared
        this.filteredItems = null;
      }
    }

    /** @private */
    _filteredItemsChanged(filteredItems) {
      this._setDropdownItems(filteredItems);
    }

    /**
     * Provide items to be rendered in the dropdown.
     * Override to provide actual implementation.
     * @protected
     */
    _setDropdownItems() {
      // To be implemented
    }

    /** @private */
    _filterItems(arr, filter) {
      if (!arr) {
        return arr;
      }

      const filteredItems = arr.filter((item) => {
        filter = filter ? filter.toString().toLowerCase() : '';
        // Check if item contains input value.
        return this._getItemLabel(item).toString().toLowerCase().indexOf(filter) > -1;
      });

      return filteredItems;
    }

    /**
     * Returns the first item that matches the provided value.
     * @protected
     */
    __getItemIndexByValue(items, value) {
      if (!items || !isValidValue(value)) {
        return -1;
      }

      return findItemIndex(items, (item) => {
        return this._getItemValue(item) === value;
      });
    }

    /**
     * Returns the first item that matches the provided label.
     * Labels are matched against each other case insensitively.
     * @protected
     */
    __getItemIndexByLabel(items, label) {
      if (!items || !label) {
        return -1;
      }

      return findItemIndex(items, (item) => {
        return this._getItemLabel(item).toString().toLowerCase() === label.toString().toLowerCase();
      });
    }
  };
