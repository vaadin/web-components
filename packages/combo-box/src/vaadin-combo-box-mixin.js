/**
 * @license
 * Copyright (c) 2015 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DisabledMixin } from '@vaadin/a11y-base/src/disabled-mixin.js';
import { FocusMixin } from '@vaadin/a11y-base/src/focus-mixin.js';
import { isElementFocused, isKeyboardActive } from '@vaadin/a11y-base/src/focus-utils.js';
import { KeyboardMixin } from '@vaadin/a11y-base/src/keyboard-mixin.js';
import { isTouch } from '@vaadin/component-base/src/browser-utils.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { OverlayClassMixin } from '@vaadin/component-base/src/overlay-class-mixin.js';
import { get } from '@vaadin/component-base/src/path-utils.js';
import { processTemplates } from '@vaadin/component-base/src/templates.js';
import { InputMixin } from '@vaadin/field-base/src/input-mixin.js';
import { ValidateMixin } from '@vaadin/field-base/src/validate-mixin.js';
import { VirtualKeyboardController } from '@vaadin/field-base/src/virtual-keyboard-controller.js';
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
 * @mixes ControllerMixin
 * @mixes ValidateMixin
 * @mixes DisabledMixin
 * @mixes InputMixin
 * @mixes KeyboardMixin
 * @mixes FocusMixin
 * @mixes OverlayClassMixin
 * @param {function(new:HTMLElement)} subclass
 */
export const ComboBoxMixin = (subclass) =>
  class ComboBoxMixinClass extends OverlayClassMixin(
    ControllerMixin(ValidateMixin(FocusMixin(KeyboardMixin(InputMixin(DisabledMixin(subclass)))))),
  ) {
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
          sync: true,
          observer: '_openedChanged',
        },

        /**
         * Set true to prevent the overlay from opening automatically.
         * @attr {boolean} auto-open-disabled
         */
        autoOpenDisabled: {
          type: Boolean,
          sync: true,
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
          sync: true,
        },

        /**
         * @type {number}
         * @protected
         */
        _focusedIndex: {
          type: Number,
          observer: '_focusedIndexChanged',
          value: -1,
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

        /**
         * @type {!HTMLElement | undefined}
         * @protected
         */
        _toggleElement: {
          type: Object,
          observer: '_toggleElementChanged',
        },

        /**
         * Set of items to be rendered in the dropdown.
         * @protected
         */
        _dropdownItems: {
          type: Array,
          sync: true,
        },

        /** @private */
        _closeOnBlurIsPrevented: Boolean,

        /** @private */
        _scroller: {
          type: Object,
          sync: true,
        },

        /** @private */
        _overlayOpened: {
          type: Boolean,
          sync: true,
          observer: '_overlayOpenedChanged',
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
        '_selectedItemChanged(selectedItem, itemValuePath, itemLabelPath)',
        '_openedOrItemsChanged(opened, _dropdownItems, loading, __keepOverlayOpened)',
        '_updateScroller(_scroller, _dropdownItems, opened, loading, selectedItem, itemIdPath, _focusedIndex, renderer, _theme, itemClassNameGenerator)',
      ];
    }

    constructor() {
      super();
      this._boundOverlaySelectedItemChanged = this._overlaySelectedItemChanged.bind(this);
      this._boundOnClearButtonMouseDown = this.__onClearButtonMouseDown.bind(this);
      this._boundOnClick = this._onClick.bind(this);
      this._boundOnOverlayTouchAction = this._onOverlayTouchAction.bind(this);
      this._boundOnTouchend = this._onTouchend.bind(this);
    }

    /**
     * Tag name prefix used by scroller and items.
     * @protected
     * @return {string}
     */
    get _tagNamePrefix() {
      return 'vaadin-combo-box';
    }

    /**
     * Get a reference to the native `<input>` element.
     * Override to provide a custom input.
     * @protected
     * @return {HTMLInputElement | undefined}
     */
    get _nativeInput() {
      return this.inputElement;
    }

    /**
     * Override method inherited from `InputMixin`
     * to customize the input element.
     * @protected
     * @override
     */
    _inputElementChanged(inputElement) {
      super._inputElementChanged(inputElement);

      const input = this._nativeInput;

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

      this._initOverlay();
      this._initScroller();

      this._lastCommittedValue = this.value;

      this.addEventListener('click', this._boundOnClick);
      this.addEventListener('touchend', this._boundOnTouchend);

      const bringToFrontListener = () => {
        requestAnimationFrame(() => {
          this._overlayElement.bringToFront();
        });
      };

      this.addEventListener('mousedown', bringToFrontListener);
      this.addEventListener('touchstart', bringToFrontListener);

      processTemplates(this);

      this.addController(new VirtualKeyboardController(this));
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();

      // Close the overlay on detach
      this.close();
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

    /**
     * Override Polymer lifecycle callback to handle `filter` property change after
     * the observer for `opened` property is triggered. This is needed when opening
     * combo-box on user input to ensure the focused index is set correctly.
     *
     * @param {!Object} currentProps Current accessor values
     * @param {?Object} changedProps Properties changed since the last call
     * @param {?Object} oldProps Previous values for each changed property
     * @protected
     * @override
     */
    _propertiesChanged(currentProps, changedProps, oldProps) {
      super._propertiesChanged(currentProps, changedProps, oldProps);

      if (changedProps.filter !== undefined) {
        this._filterChanged(changedProps.filter);
      }
    }

    /**
     * Override LitElement lifecycle callback to handle filter property change.
     * @param {Object} props
     * @protected
     */
    updated(props) {
      super.updated(props);

      if (props.has('filter')) {
        this._filterChanged(this.filter);
      }
    }

    /** @private */
    _initOverlay() {
      const overlay = this.$.overlay;

      // Store instance for detecting "dir" attribute on opening
      overlay._comboBox = this;

      overlay.addEventListener('touchend', this._boundOnOverlayTouchAction);
      overlay.addEventListener('touchmove', this._boundOnOverlayTouchAction);

      // Prevent blurring the input when clicking inside the overlay
      overlay.addEventListener('mousedown', (e) => e.preventDefault());

      // Manual two-way binding for the overlay "opened" property
      overlay.addEventListener('opened-changed', (e) => {
        this._overlayOpened = e.detail.value;
      });

      this._overlayElement = overlay;
    }

    /**
     * Create and initialize the scroller element.
     * Override to provide custom host reference.
     *
     * @protected
     */
    _initScroller(host) {
      const scroller = document.createElement(`${this._tagNamePrefix}-scroller`);

      scroller.owner = host || this;
      scroller.getItemLabel = this._getItemLabel.bind(this);
      scroller.addEventListener('selection-changed', this._boundOverlaySelectedItemChanged);

      const overlay = this._overlayElement;

      overlay.renderer = (root) => {
        if (!root.innerHTML) {
          root.appendChild(scroller);
        }
      };

      // Ensure the scroller is rendered
      overlay.requestContentUpdate();

      // Trigger the observer to set properties
      this._scroller = scroller;
    }

    /** @private */
    // eslint-disable-next-line @typescript-eslint/max-params
    _updateScroller(
      scroller,
      items,
      opened,
      loading,
      selectedItem,
      itemIdPath,
      focusedIndex,
      renderer,
      theme,
      itemClassNameGenerator,
    ) {
      if (scroller) {
        if (opened) {
          scroller.style.maxHeight =
            getComputedStyle(this).getPropertyValue(`--${this._tagNamePrefix}-overlay-max-height`) || '65vh';
        }

        scroller.setProperties({
          items: opened ? items : [],
          opened,
          loading,
          selectedItem,
          itemIdPath,
          focusedIndex,
          renderer,
          theme,
          itemClassNameGenerator,
        });
      }
    }

    /** @private */
    _openedOrItemsChanged(opened, items, loading, keepOverlayOpened) {
      // Close the overlay if there are no items to display.
      // See https://github.com/vaadin/vaadin-combo-box/pull/964
      this._overlayOpened = opened && (keepOverlayOpened || loading || !!(items && items.length));
    }

    /** @private */
    _overlayOpenedChanged(opened, wasOpened) {
      if (opened) {
        this.dispatchEvent(new CustomEvent('vaadin-combo-box-dropdown-opened', { bubbles: true, composed: true }));

        this._onOpened();
      } else if (wasOpened && this._dropdownItems && this._dropdownItems.length) {
        this.close();

        this.dispatchEvent(new CustomEvent('vaadin-combo-box-dropdown-closed', { bubbles: true, composed: true }));
      }
    }

    /** @private */
    _focusedIndexChanged(index, oldIndex) {
      if (oldIndex === undefined) {
        return;
      }
      this._updateActiveDescendant(index);
    }

    /** @protected */
    _isInputFocused() {
      return this.inputElement && isElementFocused(this.inputElement);
    }

    /** @private */
    _updateActiveDescendant(index) {
      const input = this._nativeInput;
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
        // For touch devices, we don't want to popup virtual keyboard
        // unless input element is explicitly focused by the user.
        if (!this._isInputFocused() && !isTouch) {
          if (this.inputElement) {
            this.inputElement.focus();
          }
        }
      } else {
        this._onClosed();
      }

      const input = this._nativeInput;
      if (input) {
        input.setAttribute('aria-expanded', !!opened);

        if (opened) {
          input.setAttribute('aria-controls', this._scroller.id);
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

    /** @private */
    __onClearButtonMouseDown(event) {
      event.preventDefault(); // Prevent native focusout event
      this.inputElement.focus();
    }

    /**
     * @param {Event} event
     * @protected
     */
    _onClearButtonClick(event) {
      event.preventDefault();
      this._onClearAction();

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
    _onClick(event) {
      if (this._isClearButton(event)) {
        this._onClearButtonClick(event);
      } else if (event.composedPath().includes(this._toggleElement)) {
        this._onToggleButtonClick(event);
      } else {
        this._onHostClick(event);
      }
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

      if (e.key === 'ArrowDown') {
        this._onArrowDown();

        // Prevent caret from moving
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        this._onArrowUp();

        // Prevent caret from moving
        e.preventDefault();
      }
    }

    /** @private */
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

    /** @private */
    _onArrowDown() {
      if (this.opened) {
        const items = this._dropdownItems;
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
          const items = this._dropdownItems;
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
        const focusedItem = this._dropdownItems[this._focusedIndex];
        this._inputElementValue = this._getItemLabel(focusedItem);
        this._markAllSelectionRange();
      }
    }

    /** @private */
    _setSelectionRange(start, end) {
      // Setting selection range focuses and/or moves the caret in some browsers,
      // and there's no need to modify the selection range if the input isn't focused anyway.
      // This affects Safari. When the overlay is open, and then hitting tab, browser should focus
      // the next focusable element instead of the combo-box itself.
      if (this._isInputFocused() && this.inputElement.setSelectionRange) {
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
      if (!this._hasValidInputValue()) {
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
     * @protected
     */
    _hasValidInputValue() {
      const hasInvalidOption =
        this._focusedIndex < 0 &&
        this._inputElementValue !== '' &&
        this._getItemLabel(this.selectedItem) !== this._inputElementValue;

      return this.allowCustomValue || !hasInvalidOption;
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
      if (
        this.autoOpenDisabled &&
        (this.opened || (this.value !== this._inputElementValue && this._inputElementValue.length > 0))
      ) {
        // Auto-open is disabled
        // The overlay is open or
        // The input value has changed but the change hasn't been committed, so cancel it.
        e.stopPropagation();
        this._focusedIndex = -1;
        this.cancel();
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
      } else if (this.clearButtonVisible && !!this.value && !this.readonly) {
        e.stopPropagation();
        // The clear button is visible and the overlay is closed, so clear the value.
        this._onClearAction();
      }
    }

    /** @private */
    _toggleElementChanged(toggleElement) {
      if (toggleElement) {
        // Don't blur the input on toggle mousedown
        toggleElement.addEventListener('mousedown', (e) => e.preventDefault());
        // Unfocus previously focused element if focus is not inside combo box (on touch devices)
        toggleElement.addEventListener('click', () => {
          if (isTouch && !this._isInputFocused()) {
            document.activeElement.blur();
          }
        });
      }
    }

    /**
     * Clears the current value.
     * @protected
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

    /** @private */
    _onOpened() {
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
     * Override an event listener from `InputMixin`.
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

    /** @private */
    _getItemElements() {
      return Array.from(this._scroller.querySelectorAll(`${this._tagNamePrefix}-item`));
    }

    /** @private */
    _scrollIntoView(index) {
      if (!this._scroller) {
        return;
      }
      this._scroller.scrollIntoView(index);
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
      }
    }

    /**
     * Override method inherited from `FocusMixin`
     * to close the overlay on blur and commit the value.
     *
     * @param {boolean} focused
     * @protected
     * @override
     */
    _setFocused(focused) {
      super._setFocused(focused);

      if (!focused && !this.readonly && !this._closeOnBlurIsPrevented) {
        // User's logic in `custom-value-set` event listener might cause input to blur,
        // which will result in attempting to commit the same custom value once again.
        if (!this.opened && this.allowCustomValue && this._inputElementValue === this._lastCustomValue) {
          delete this._lastCustomValue;
          return;
        }

        if (isKeyboardActive()) {
          // Close on Tab key causing blur. With mouse, close on outside click instead.
          this._closeOrCommit();
          return;
        }

        if (!this.opened) {
          this._commitValue();
        } else if (!this._overlayOpened) {
          // Combo-box is opened, but overlay is not visible -> custom value was entered.
          // Make sure we close here as there won't be an "outside click" in this case.
          this.close();
        }
      }
    }

    /**
     * Override method inherited from `FocusMixin` to not remove focused
     * state when focus moves to the overlay.
     *
     * @param {FocusEvent} event
     * @return {boolean}
     * @protected
     * @override
     */
    _shouldRemoveFocus(event) {
      // VoiceOver on iOS fires `focusout` event when moving focus to the item in the dropdown.
      // Do not focus the input in this case, because it would break announcement for the item.
      if (event.relatedTarget && event.relatedTarget.localName === `${this._tagNamePrefix}-item`) {
        return false;
      }

      // Do not blur when focus moves to the overlay
      // Also, fixes the problem with `focusout` happening when clicking on the scroll bar on Edge
      if (event.relatedTarget === this._overlayElement) {
        event.composedPath()[0].focus();
        return false;
      }

      return true;
    }

    /** @private */
    _onTouchend(event) {
      if (!this.clearElement || event.composedPath()[0] !== this.clearElement) {
        return;
      }

      event.preventDefault();
      this._onClearAction();
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
