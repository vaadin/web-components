/**
 * @license
 * Copyright (c) 2015 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { isTouch } from '@vaadin/component-base/src/browser-utils.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { DisabledMixin } from '@vaadin/component-base/src/disabled-mixin.js';
import { KeyboardMixin } from '@vaadin/component-base/src/keyboard-mixin.js';
import { processTemplates } from '@vaadin/component-base/src/templates.js';
import { InputMixin } from '@vaadin/field-base/src/input-mixin.js';
import { VirtualKeyboardController } from '@vaadin/field-base/src/virtual-keyboard-controller.js';
import { ComboBoxPlaceholder } from './vaadin-combo-box-placeholder.js';

/**
 * @polymerMixin
 * @param {function(new:HTMLElement)} subclass
 */
export const ComboBoxMixin = (subclass) =>
  class VaadinComboBoxMixinElement extends ControllerMixin(KeyboardMixin(InputMixin(DisabledMixin(subclass)))) {
    static get properties() {
      return {
        /**
         * True if the dropdown is open, false otherwise.
         * @type {boolean}
         */
        opened: {
          type: Boolean,
          notify: true,
          value: false,
          reflectToAttribute: true,
          observer: '_openedChanged',
        },

        /**
         * Set true to prevent the overlay from opening automatically.
         * @attr {boolean} auto-open-disabled
         */
        autoOpenDisabled: {
          type: Boolean,
        },

        /**
         * When present, it specifies that the field is read-only.
         * @type {boolean}
         */
        readonly: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
        },

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
        renderer: Function,

        /**
         * A full set of items to filter the visible options from.
         * The items can be of either `String` or `Object` type.
         * @type {!Array<!ComboBoxItem | string> | undefined}
         */
        items: {
          type: Array,
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
        },

        /**
         * Used to detect user value changes and fire `change` events.
         * @private
         */
        _lastCommittedValue: String,

        /**
         * When set to `true`, "loading" attribute is added to host and the overlay element.
         * @type {boolean}
         */
        loading: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
          observer: '_loadingChanged',
        },

        /**
         * @type {number}
         * @protected
         */
        _focusedIndex: {
          type: Number,
          observer: '_focusedIndexChanged',
          value: -1,
        },

        /**
         * Filtering string the user has typed into the input field.
         * @type {string}
         */
        filter: {
          type: String,
          value: '',
          notify: true,
        },

        /**
         * The selected item from the `items` array.
         * @type {ComboBoxItem | string | undefined}
         */
        selectedItem: {
          type: Object,
          notify: true,
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
        },

        /**
         * Path for the id of the item. If `items` is an array of objects,
         * the `itemIdPath` is used to compare and identify the same item
         * in `selectedItem` and `filteredItems` (items given by the
         * `dataProvider` callback).
         * @attr {string} item-id-path
         */
        itemIdPath: String,

        /**
         * @type {!HTMLElement | undefined}
         * @protected
         */
        _toggleElement: {
          type: Object,
          observer: '_toggleElementChanged',
        },

        /** @private */
        _closeOnBlurIsPrevented: Boolean,

        /** @private */
        __restoreFocusOnClose: Boolean,
      };
    }

    static get observers() {
      return [
        '_filterChanged(filter, itemValuePath, itemLabelPath)',
        '_filteredItemsChanged(filteredItems)',
        '_selectedItemChanged(selectedItem, itemValuePath, itemLabelPath)',
      ];
    }

    constructor() {
      super();
      this._boundOnFocusout = this._onFocusout.bind(this);
      this._boundOverlaySelectedItemChanged = this._overlaySelectedItemChanged.bind(this);
      this._boundOnClearButtonMouseDown = this.__onClearButtonMouseDown.bind(this);
      this._boundClose = this.close.bind(this);
      this._boundOnOpened = this._onOpened.bind(this);
      this._boundOnClick = this._onClick.bind(this);
      this._boundOnOverlayTouchAction = this._onOverlayTouchAction.bind(this);
      this._boundOnTouchend = this._onTouchend.bind(this);
    }

    /**
     * @return {string | undefined}
     * @protected
     */
    get _inputElementValue() {
      return this.inputElement ? this.inputElement[this._propertyForValue] : undefined;
    }

    /**
     * @param {string} value
     * @protected
     */
    set _inputElementValue(value) {
      if (this.inputElement) {
        this.inputElement[this._propertyForValue] = value;
      }
    }

    /**
     * Override method inherited from `InputMixin`
     * to customize the input element.
     * @protected
     * @override
     */
    _inputElementChanged(input) {
      super._inputElementChanged(input);

      if (input) {
        input.autocomplete = 'off';
        input.autocapitalize = 'off';

        input.setAttribute('role', 'combobox');
        input.setAttribute('aria-autocomplete', 'list');
        input.setAttribute('aria-expanded', !!this.opened);

        // Disable the macOS Safari spell check auto corrections.
        input.setAttribute('spellcheck', 'false');

        // Disable iOS autocorrect suggestions.
        input.setAttribute('autocorrect', 'off');

        this._revertInputValueToValue();

        if (this.clearElement) {
          this.clearElement.addEventListener('mousedown', this._boundOnClearButtonMouseDown);
        }
      }
    }

    /** @protected */
    ready() {
      super.ready();

      this.addEventListener('focusout', this._boundOnFocusout);

      this._lastCommittedValue = this.value;

      this.$.dropdown.addEventListener('selection-changed', this._boundOverlaySelectedItemChanged);

      this.addEventListener('vaadin-combo-box-dropdown-closed', this._boundClose);
      this.addEventListener('vaadin-combo-box-dropdown-opened', this._boundOnOpened);
      this.addEventListener('click', this._boundOnClick);

      this.$.dropdown.addEventListener('vaadin-overlay-touch-action', this._boundOnOverlayTouchAction);

      this.addEventListener('touchend', this._boundOnTouchend);

      const bringToFrontListener = () => {
        requestAnimationFrame(() => {
          this.$.dropdown.$.overlay.bringToFront();
        });
      };

      this.addEventListener('mousedown', bringToFrontListener);
      this.addEventListener('touchstart', bringToFrontListener);

      processTemplates(this);

      this.addController(new VirtualKeyboardController(this));
    }

    /**
     * Requests an update for the content of items.
     * While performing the update, it invokes the renderer (passed in the `renderer` property) once an item.
     *
     * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
     */
    requestContentUpdate() {
      if (!this.$.dropdown._scroller) {
        return;
      }

      this.$.dropdown._scroller.requestContentUpdate();

      this._getItemElements().forEach((item) => {
        item.requestContentUpdate();
      });
    }

    /**
     * Opens the dropdown list.
     */
    open() {
      // Prevent _open() being called when input is disabled or read-only
      if (!this.disabled && !this.readonly) {
        this.opened = true;
      }
    }

    /**
     * Closes the dropdown list.
     */
    close() {
      this.opened = false;
    }

    /** @private */
    _focusedIndexChanged(index, oldIndex) {
      if (oldIndex === undefined) {
        return;
      }
      this._updateActiveDescendant(index);
    }

    /** @private */
    _updateActiveDescendant(index) {
      const input = this.inputElement;
      if (!input) {
        return;
      }

      const item = this._getItemElements().find((el) => el.index === index);
      if (item) {
        input.setAttribute('aria-activedescendant', item.id);
      } else {
        input.removeAttribute('aria-activedescendant');
      }
    }

    /** @private */
    _openedChanged(opened, wasOpened) {
      // Prevent _close() being called when opened is set to its default value (false).
      if (wasOpened === undefined) {
        return;
      }

      if (opened) {
        this._openedWithFocusRing = this.hasAttribute('focus-ring');
        // For touch devices, we don't want to popup virtual keyboard
        // unless input element is explicitly focused by the user.
        if (!this.hasAttribute('focused') && !isTouch) {
          this.focus();
        }

        this.__restoreFocusOnClose = true;
      } else {
        this._onClosed();
        if (this._openedWithFocusRing && this.hasAttribute('focused')) {
          this.setAttribute('focus-ring', '');
        }
      }

      const input = this.inputElement;
      if (input) {
        input.setAttribute('aria-expanded', !!opened);

        if (opened) {
          input.setAttribute('aria-controls', this.$.dropdown.scrollerId);
        } else {
          input.removeAttribute('aria-controls');
        }
      }
    }

    /** @private */
    _onOverlayTouchAction() {
      // On touch devices, blur the input on touch start inside the overlay, in order to hide
      // the virtual keyboard. But don't close the overlay on this blur.
      this._closeOnBlurIsPrevented = true;
      this.inputElement.blur();
      this._closeOnBlurIsPrevented = false;
    }

    /** @protected */
    _isClearButton(event) {
      return event.composedPath()[0] === this.clearElement;
    }

    /**
     * @param {Event} event
     * @protected
     */
    _handleClearButtonClick(event) {
      event.preventDefault();
      this._clear();

      // De-select dropdown item
      if (this.opened) {
        this.requestContentUpdate();
      }
    }

    /**
     * @param {Event} event
     * @private
     */
    _onToggleButtonClick(event) {
      // Prevent parent components such as `vaadin-grid`
      // from handling the click event after it bubbles.
      event.preventDefault();

      if (this.opened) {
        this.close();
      } else {
        this.open();
      }
    }

    /**
     * @param {Event} event
     * @protected
     */
    _onHostClick(event) {
      if (!this.autoOpenDisabled) {
        event.preventDefault();
        this.open();
      }
    }

    /** @private */
    _onClick(e) {
      this._closeOnBlurIsPrevented = true;

      const path = e.composedPath();

      if (this._isClearButton(e)) {
        this._handleClearButtonClick(e);
      } else if (path.indexOf(this._toggleElement) > -1) {
        this._onToggleButtonClick(e);
      } else {
        this._onHostClick(e);
      }

      this._closeOnBlurIsPrevented = false;
    }

    /**
     * Override an event listener from `KeyboardMixin`.
     *
     * @param {KeyboardEvent} e
     * @protected
     * @override
     */
    _onKeyDown(e) {
      super._onKeyDown(e);

      if (e.key === 'Tab') {
        this.__restoreFocusOnClose = false;
      } else if (e.key === 'ArrowDown') {
        this._closeOnBlurIsPrevented = true;
        this._onArrowDown();
        this._closeOnBlurIsPrevented = false;

        // Prevent caret from moving
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        this._closeOnBlurIsPrevented = true;
        this._onArrowUp();
        this._closeOnBlurIsPrevented = false;

        // Prevent caret from moving
        e.preventDefault();
      }
    }

    /** @private */
    _getItemLabel(item) {
      return this.$.dropdown.getItemLabel(item);
    }

    /** @private */
    _getItemValue(item) {
      let value = item && this.itemValuePath ? this.get(this.itemValuePath, item) : undefined;
      if (value === undefined) {
        value = item ? item.toString() : '';
      }
      return value;
    }

    /** @private */
    _onArrowDown() {
      if (this.opened) {
        const items = this._getOverlayItems();
        if (items) {
          this._focusedIndex = Math.min(items.length - 1, this._focusedIndex + 1);
          this._prefillFocusedItemLabel();
        }
      } else {
        this.open();
      }
    }

    /** @private */
    _onArrowUp() {
      if (this.opened) {
        if (this._focusedIndex > -1) {
          this._focusedIndex = Math.max(0, this._focusedIndex - 1);
        } else {
          const items = this._getOverlayItems();
          if (items) {
            this._focusedIndex = items.length - 1;
          }
        }

        this._prefillFocusedItemLabel();
      } else {
        this.open();
      }
    }

    /** @private */
    _prefillFocusedItemLabel() {
      if (this._focusedIndex > -1) {
        this._inputElementValue = this._getItemLabel(this.$.dropdown.focusedItem);
        this._markAllSelectionRange();
      }
    }

    /** @private */
    _setSelectionRange(start, end) {
      // Setting selection range focuses and/or moves the caret in some browsers,
      // and there's no need to modify the selection range if the input isn't focused anyway.
      // This affects Safari. When the overlay is open, and then hitting tab, browser should focus
      // the next focusable element instead of the combo-box itself.
      // Checking the focused property here is enough instead of checking the activeElement.
      if (this.hasAttribute('focused')) {
        this.inputElement.setSelectionRange(start, end);
      }
    }

    /** @private */
    _markAllSelectionRange() {
      if (this._inputElementValue !== undefined) {
        this._setSelectionRange(0, this._inputElementValue.length);
      }
    }

    /** @private */
    _clearSelectionRange() {
      if (this._inputElementValue !== undefined) {
        const pos = this._inputElementValue ? this._inputElementValue.length : 0;
        this._setSelectionRange(pos, pos);
      }
    }

    /** @private */
    _closeOrCommit() {
      if (!this.opened && !this.loading) {
        this._commitValue();
      } else {
        this.close();
      }
    }

    /**
     * Override an event listener from `KeyboardMixin`.
     *
     * @param {KeyboardEvent} e
     * @protected
     * @override
     */
    _onEnter(e) {
      // Do not commit value when custom values are disallowed and input value is not a valid option
      // also stop propagation of the event, otherwise the user could submit a form while the input
      // still contains an invalid value
      if (!this.allowCustomValue && this._inputElementValue !== '' && this._focusedIndex < 0) {
        // Do not submit the surrounding form.
        e.preventDefault();
        // Do not trigger global listeners
        e.stopPropagation();
        return;
      }

      // Stop propagation of the enter event only if the dropdown is opened, this
      // "consumes" the enter event for the action of closing the dropdown
      if (this.opened) {
        // Do not submit the surrounding form.
        e.preventDefault();
        // Do not trigger global listeners
        e.stopPropagation();
      }

      this._closeOrCommit();
    }

    /**
     * Override an event listener from `KeyboardMixin`.
     * Do not call `super` in order to override clear
     * button logic defined in `InputControlMixin`.
     *
     * @param {!KeyboardEvent} e
     * @protected
     * @override
     */
    _onEscape(e) {
      if (this.autoOpenDisabled) {
        // Auto-open is disabled
        if (this.opened || (this.value !== this._inputElementValue && this._inputElementValue.length > 0)) {
          // The overlay is open or
          // The input value has changed but the change hasn't been committed, so cancel it.
          e.stopPropagation();
          this._focusedIndex = -1;
          this.cancel();
        } else if (this.clearButtonVisible && !this.opened && !!this.value) {
          e.stopPropagation();
          // The clear button is visible and the overlay is closed, so clear the value.
          this._clear();
        }
      } else if (this.opened) {
        // Auto-open is enabled
        // The overlay is open
        e.stopPropagation();

        if (this._focusedIndex > -1) {
          // An item is focused, revert the input to the filtered value
          this._focusedIndex = -1;
          this._revertInputValue();
        } else {
          // No item is focused, cancel the change and close the overlay
          this.cancel();
        }
      } else if (this.clearButtonVisible && !!this.value) {
        e.stopPropagation();
        // The clear button is visible and the overlay is closed, so clear the value.
        this._clear();
      }
    }

    /** @private */
    _toggleElementChanged(toggleElement) {
      if (toggleElement) {
        // Don't blur the input on toggle mousedown
        toggleElement.addEventListener('mousedown', (e) => e.preventDefault());
        // Unfocus previously focused element if focus is not inside combo box (on touch devices)
        toggleElement.addEventListener('click', () => {
          if (isTouch && !this.hasAttribute('focused')) {
            document.activeElement.blur();
          }
        });
      }
    }

    /**
     * Clears the current value.
     * @protected
     */
    _clear() {
      this.selectedItem = null;

      if (this.allowCustomValue) {
        this.value = '';
      }

      this._detectAndDispatchChange();
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

    /** @private */
    _onOpened() {
      // Defer scroll position adjustment to improve performance.
      requestAnimationFrame(() => {
        this.$.dropdown.adjustScrollPosition();

        // Set attribute after the items are rendered when overlay is opened for the first time.
        this._updateActiveDescendant(this._focusedIndex);
      });

      // _detectAndDispatchChange() should not consider value changes done before opening
      this._lastCommittedValue = this.value;
    }

    /** @private */
    _onClosed() {
      if (!this.loading || this.allowCustomValue) {
        this._commitValue();
      }
    }

    /** @private */
    _commitValue() {
      const items = this._getOverlayItems();
      if (items && this._focusedIndex > -1) {
        const focusedItem = items[this._focusedIndex];
        if (this.selectedItem !== focusedItem) {
          this.selectedItem = focusedItem;
        }
        // Make sure input field is updated in case value doesn't change (i.e. FOO -> foo)
        this._inputElementValue = this._getItemLabel(this.selectedItem);
      } else if (this._inputElementValue === '' || this._inputElementValue === undefined) {
        this.selectedItem = null;

        if (this.allowCustomValue) {
          this.value = '';
        }
      } else {
        const toLowerCase = (item) => item && item.toLowerCase && item.toLowerCase();

        // Try to find an item whose label matches the input value. A matching item is searched from
        // the filteredItems array (if available) and the selectedItem (if available).
        const itemMatchingByLabel = [...(this.filteredItems || []), this.selectedItem].find((item) => {
          return toLowerCase(this._getItemLabel(item)) === toLowerCase(this._inputElementValue);
        });

        if (
          this.allowCustomValue &&
          // To prevent a repetitive input value being saved after pressing ESC and Tab.
          !itemMatchingByLabel
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
            this._selectItemForValue(customValue);
            this.value = customValue;
          }
        } else if (!this.allowCustomValue && !this.opened && itemMatchingByLabel) {
          // An item matching by label was found, select it.
          this.value = this._getItemValue(itemMatchingByLabel);
        } else {
          // Revert the input value
          this._inputElementValue = this.selectedItem ? this._getItemLabel(this.selectedItem) : this.value || '';
        }
      }

      this._detectAndDispatchChange();

      this._clearSelectionRange();

      this.filter = '';
    }

    /**
     * @return {string}
     * @protected
     */
    get _propertyForValue() {
      return 'value';
    }

    /**
     * Override an event listener from `InputMixin`.
     * @param {!Event} event
     * @protected
     * @override
     */
    _onInput(event) {
      if (!this.opened && !this._isClearButton(event) && !this.autoOpenDisabled) {
        this.open();
      }

      const value = this._inputElementValue;
      if (this.filter === value) {
        // Filter and input value might get out of sync, while keyboard navigating for example.
        // Afterwards, input value might be changed to the same value as used in filtering.
        // In situation like these, we need to make sure all the filter changes handlers are run.
        this._filterChanged(this.filter, this.itemValuePath, this.itemLabelPath);
      } else {
        this.filter = value;
      }
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
    _filterChanged(filter, _itemValuePath, _itemLabelPath) {
      if (filter === undefined) {
        return;
      }

      // Scroll to the top of the list whenever the filter changes.
      this.$.dropdown._scrollIntoView(0);

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
    _loadingChanged(loading) {
      if (loading) {
        this._focusedIndex = -1;
      }
    }

    /** @protected */
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

          this._toggleHasValue(this.value !== '');
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

      this.$.dropdown._selectedItem = selectedItem;
      const items = this._getOverlayItems();
      if (this.filteredItems && items) {
        this._focusedIndex = this.filteredItems.indexOf(selectedItem);
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

      if (this._isValidValue(value)) {
        if (this._getItemValue(this.selectedItem) !== value) {
          this._selectItemForValue(value);
        }

        if (!this.selectedItem && this.allowCustomValue) {
          this._inputElementValue = value;
        }

        this._toggleHasValue(this.value !== '');
      } else {
        this.selectedItem = null;
      }

      this.filter = '';

      // In the next _detectAndDispatchChange() call, the change detection should pass
      this._lastCommittedValue = undefined;
    }

    /** @private */
    _detectAndDispatchChange() {
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
      } else if (this.__previousItems) {
        // Only clear filteredItems if the component had items previously but got cleared
        this.filteredItems = null;
      }

      const valueIndex = this._indexOfValue(this.value, items);
      this._focusedIndex = valueIndex;

      const item = valueIndex > -1 && items[valueIndex];
      if (item) {
        this.selectedItem = item;
      }
      this.__previousItems = items;
    }

    /** @private */
    _filteredItemsChanged(filteredItems, _itemValuePath, _itemLabelPath) {
      this._setOverlayItems(filteredItems);

      // When the external filtering is used and `value` was provided before `filteredItems`,
      // initialize the selected item with the current value here. This will also cause
      // the input element value to sync. In other cases, the selected item is already initialized
      // in other observers such as `valueChanged`, `_itemsChanged`.
      const valueIndex = this._indexOfValue(this.value, filteredItems);
      if (this.selectedItem === null && valueIndex >= 0) {
        this._selectItemForValue(this.value);
      }

      const inputValue = this._inputElementValue;
      if (inputValue === undefined || inputValue === this._getItemLabel(this.selectedItem)) {
        // When the input element value is the same as the current value or not defined,
        // set the focused index to the item that matches the value.
        this._focusedIndex = this.$.dropdown.indexOfLabel(this._getItemLabel(this.selectedItem));
      } else {
        // When the user filled in something that is different from the current value = filtering is enabled,
        // set the focused index to the item that matches the filter query.
        this._focusedIndex = this.$.dropdown.indexOfLabel(this.filter);
      }
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
      const valueIndex = this._indexOfValue(value, this.filteredItems);
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

    /** @protected */
    _getItemElements() {
      return Array.from(this.$.dropdown._scroller.querySelectorAll('vaadin-combo-box-item'));
    }

    /** @private */
    _getOverlayItems() {
      return this.$.dropdown._items;
    }

    /** @private */
    _setOverlayItems(items) {
      this.$.dropdown.set('_items', items);
    }

    /** @private */
    _indexOfValue(value, items) {
      if (!items || !this._isValidValue(value)) {
        return -1;
      }

      return items.findIndex((item) => {
        if (item instanceof ComboBoxPlaceholder) {
          return false;
        }

        return this._getItemValue(item) === value;
      });
    }

    /**
     * Checks if the value is supported as an item value in this control.
     * @private
     */
    _isValidValue(value) {
      return value !== undefined && value !== null;
    }

    /** @private */
    _overlaySelectedItemChanged(e) {
      // Stop this private event from leaking outside.
      e.stopPropagation();

      if (e.detail.item instanceof ComboBoxPlaceholder) {
        // Placeholder items should not be selectable.
        return;
      }

      if (this.opened) {
        this._focusedIndex = this.filteredItems.indexOf(e.detail.item);
        this.close();
      } else if (this.selectedItem !== e.detail.item) {
        this.selectedItem = e.detail.item;
        this._detectAndDispatchChange();
      }
    }

    /** @private */
    __onClearButtonMouseDown(event) {
      event.preventDefault(); // Prevent native focusout event
      this.inputElement.focus();
    }

    /** @private */
    _onFocusout(event) {
      // Fixes the problem with `focusout` happening when clicking on the scroll bar on Edge
      if (event.relatedTarget === this.$.dropdown.$.overlay) {
        event.composedPath()[0].focus();
        return;
      }
      if (!this.readonly && !this._closeOnBlurIsPrevented) {
        // User's logic in `custom-value-set` event listener might cause input to blur,
        // which will result in attempting to commit the same custom value once again.
        if (!this.opened && this.allowCustomValue && this._inputElementValue === this._lastCustomValue) {
          delete this._lastCustomValue;
          return;
        }

        this._closeOrCommit();
      }
    }

    /** @private */
    _onTouchend(event) {
      if (!this.clearElement || event.composedPath()[0] !== this.clearElement) {
        return;
      }

      event.preventDefault();
      this._clear();
    }

    /**
     * Returns true if `value` is valid, and sets the `invalid` flag appropriately.
     *
     * @return {boolean} True if the value is valid and sets the `invalid` flag appropriately
     */
    validate() {
      return !(this.invalid = !this.checkValidity());
    }

    /**
     * Returns true if the current input value satisfies all constraints (if any).
     * You can override this method for custom validations.
     *
     * @return {boolean}
     */
    checkValidity() {
      if (super.checkValidity) {
        return super.checkValidity();
      }

      return !this.required || !!this.value;
    }

    /**
     * Fired when the value changes.
     *
     * @event value-changed
     * @param {Object} detail
     *  @param {String} detail.value the combobox value
     */

    /**
     * Fired when selected item changes.
     *
     * @event selected-item-changed
     * @param {Object} detail
     *  @param {Object|String} detail.value the selected item. Type is the same as the type of `items`.
     */

    /**
     * Fired when the user sets a custom value.
     * @event custom-value-set
     * @param {String} detail the custom value
     */

    /**
     * Fired when value changes.
     * To comply with https://developer.mozilla.org/en-US/docs/Web/Events/change
     * @event change
     */
  };
