/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { timeOut } from '@polymer/polymer/lib/utils/async.js';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';
import { flush } from '@polymer/polymer/lib/utils/flush.js';
import { IronA11yAnnouncer } from '@polymer/iron-a11y-announcer/iron-a11y-announcer.js';
import { processTemplates } from '@vaadin/vaadin-element-mixin/templates.js';
import { ComboBoxPlaceholder } from './vaadin-combo-box-placeholder.js';

/**
 * @polymerMixin
 */
export const ComboBoxMixin = (subclass) =>
  class VaadinComboBoxMixinElement extends subclass {
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
          observer: '_openedChanged'
        },

        /**
         * Set true to prevent the overlay from opening automatically.
         * @attr {boolean} auto-open-disabled
         */
        autoOpenDisabled: Boolean,

        /**
         * Set to true to disable this element.
         * @type {boolean}
         */
        disabled: {
          type: Boolean,
          value: false,
          reflectToAttribute: true
        },

        /**
         * When present, it specifies that the element field is read-only.
         * @type {boolean}
         */
        readonly: {
          type: Boolean,
          value: false,
          reflectToAttribute: true
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
          observer: '_itemsChanged'
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
          value: false
        },

        /**
         * A subset of items, filtered based on the user input. Filtered items
         * can be assigned directly to omit the internal filtering functionality.
         * The items can be of either `String` or `Object` type.
         * @type {!Array<!ComboBoxItem | string> | undefined}
         */
        filteredItems: {
          type: Array
        },

        /**
         * The `String` value for the selected item of the combo box.
         *
         * When there’s no item selected, the value is an empty string.
         *
         * Use `selectedItem` property to get the raw selected item from
         * the `items` array.
         * @type {string}
         */
        value: {
          type: String,
          observer: '_valueChanged',
          notify: true,
          value: ''
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
          reflectToAttribute: true
        },

        /**
         * @type {number}
         * @protected
         */
        _focusedIndex: {
          type: Number,
          value: -1
        },

        /**
         * Filtering string the user has typed into the input field.
         * @type {string}
         */
        filter: {
          type: String,
          value: '',
          notify: true
        },

        /**
         * The selected item from the `items` array.
         * @type {ComboBoxItem | string | undefined}
         */
        selectedItem: {
          type: Object,
          notify: true
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
          observer: '_itemLabelPathChanged'
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
          value: 'value'
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
         * The name of this element.
         */
        name: {
          type: String
        },

        /**
         * Set to true if the value is invalid.
         * @type {boolean}
         */
        invalid: {
          type: Boolean,
          reflectToAttribute: true,
          notify: true,
          value: false
        },

        /**
         * @type {!HTMLElement | undefined}
         * @protected
         */
        _toggleElement: Object,

        /**
         * @type {!HTMLElement | undefined}
         * @protected
         */
        _clearElement: Object,

        /** @protected */
        _inputElementValue: String,

        /** @private */
        _closeOnBlurIsPrevented: Boolean,

        /** @private */
        _previousDocumentPointerEvents: String
      };
    }

    static get observers() {
      return [
        '_filterChanged(filter, itemValuePath, itemLabelPath)',
        '_itemsOrPathsChanged(items.*, itemValuePath, itemLabelPath)',
        '_filteredItemsChanged(filteredItems.*, itemValuePath, itemLabelPath)',
        '_loadingChanged(loading)',
        '_selectedItemChanged(selectedItem, itemValuePath, itemLabelPath)',
        '_toggleElementChanged(_toggleElement)'
      ];
    }

    constructor() {
      super();
      this._boundOnFocusout = this._onFocusout.bind(this);
      this._boundOverlaySelectedItemChanged = this._overlaySelectedItemChanged.bind(this);
      this._boundClose = this.close.bind(this);
      this._boundOnOpened = this._onOpened.bind(this);
      this._boundOnKeyDown = this._onKeyDown.bind(this);
      this._boundOnClick = this._onClick.bind(this);
      this._boundOnOverlayTouchAction = this._onOverlayTouchAction.bind(this);
      this._boundOnTouchend = this._onTouchend.bind(this);
    }

    /** @protected */
    ready() {
      super.ready();

      this.addEventListener('focusout', this._boundOnFocusout);

      this._lastCommittedValue = this.value;
      IronA11yAnnouncer.requestAvailability();

      // 2.0 does not support 'overlay.selection-changed' syntax in listeners
      this.$.overlay.addEventListener('selection-changed', this._boundOverlaySelectedItemChanged);

      this.addEventListener('vaadin-combo-box-dropdown-closed', this._boundClose);
      this.addEventListener('vaadin-combo-box-dropdown-opened', this._boundOnOpened);
      this.addEventListener('keydown', this._boundOnKeyDown);
      this.addEventListener('click', this._boundOnClick);

      this.$.overlay.addEventListener('vaadin-overlay-touch-action', this._boundOnOverlayTouchAction);

      this.addEventListener('touchend', this._boundOnTouchend);

      const bringToFrontListener = () => {
        const overlay = this.$.overlay;
        const dropdown = overlay && overlay.$.dropdown;
        // Check dropdown.$ because overlay is lazily instantiated
        if (dropdown && dropdown.$) {
          requestAnimationFrame(() => {
            dropdown.$.overlay.bringToFront();
          });
        }
      };

      this.addEventListener('mousedown', bringToFrontListener);
      this.addEventListener('touchstart', bringToFrontListener);

      processTemplates(this);
    }

    /**
     * Requests an update for the content of items.
     * While performing the update, it invokes the renderer (passed in the `renderer` property) once an item.
     *
     * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
     */
    requestContentUpdate() {
      if (!this.$.overlay._selector) {
        return;
      }

      this.$.overlay._selector.querySelectorAll('vaadin-combo-box-item').forEach((item) => {
        item.requestContentUpdate();
      });
    }

    /**
     * Manually invoke existing renderer.
     *
     * @deprecated Since Vaadin 21, `render()` is deprecated. Please use `requestContentUpdate()` instead.
     */
    render() {
      console.warn('WARNING: Since Vaadin 21, render() is deprecated. Please use requestContentUpdate() instead.');

      this.requestContentUpdate();
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
    _openedChanged(value, old) {
      // Prevent _close() being called when opened is set to its default value (false).
      if (old === undefined) {
        return;
      }

      if (this.opened) {
        this._openedWithFocusRing =
          this.hasAttribute('focus-ring') || (this.focusElement && this.focusElement.hasAttribute('focus-ring'));
        // For touch devices, we don't want to popup virtual keyboard unless input is explicitly focused by the user.
        if (!this.hasAttribute('focused') && !this.$.overlay.touchDevice) {
          this.focus();
        }
      } else {
        this._onClosed();
        if (this._openedWithFocusRing && this.hasAttribute('focused')) {
          this.focusElement.setAttribute('focus-ring', '');
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

    /** @private */
    _onClick(e) {
      this._closeOnBlurIsPrevented = true;

      const path = e.composedPath();
      const isClearElement = path.indexOf(this._clearElement) !== -1 || path[0].getAttribute('part') === 'clear-button';
      if (isClearElement) {
        this._clear();
        this.focus();
      } else if (path.indexOf(this.inputElement) !== -1) {
        if (path.indexOf(this._toggleElement) > -1 && this.opened) {
          this.close();
        } else if (path.indexOf(this._toggleElement) > -1 || !this.autoOpenDisabled) {
          this.open();
        }
      }

      this._closeOnBlurIsPrevented = false;
    }

    /**
     * Keyboard navigation
     * @private
     */
    _onKeyDown(e) {
      if (e.keyCode === 40) {
        this._closeOnBlurIsPrevented = true;
        this._onArrowDown();
        this._closeOnBlurIsPrevented = false;

        // prevent caret from moving
        e.preventDefault();
      } else if (e.keyCode === 38) {
        this._closeOnBlurIsPrevented = true;
        this._onArrowUp();
        this._closeOnBlurIsPrevented = false;

        // prevent caret from moving
        e.preventDefault();
      } else if (e.keyCode === 13) {
        this._onEnter(e);
      } else if (e.keyCode === 27) {
        this._onEscape(e);
      }
    }

    /** @private */
    _getItemLabel(item) {
      return this.$.overlay.getItemLabel(item);
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
        if (this.$.overlay._items) {
          this._focusedIndex = Math.min(this.$.overlay._items.length - 1, this._focusedIndex + 1);
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
          if (this.$.overlay._items) {
            this._focusedIndex = this.$.overlay._items.length - 1;
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
        // Reset the input value asyncronously to prevent partial value changes
        // announce. Makes OSX VoiceOver to announce the complete value instead.
        this._inputElementValue = '';
        // 1ms delay needed for OSX VoiceOver to realise input value was reset
        setTimeout(() => {
          this._inputElementValue = this._getItemLabel(this.$.overlay._focusedItem);
          this._markAllSelectionRange();
        }, 1);
      }
    }

    /** @private */
    _setSelectionRange(start, end) {
      // vaadin-text-field does not implement setSelectionRange, hence we need the native input
      const input = this._nativeInput || this.inputElement;

      // Setting selection range focuses and/or moves the caret in some browsers,
      // and there's no need to modify the selection range if the input isn't focused anyway.
      // This affects Safari. When the overlay is open, and then hiting tab, browser should focus
      // the next focusable element instead of the combo-box itself.
      // Checking the focused property here is enough instead of checking the activeElement.
      if (this.hasAttribute('focused') && input && input.setSelectionRange) {
        input.setSelectionRange(start, end);
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

    /** @private */
    _onEnter(e) {
      // should close on enter when custom values are allowed, input field is cleared, or when an existing
      // item is focused with keyboard. If auto open is disabled, under the same conditions, commit value.
      if (
        (this.opened || this.autoOpenDisabled) &&
        (this.allowCustomValue || this._inputElementValue === '' || this._focusedIndex > -1)
      ) {
        this._closeOrCommit();

        // Do not submit the surrounding form.
        e.preventDefault();

        // Do not trigger global listeners
        e.stopPropagation();
      }
    }

    /**
     * @param {!KeyboardEvent} e
     * @protected
     */
    _onEscape(e) {
      if (this.autoOpenDisabled) {
        this._focusedIndex = -1;
        this.cancel();
      } else if (this.opened) {
        this._stopPropagation(e);

        if (this._focusedIndex > -1) {
          this._focusedIndex = -1;
          this._revertInputValue();
        } else {
          this.cancel();
        }
      }
    }

    /** @private */
    _toggleElementChanged(toggleElement) {
      if (toggleElement) {
        // Don't blur the input on toggle mousedown
        toggleElement.addEventListener('mousedown', (e) => e.preventDefault());
        // Unfocus previously focused element if focus is not inside combo box (on touch devices)
        toggleElement.addEventListener('click', () => {
          if (this.$.overlay.touchDevice && !this.hasAttribute('focused')) {
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
      // Pre P2 iron-list used a debouncer to render. Now that we synchronously render items,
      // we need to flush the DOM to make sure it doesn't get flushed in the middle of _render call
      // because that will cause problems to say the least.
      flush();

      // With iron-list v1.3.9, calling `notifyResize()` no longer renders
      // the items synchronously. It is required to have the items rendered
      // before we update the overlay and the list positions and sizes.
      this.$.overlay.ensureItemsRendered();
      this.$.overlay._selector.toggleScrollListener(true);

      // Ensure metrics are up-to-date
      this.$.overlay.updateViewportBoundaries();
      // Force iron-list to create reusable nodes. Otherwise it will only start
      // doing that in scroll listener, which might affect performance.
      // See https://github.com/vaadin/vaadin-combo-box/pull/776
      this.$.overlay._selector._increasePoolIfNeeded();
      setTimeout(() => this._resizeDropdown(), 1);
      // Defer scroll position adjustment to improve performance.
      window.requestAnimationFrame(() => this.$.overlay.adjustScrollPosition());

      // _detectAndDispatchChange() should not consider value changes done before opening
      this._lastCommittedValue = this.value;
    }

    /** @private */
    _onClosed() {
      // Happens when the overlay is closed by clicking outside
      if (this.opened) {
        this.close();
      }

      if (!this.loading || this.allowCustomValue) {
        this._commitValue();
      }
    }

    /** @private */
    _commitValue() {
      if (this.$.overlay._items && this._focusedIndex > -1) {
        const focusedItem = this.$.overlay._items[this._focusedIndex];
        if (this.selectedItem !== focusedItem) {
          this.selectedItem = focusedItem;
        }
        // make sure input field is updated in case value doesn't change (i.e. FOO -> foo)
        this._inputElementValue = this._getItemLabel(this.selectedItem);
      } else if (this._inputElementValue === '' || this._inputElementValue === undefined) {
        this.selectedItem = null;

        if (this.allowCustomValue) {
          this.value = '';
        }
      } else {
        const toLowerCase = (item) => item && item.toLowerCase && item.toLowerCase();
        const itemsMatchedByLabel =
          (this.filteredItems &&
            this.filteredItems.filter(
              (item) => toLowerCase(this._getItemLabel(item)) === toLowerCase(this._inputElementValue)
            )) ||
          [];
        if (
          this.allowCustomValue &&
          // to prevent a repetitive input value being saved after pressing ESC and Tab.
          !itemsMatchedByLabel.length
        ) {
          const e = new CustomEvent('custom-value-set', {
            detail: this._inputElementValue,
            composed: true,
            cancelable: true,
            bubbles: true
          });
          this.dispatchEvent(e);
          if (!e.defaultPrevented) {
            const customValue = this._inputElementValue;
            this._selectItemForValue(customValue);
            this.value = customValue;
          }
        } else if (!this.allowCustomValue && !this.opened && itemsMatchedByLabel.length > 0) {
          this.value = this._getItemValue(itemsMatchedByLabel[0]);
        } else {
          this._inputElementValue = this.selectedItem ? this._getItemLabel(this.selectedItem) : this.value || '';
        }
      }

      this._detectAndDispatchChange();

      this._clearSelectionRange();

      if (!this.dataProvider) {
        this.filter = '';
      }
    }

    /**
     * @return {string}
     * @protected
     */
    get _propertyForValue() {
      return 'value';
    }

    /**
     * Filtering and items handling
     * @param {!Event} e
     * @protected
     */
    _inputValueChanged(e) {
      // Handle only input events from our inputElement.
      if (e.composedPath().indexOf(this.inputElement) !== -1) {
        this._inputElementValue = this.inputElement[this._propertyForValue];
        this._filterFromInput(e);
      }
    }

    /** @private */
    _filterFromInput(e) {
      if (!this.opened && !e.__fromClearButton && !this.autoOpenDisabled) {
        this.open();
      }

      if (this.filter === this._inputElementValue) {
        // Filter and input value might get out of sync, while keyboard navigating for example.
        // Afterwards, input value might be changed to the same value as used in filtering.
        // In situation like these, we need to make sure all the filter changes handlers are run.
        this._filterChanged(this.filter, this.itemValuePath, this.itemLabelPath);
      } else {
        this.filter = this._inputElementValue;
      }
    }

    /** @private */
    _itemLabelPathChanged(itemLabelPath) {
      if (typeof itemLabelPath !== 'string') {
        console.error('You should set itemLabelPath to a valid string');
      }
    }

    /** @private */
    _filterChanged(filter, itemValuePath, itemLabelPath) {
      if (filter === undefined) {
        return;
      }

      // Notify the dropdown about filter changing, so to let it skip the
      // scrolling restore
      this.$.overlay.filterChanged = true;

      if (this.items) {
        this.filteredItems = this._filterItems(this.items, filter);
      } else {
        // With certain use cases (e. g., external filtering), `items` are
        // undefined. Filtering is unnecessary per se, but the filteredItems
        // observer should still be invoked to update focused item.
        this._filteredItemsChanged({ path: 'filteredItems', value: this.filteredItems }, itemValuePath, itemLabelPath);
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
    _resizeDropdown() {
      this.$.overlay.$.dropdown.notifyResize();
    }

    /** @private */
    _updateHasValue(hasValue) {
      if (hasValue) {
        this.setAttribute('has-value', '');
      } else {
        this.removeAttribute('has-value');
      }
    }

    /** @private */
    _selectedItemChanged(selectedItem) {
      if (selectedItem === null || selectedItem === undefined) {
        if (this.filteredItems) {
          if (!this.allowCustomValue) {
            this.value = '';
          }

          this._updateHasValue(this.value !== '');
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

        this._updateHasValue(true);
        this._inputElementValue = this._getItemLabel(selectedItem);

        // Could not be defined in 1.x because ready is called after all prop-setters
        if (this.inputElement) {
          this.inputElement[this._propertyForValue] = this._inputElementValue;
        }
      }

      this.$.overlay._selectedItem = selectedItem;
      if (this.filteredItems && this.$.overlay._items) {
        this._focusedIndex = this.filteredItems.indexOf(selectedItem);
      }
    }

    /** @private */
    _valueChanged(value, oldVal) {
      if (value === '' && oldVal === undefined) {
        // initializing, no need to do anything (#554)
        return;
      }

      if (this._isValidValue(value)) {
        let item;
        if (this._getItemValue(this.selectedItem) !== value) {
          this._selectItemForValue(value);
        } else {
          item = this.selectedItem;
        }

        if (!item && this.allowCustomValue) {
          this._inputElementValue = value;
        }

        this._updateHasValue(this.value !== '');
      } else {
        this.selectedItem = null;
      }
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
    }

    /** @private */
    _itemsOrPathsChanged(e) {
      if (e.path === 'items' || e.path === 'items.splices') {
        if (this.items) {
          this.filteredItems = this.items.slice(0);
        } else if (this.__previousItems) {
          // Only clear filteredItems if the component had items previously but got cleared
          this.filteredItems = null;
        }

        const valueIndex = this._indexOfValue(this.value, this.items);
        this._focusedIndex = valueIndex;

        const item = valueIndex > -1 && this.items[valueIndex];
        if (item) {
          this.selectedItem = item;
        }
      }
      this.__previousItems = e.value;
    }

    /** @private */
    _filteredItemsChanged(e) {
      if (e.path === 'filteredItems' || e.path === 'filteredItems.splices') {
        this._setOverlayItems(this.filteredItems);

        this._focusedIndex =
          this.opened || this.autoOpenDisabled
            ? this.$.overlay.indexOfLabel(this.filter)
            : this._indexOfValue(this.value, this.filteredItems);

        if (this.opened) {
          this._repositionOverlay();
        }
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

      this.selectedItem =
        valueIndex >= 0
          ? this.filteredItems[valueIndex]
          : this.dataProvider && this.selectedItem === undefined
          ? undefined
          : null;

      if (this.selectedItem === null && previouslySelectedItem === null) {
        this._selectedItemChanged(this.selectedItem);
      }
    }

    /** @private */
    _setOverlayItems(items) {
      this.$.overlay.set('_items', items);
    }

    /** @private */
    _repositionOverlay() {
      // async needed to reposition correctly after filtering
      // (especially when aligned on top of input)
      this.__repositionOverlayDebouncer = Debouncer.debounce(
        this.__repositionOverlayDebouncer,
        // Long debounce: sizing updates invoke multiple styling rounds,
        // which might affect performance, especially in old browsers.
        // See https://github.com/vaadin/vaadin-combo-box/pull/800
        timeOut.after(500),
        () => {
          const selector = this.$.overlay._selector;
          if (!selector._isClientFull()) {
            // Due to the mismatch of the Y position of the item rendered
            // at the top of the scrolling list with some specific scroll
            // position values (2324, 3486, 6972, 60972, 95757 etc.)
            // iron-list loops the increasing of the pool and adds
            // too many items to the DOM.
            // Adjusting scroll position to equal the current scrollTop value
            // to avoid looping.
            selector._resetScrollPosition(selector._physicalTop);
          }
          this._resizeDropdown();
          this.$.overlay.updateViewportBoundaries();
          this.$.overlay.ensureItemsRendered();
          selector.notifyResize();
          flush();
        }
      );
    }

    /** @private */
    _indexOfValue(value, items) {
      if (items && this._isValidValue(value)) {
        for (let i = 0; i < items.length; i++) {
          if (this._getItemValue(items[i]) === value) {
            return i;
          }
        }
      }

      return -1;
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
      // stop this private event from leaking outside.
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
    _onFocusout(event) {
      // Fixes the problem with `focusout` happening when clicking on the scroll bar on Edge
      const dropdown = this.$.overlay.$.dropdown;
      if (dropdown && dropdown.$ && event.relatedTarget === dropdown.$.overlay) {
        event.composedPath()[0].focus();
        return;
      }
      if (!this.readonly && !this._closeOnBlurIsPrevented) {
        this._closeOrCommit();
      }
    }

    /** @private */
    _onTouchend(event) {
      if (!this._clearElement || event.composedPath()[0] !== this._clearElement) {
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
     * Returns true if the current input value satisfies all constraints (if any)
     *
     * You can override the `checkValidity` method for custom validations.
     * @return {boolean | undefined}
     */
    checkValidity() {
      if (this.inputElement.validate) {
        return this.inputElement.validate();
      }
    }

    /** @protected */
    _preventInputBlur() {
      if (this._toggleElement) {
        this._toggleElement.addEventListener('click', this._preventDefault);
      }
      if (this._clearElement) {
        this._clearElement.addEventListener('click', this._preventDefault);
      }
    }

    /** @protected */
    _restoreInputBlur() {
      if (this._toggleElement) {
        this._toggleElement.removeEventListener('click', this._preventDefault);
      }
      if (this._clearElement) {
        this._clearElement.removeEventListener('click', this._preventDefault);
      }
    }

    /** @private */
    _preventDefault(e) {
      e.preventDefault();
    }

    /**
     * @param {!Event} e
     * @protected
     */
    _stopPropagation(e) {
      e.stopPropagation();
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
