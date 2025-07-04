/**
 * @license
 * Copyright (c) 2015 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { get } from '@vaadin/component-base/src/path-utils.js';
import { ValidateMixin } from '@vaadin/field-base/src/validate-mixin.js';
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
 * @mixes ValidateMixin
 * @param {function(new:HTMLElement)} superClass
 */
export const ComboBoxMixin = (superClass) =>
  class ComboBoxMixinClass extends ValidateMixin(ComboBoxBaseMixin(superClass)) {
    static get properties() {
      return {
        /**
         * Custom function for rendering the content of every item.
         * Receives three arguments:
         *
         * - `root` The `<vaadin-combo-box-item>` internal container DOM element.
         * - `comboBox` The reference to the `<vaadin-combo-box>` element.
         * - `model` The object with the properties related with the rendered
         *   item, contains:
         *   - `model.index` The index of the rendered item.
         *   - `model.item` The item.
         * @type {ComboBoxRenderer | undefined}
         */
        renderer: {
          type: Object,
          sync: true,
        },

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
         * If `true`, the user can input a value that is not present in the items list.
         * `value` property will be set to the input value in this case.
         * Also, when `value` is set programmatically, the input value will be set
         * to reflect that value.
         * @attr {boolean} allow-custom-value
         * @type {boolean}
         */
        allowCustomValue: {
          type: Boolean,
          value: false,
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
         * When set to `true`, "loading" attribute is added to host and the overlay element.
         * @type {boolean}
         */
        loading: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
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
         * The selected item from the `items` array.
         * @type {ComboBoxItem | string | undefined}
         */
        selectedItem: {
          type: Object,
          notify: true,
          sync: true,
        },

        /**
         * A function used to generate CSS class names for dropdown
         * items based on the item. The return value should be the
         * generated class name as a string, or multiple class names
         * separated by whitespace characters.
         */
        itemClassNameGenerator: {
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

        /**
         * Path for the id of the item. If `items` is an array of objects,
         * the `itemIdPath` is used to compare and identify the same item
         * in `selectedItem` and `filteredItems` (items given by the
         * `dataProvider` callback).
         * @attr {string} item-id-path
         */
        itemIdPath: {
          type: String,
          sync: true,
        },

        /** @private */
        __keepOverlayOpened: {
          type: Boolean,
          sync: true,
        },
      };
    }

    static get observers() {
      return [
        '_openedOrItemsChanged(opened, _dropdownItems, loading, __keepOverlayOpened)',
        '_selectedItemChanged(selectedItem, itemValuePath, itemLabelPath)',
        '_updateScroller(opened, _dropdownItems, _focusedIndex, _theme)',
      ];
    }

    /** @protected */
    ready() {
      super.ready();

      /**
       * Used to detect user value changes and fire `change` events.
       * Do not define in `properties` to avoid triggering updates.
       * @type {string}
       * @protected
       */
      this._lastCommittedValue = this.value;
    }

    /**
     * Requests an update for the content of items.
     * While performing the update, it invokes the renderer (passed in the `renderer` property) once an item.
     *
     * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
     */
    requestContentUpdate() {
      if (!this._scroller) {
        return;
      }

      this._scroller.requestContentUpdate();

      this._getItemElements().forEach((item) => {
        item.requestContentUpdate();
      });
    }

    /**
     * @param {Object} props
     * @protected
     */
    updated(props) {
      super.updated(props);

      ['loading', 'itemIdPath', 'itemClassNameGenerator', 'renderer', 'selectedItem'].forEach((prop) => {
        if (props.has(prop)) {
          this._scroller[prop] = this[prop];
        }
      });

      if (props.has('filter')) {
        this._filterChanged(this.filter);
      }
    }

    /** @private */
    _updateScroller(opened, items, focusedIndex, theme) {
      if (opened) {
        this._scroller.style.maxHeight =
          getComputedStyle(this).getPropertyValue(`--${this._tagNamePrefix}-overlay-max-height`) || '65vh';
      }

      this._scroller.setProperties({
        items: opened ? items : [],
        opened,
        focusedIndex,
        theme,
      });
    }

    /** @private */
    _openedOrItemsChanged(opened, items, loading, keepOverlayOpened) {
      // Close the overlay if there are no items to display.
      // See https://github.com/vaadin/vaadin-combo-box/pull/964
      this._overlayOpened = opened && (keepOverlayOpened || loading || !!(items && items.length));
    }

    /**
     * Override method from `ComboBoxBaseMixin` to deselect
     * dropdown item by requesting content update on clear.
     * @param {Event} event
     * @protected
     */
    _onClearButtonClick(event) {
      super._onClearButtonClick(event);

      if (this.opened) {
        this.requestContentUpdate();
      }
    }

    /**
     * Override method inherited from `InputMixin`
     * to revert the input value to value.
     * @protected
     * @override
     */
    _inputElementChanged(input) {
      super._inputElementChanged(input);

      if (input) {
        this._revertInputValueToValue();
      }
    }

    /**
     * Override method from `ComboBoxBaseMixin` to handle item label path.
     * @protected
     * @override
     */
    _getItemLabel(item) {
      let label = item && this.itemLabelPath ? get(this.itemLabelPath, item) : undefined;
      if (label === undefined || label === null) {
        label = item ? item.toString() : '';
      }
      return label;
    }

    /** @private */
    _getItemValue(item) {
      let value = item && this.itemValuePath ? get(this.itemValuePath, item) : undefined;
      if (value === undefined) {
        value = item ? item.toString() : '';
      }
      return value;
    }

    /**
     * Override method from `ComboBoxBaseMixin` to handle loading.
     * @protected
     * @override
     */
    _closeOrCommit() {
      if (!this.opened && !this.loading) {
        this._commitValue();
      } else {
        this.close();
      }
    }

    /**
     * Override method from `ComboBoxBaseMixin` to handle valid value.
     * @protected
     * @override
     */
    _hasValidInputValue() {
      const hasInvalidOption =
        this._focusedIndex < 0 &&
        this._inputElementValue !== '' &&
        this._getItemLabel(this.selectedItem) !== this._inputElementValue;

      return this.allowCustomValue || !hasInvalidOption;
    }

    /**
     * Override method from `ComboBoxBaseMixin`.
     * @protected
     * @override
     */
    _onEscapeCancel() {
      this.cancel();
    }

    /**
     * Override method from `ComboBoxBaseMixin` to reset selected item.
     * @protected
     * @override
     */
    _onClearAction() {
      this.selectedItem = null;

      if (this.allowCustomValue) {
        this.value = '';
      }

      this._detectAndDispatchChange();
    }

    /**
     * Clears the current filter. Should be used instead of setting the property
     * directly in order to allow overriding this in multi-select combo box.
     * @protected
     */
    _clearFilter() {
      this.filter = '';
    }

    /**
     * Reverts back to original value.
     */
    cancel() {
      this._revertInputValueToValue();
      // In the next _detectAndDispatchChange() call, the change detection should not pass
      this._lastCommittedValue = this.value;
      this._closeOrCommit();
    }

    /**
     * Override method from `ComboBoxBaseMixin` to store last committed value.
     * @protected
     * @override
     */
    _onOpened() {
      this.dispatchEvent(new CustomEvent('vaadin-combo-box-dropdown-opened', { bubbles: true, composed: true }));

      // _detectAndDispatchChange() should not consider value changes done before opening
      this._lastCommittedValue = this.value;
    }

    /**
     * Override method from `ComboBoxBaseMixin` to dispatch an event.
     * @protected
     * @override
     */
    _onOverlayClosed() {
      this.dispatchEvent(new CustomEvent('vaadin-combo-box-dropdown-closed', { bubbles: true, composed: true }));
    }

    /**
     * Override method from `ComboBoxBaseMixin` to commit value on overlay closing.
     * @protected
     * @override
     */
    _onClosed() {
      if (!this.loading || this.allowCustomValue) {
        this._commitValue();
      }
    }

    /**
     * Override method from `ComboBoxBaseMixin` to implement value commit logic.
     * @protected
     * @override
     */
    _commitValue() {
      if (this._focusedIndex > -1) {
        const focusedItem = this._dropdownItems[this._focusedIndex];
        if (this.selectedItem !== focusedItem) {
          this.selectedItem = focusedItem;
        }
        // Make sure input field is updated in case value doesn't change (i.e. FOO -> foo)
        this._inputElementValue = this._getItemLabel(this.selectedItem);
        this._focusedIndex = -1;
      } else if (this._inputElementValue === '' || this._inputElementValue === undefined) {
        this.selectedItem = null;

        if (this.allowCustomValue) {
          this.value = '';
        }
      } else {
        // Try to find an item which label matches the input value.
        const items = [this.selectedItem, ...(this._dropdownItems || [])];
        const itemMatchingInputValue = items[this.__getItemIndexByLabel(items, this._inputElementValue)];

        if (
          this.allowCustomValue &&
          // To prevent a repetitive input value being saved after pressing ESC and Tab.
          !itemMatchingInputValue
        ) {
          const customValue = this._inputElementValue;

          // Store reference to the last custom value for checking it on focusout.
          this._lastCustomValue = customValue;

          // An item matching by label was not found, but custom values are allowed.
          // Dispatch a custom-value-set event with the input value.
          const e = new CustomEvent('custom-value-set', {
            detail: customValue,
            composed: true,
            cancelable: true,
            bubbles: true,
          });
          this.dispatchEvent(e);
          if (!e.defaultPrevented) {
            this.value = customValue;
          }
        } else if (!this.allowCustomValue && !this.opened && itemMatchingInputValue) {
          // An item matching by label was found, select it.
          this.value = this._getItemValue(itemMatchingInputValue);
        } else {
          // Revert the input value
          this._revertInputValueToValue();
        }
      }

      this._detectAndDispatchChange();

      this._clearSelectionRange();

      this._clearFilter();
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
     * Override an event listener from `InputMixin`.
     * @param {!Event} event
     * @protected
     * @override
     */
    _onChange(event) {
      // Suppress the native change event fired on the native input.
      // We use `_detectAndDispatchChange` to fire a custom event.
      event.stopPropagation();
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

    /**
     * Override method from `ComboBoxBaseMixin` to handle reverting value.
     * @protected
     * @override
     */
    _revertInputValue() {
      if (this.filter !== '') {
        this._inputElementValue = this.filter;
      } else {
        this._revertInputValueToValue();
      }
      this._clearSelectionRange();
    }

    /** @private */
    _revertInputValueToValue() {
      if (this.allowCustomValue && !this.selectedItem) {
        this._inputElementValue = this.value;
      } else {
        this._inputElementValue = this._getItemLabel(this.selectedItem);
      }
    }

    /** @private */
    _selectedItemChanged(selectedItem) {
      if (selectedItem === null || selectedItem === undefined) {
        if (this.filteredItems) {
          if (!this.allowCustomValue) {
            this.value = '';
          }

          this._toggleHasValue(this._hasValue);
          this._inputElementValue = this.value;
        }
      } else {
        const value = this._getItemValue(selectedItem);
        if (this.value !== value) {
          this.value = value;
          if (this.value !== value) {
            // The value was changed to something else in value-changed listener,
            // so prevent from resetting it to the previous value.
            return;
          }
        }

        this._toggleHasValue(true);
        this._inputElementValue = this._getItemLabel(selectedItem);
      }
    }

    /**
     * Override an observer from `InputMixin`.
     * @protected
     * @override
     */
    _valueChanged(value, oldVal) {
      if (value === '' && oldVal === undefined) {
        // Initializing, no need to do anything
        // See https://github.com/vaadin/vaadin-combo-box/issues/554
        return;
      }

      if (isValidValue(value)) {
        if (this._getItemValue(this.selectedItem) !== value) {
          this._selectItemForValue(value);
        }

        if (!this.selectedItem && this.allowCustomValue) {
          this._inputElementValue = value;
        }

        this._toggleHasValue(this._hasValue);
      } else {
        this.selectedItem = null;
      }

      this._clearFilter();

      // In the next _detectAndDispatchChange() call, the change detection should pass
      this._lastCommittedValue = undefined;
    }

    /** @private */
    _detectAndDispatchChange() {
      // Do not validate when focusout is caused by document
      // losing focus, which happens on browser tab switch.
      if (document.hasFocus()) {
        this._requestValidation();
      }

      if (this.value !== this._lastCommittedValue) {
        this.dispatchEvent(new CustomEvent('change', { bubbles: true }));
        this._lastCommittedValue = this.value;
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

    /** @private */
    _selectItemForValue(value) {
      const valueIndex = this.__getItemIndexByValue(this.filteredItems, value);
      const previouslySelectedItem = this.selectedItem;

      if (valueIndex >= 0) {
        this.selectedItem = this.filteredItems[valueIndex];
      } else if (this.dataProvider && this.selectedItem === undefined) {
        this.selectedItem = undefined;
      } else {
        this.selectedItem = null;
      }

      if (this.selectedItem === null && previouslySelectedItem === null) {
        this._selectedItemChanged(this.selectedItem);
      }
    }

    /**
     * Provide items to be rendered in the dropdown.
     * Override this method to show custom items.
     *
     * @protected
     */
    _setDropdownItems(newItems) {
      const oldItems = this._dropdownItems;
      this._dropdownItems = newItems;

      // Store the currently focused item if any. The focused index preserves
      // in the case when more filtered items are loading but it is reset
      // when the user types in a filter query.
      const focusedItem = oldItems ? oldItems[this._focusedIndex] : null;

      // Try to sync `selectedItem` based on `value` once a new set of `filteredItems` is available
      // (as a result of external filtering or when they have been loaded by the data provider).
      // When `value` is specified but `selectedItem` is not, it means that there was no item
      // matching `value` at the moment `value` was set, so `selectedItem` has remained unsynced.
      const valueIndex = this.__getItemIndexByValue(newItems, this.value);
      if ((this.selectedItem === null || this.selectedItem === undefined) && valueIndex >= 0) {
        this.selectedItem = newItems[valueIndex];
      }

      // Try to first set focus on the item that had been focused before `newItems` were updated
      // if it is still present in the `newItems` array. Otherwise, set the focused index
      // depending on the selected item or the filter query.
      const focusedItemIndex = this.__getItemIndexByValue(newItems, this._getItemValue(focusedItem));
      if (focusedItemIndex > -1) {
        this._focusedIndex = focusedItemIndex;
      } else {
        // When the user filled in something that is different from the current value = filtering is enabled,
        // set the focused index to the item that matches the filter query.
        this._focusedIndex = this.__getItemIndexByLabel(newItems, this.filter);
      }
    }

    /**
     * Returns the first item that matches the provided value.
     *
     * @private
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
     *
     * @private
     */
    __getItemIndexByLabel(items, label) {
      if (!items || !label) {
        return -1;
      }

      return findItemIndex(items, (item) => {
        return this._getItemLabel(item).toString().toLowerCase() === label.toString().toLowerCase();
      });
    }

    /**
     * Override method from `ComboBoxBaseMixin`.
     * @protected
     * @override
     */
    _handleFocusOut() {
      // User's logic in `custom-value-set` event listener might cause input to blur,
      // which will result in attempting to commit the same custom value once again.
      if (!this.opened && this.allowCustomValue && this._inputElementValue === this._lastCustomValue) {
        delete this._lastCustomValue;
        return;
      }

      super._handleFocusOut();
    }

    /**
     * Fired when the value changes.
     *
     * @event value-changed
     * @param {Object} detail
     * @param {String} detail.value the combobox value
     */

    /**
     * Fired when selected item changes.
     *
     * @event selected-item-changed
     * @param {Object} detail
     * @param {Object|String} detail.value the selected item. Type is the same as the type of `items`.
     */

    /**
     * Fired when the user sets a custom value.
     * @event custom-value-set
     * @param {String} detail the custom value
     */

    /**
     * Fired when the user commits a value change.
     * @event change
     */

    /**
     * Fired after the `vaadin-combo-box-overlay` opens.
     *
     * @event vaadin-combo-box-dropdown-opened
     */

    /**
     * Fired after the `vaadin-combo-box-overlay` closes.
     *
     * @event vaadin-combo-box-dropdown-closed
     */
  };
