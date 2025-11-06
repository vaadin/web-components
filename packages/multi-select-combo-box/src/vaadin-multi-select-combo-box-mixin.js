/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { announce } from '@vaadin/a11y-base/src/announce.js';
import { ComboBoxDataProviderMixin } from '@vaadin/combo-box/src/vaadin-combo-box-data-provider-mixin.js';
import { ComboBoxItemsMixin } from '@vaadin/combo-box/src/vaadin-combo-box-items-mixin.js';
import { ComboBoxPlaceholder } from '@vaadin/combo-box/src/vaadin-combo-box-placeholder.js';
import { I18nMixin } from '@vaadin/component-base/src/i18n-mixin.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';
import { InputControlMixin } from '@vaadin/field-base/src/input-control-mixin.js';
import { InputController } from '@vaadin/field-base/src/input-controller.js';
import { LabelledInputController } from '@vaadin/field-base/src/labelled-input-controller.js';

const DEFAULT_I18N = {
  cleared: 'Selection cleared',
  focused: 'focused. Press Backspace to remove',
  selected: 'added to selection',
  deselected: 'removed from selection',
  total: '{count} items selected',
};

/**
 * @polymerMixin
 * @mixes ComboBoxDataProviderMixin
 * @mixes ComboBoxItemsMixin
 * @mixes I18nMixin
 * @mixes InputControlMixin
 * @mixes ResizeMixin
 */
export const MultiSelectComboBoxMixin = (superClass) =>
  class MultiSelectComboBoxMixinClass extends I18nMixin(
    DEFAULT_I18N,
    ComboBoxDataProviderMixin(ComboBoxItemsMixin(InputControlMixin(ResizeMixin(superClass)))),
  ) {
    static get properties() {
      return {
        /**
         * Set to true to auto expand horizontally, causing input field to
         * grow until max width is reached.
         * @attr {boolean} auto-expand-horizontally
         */
        autoExpandHorizontally: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
          sync: true,
        },

        /**
         * Set to true to not collapse selected items chips into the overflow
         * chip and instead always expand vertically, causing input field to
         * wrap into multiple lines when width is limited.
         * @attr {boolean} auto-expand-vertically
         */
        autoExpandVertically: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
          sync: true,
        },

        /**
         * A function used to generate CSS class names for dropdown
         * items and selected chips based on the item. The return
         * value should be the generated class name as a string, or
         * multiple class names separated by whitespace characters.
         */
        itemClassNameGenerator: {
          type: Object,
          sync: true,
        },

        /**
         * Path for the id of the item, used to detect whether the item is selected.
         * @attr {string} item-id-path
         */
        itemIdPath: {
          type: String,
          sync: true,
        },

        /**
         * When true, filter string isn't cleared after selecting an item.
         */
        keepFilter: {
          type: Boolean,
          value: false,
        },

        /**
         * True when loading items from the data provider, false otherwise.
         */
        loading: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
          sync: true,
        },

        /**
         * When present, it specifies that the field is read-only.
         */
        readonly: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
          sync: true,
        },

        /**
         * The list of selected items.
         * Note: modifying the selected items creates a new array each time.
         */
        selectedItems: {
          type: Array,
          value: () => [],
          notify: true,
          sync: true,
        },

        /**
         * When true, the user can input a value that is not present in the items list.
         * @attr {boolean} allow-custom-value
         */
        allowCustomValue: {
          type: Boolean,
          value: false,
        },

        /**
         * A hint to the user of what can be entered in the control.
         * The placeholder will be only displayed in the case when
         * there is no item selected.
         */
        placeholder: {
          type: String,
          observer: '_placeholderChanged',
          reflectToAttribute: true,
          sync: true,
        },

        /**
         * Custom function for rendering the content of every item.
         * Receives three arguments:
         *
         * - `root` The `<vaadin-multi-select-combo-box-item>` internal container DOM element.
         * - `comboBox` The reference to the `<vaadin-multi-select-combo-box>` element.
         * - `model` The object with the properties related with the rendered
         *   item, contains:
         *   - `model.index` The index of the rendered item.
         *   - `model.item` The item.
         */
        renderer: {
          type: Function,
          sync: true,
        },

        /**
         * Set to true to group selected items at the top of the overlay.
         * @attr {boolean} selected-items-on-top
         */
        selectedItemsOnTop: {
          type: Boolean,
          value: false,
          sync: true,
        },

        /** @private */
        value: {
          type: String,
        },

        /** @private */
        _overflowItems: {
          type: Array,
          value: () => [],
          sync: true,
        },

        /** @private */
        _focusedChipIndex: {
          type: Number,
          value: -1,
          observer: '_focusedChipIndexChanged',
        },

        /** @private */
        _lastFilter: {
          type: String,
          sync: true,
        },

        /** @private */
        _topGroup: {
          type: Array,
          observer: '_topGroupChanged',
          sync: true,
        },

        /** @private */
        _inputField: {
          type: Object,
        },
      };
    }

    static get observers() {
      return [
        '_selectedItemsChanged(selectedItems)',
        '__openedOrItemsChanged(opened, _dropdownItems, loading, __keepOverlayOpened)',
        '__updateOverflowChip(_overflow, _overflowItems, disabled, readonly)',
        '__updateScroller(opened, _dropdownItems, _focusedIndex, _theme)',
        '__updateTopGroup(selectedItemsOnTop, selectedItems, opened)',
      ];
    }

    /**
     * The object used to localize this component. To change the default
     * localization, replace this with an object that provides all properties, or
     * just the individual properties you want to change.
     *
     * The object has the following JSON structure and default values:
     * ```js
     * {
     *   // Screen reader announcement on clear button click.
     *   cleared: 'Selection cleared',
     *   // Screen reader announcement when a chip is focused.
     *   focused: ' focused. Press Backspace to remove',
     *   // Screen reader announcement when item is selected.
     *   selected: 'added to selection',
     *   // Screen reader announcement when item is deselected.
     *   deselected: 'removed from selection',
     *   // Screen reader announcement of the selected items count.
     *   // {count} is replaced with the actual count of items.
     *   total: '{count} items selected',
     * }
     * ```
     * @return {!MultiSelectComboBoxI18n}
     */
    get i18n() {
      return super.i18n;
    }

    set i18n(value) {
      super.i18n = value;
    }

    /** @protected */
    get slotStyles() {
      const tag = this.localName;
      return [
        ...super.slotStyles,
        `
        ${tag}[has-value] input::placeholder {
          color: transparent !important;
          forced-color-adjust: none;
        }
      `,
      ];
    }

    /**
     * Used by `InputControlMixin` as a reference to the clear button element.
     * @protected
     * @return {!HTMLElement}
     */
    get clearElement() {
      return this.$.clearButton;
    }

    /** @protected */
    get _chips() {
      return [...this.querySelectorAll('[slot="chip"]')];
    }

    /**
     * Override a getter from `InputMixin` to compute
     * the presence of value based on `selectedItems`.
     *
     * @protected
     * @override
     */
    get _hasValue() {
      return this.selectedItems && this.selectedItems.length > 0;
    }

    /**
     * Tag name prefix used by scroller and items.
     * @protected
     * @return {string}
     */
    get _tagNamePrefix() {
      return 'vaadin-multi-select-combo-box';
    }

    /** @protected */
    ready() {
      super.ready();

      this.addController(
        new InputController(this, (input) => {
          this._setInputElement(input);
          this._setFocusElement(input);
          this.stateTarget = input;
          this.ariaTarget = input;
        }),
      );
      this.addController(new LabelledInputController(this.inputElement, this._labelController));

      this._tooltipController = new TooltipController(this);
      this.addController(this._tooltipController);
      this._tooltipController.setPosition('top');
      this._tooltipController.setAriaTarget(this.inputElement);
      this._tooltipController.setShouldShow((target) => !target.opened);

      this._toggleElement = this.$.toggleButton;
      this._inputField = this.shadowRoot.querySelector('[part="input-field"]');

      this._overflowController = new SlotController(this, 'overflow', 'vaadin-multi-select-combo-box-chip', {
        initializer: (chip) => {
          chip.addEventListener('mousedown', (e) => this._preventBlur(e));
          this._overflow = chip;
        },
      });
      this.addController(this._overflowController);
    }

    /** @protected */
    updated(props) {
      super.updated(props);

      ['loading', 'itemIdPath', 'itemClassNameGenerator', 'renderer'].forEach((prop) => {
        if (props.has(prop)) {
          this._scroller[prop] = this[prop];
        }
      });

      if (props.has('selectedItems') && this.opened) {
        this.$.overlay._updateOverlayWidth();
      }

      const chipProps = [
        'autoExpandHorizontally',
        'autoExpandVertically',
        'disabled',
        'readonly',
        'clearButtonVisible',
        'itemClassNameGenerator',
      ];
      if (chipProps.some((prop) => props.has(prop))) {
        this.__updateChips();
      }

      if (props.has('readonly')) {
        this._setDropdownItems(this.filteredItems);

        if (this.dataProvider) {
          this.clearCache();
        }
      }
    }

    /**
     * Returns true if the current input value satisfies all constraints (if any).
     * @return {boolean}
     */
    checkValidity() {
      return this.required && !this.readonly ? this._hasValue : true;
    }

    /**
     * Opens the dropdown list.
     * @override
     */
    open() {
      // Allow opening dropdown when readonly.
      if (!this.disabled && !(this.readonly && this.selectedItems.length === 0)) {
        this.opened = true;
      }
    }

    /**
     * Clears the selected items.
     */
    clear() {
      this.__updateSelection([]);

      announce(this.__effectiveI18n.cleared);
    }

    /** @private */
    __syncTopGroup() {
      this._topGroup = this.selectedItemsOnTop ? [...this.selectedItems] : [];
    }

    /**
     * Clears the cached pages and reloads data from data provider when needed.
     * @override
     */
    clearCache() {
      // Do not clear the data provider cache when read-only.
      if (this.readonly) {
        return;
      }

      super.clearCache();

      this.__syncTopGroup();
    }

    /**
     * @private
     * @override
     */
    _itemsChanged(items, oldItems) {
      super._itemsChanged(items, oldItems);

      this.__syncTopGroup();
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
     * Override method from `ComboBoxBaseMixin` to implement clearing logic.
     * @protected
     * @override
     */
    _onClearAction() {
      this.clear();
    }

    /**
     * Override method from `ComboBoxBaseMixin`
     * to commit value on overlay closing.
     * @protected
     * @override
     */
    _onClosed() {
      // Do not commit selected item again on outside click
      this._ignoreCommitValue = true;

      if (!this.loading || this.allowCustomValue) {
        this._commitValue();
      }
    }

    /** @private */
    __updateScroller(opened, items, focusedIndex, theme) {
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
    __openedOrItemsChanged(opened, items, loading, keepOverlayOpened) {
      // Close the overlay if there are no items to display.
      // See https://github.com/vaadin/vaadin-combo-box/pull/964
      this._overlayOpened = opened && (keepOverlayOpened || loading || !!(items && items.length));
    }

    /**
     * @protected
     */
    _closeOrCommit() {
      if (!this.opened) {
        this._commitValue();
      } else {
        this.close();
      }
    }

    /**
     * @protected
     * @override
     */
    _commitValue() {
      // Store filter value for checking if user input is matching
      // an item which is already selected, to not un-select it.
      this._lastFilter = this.filter;

      // Do not commit focused item on not blur / outside click
      if (this._ignoreCommitValue) {
        this._inputElementValue = '';
        this._focusedIndex = -1;
        this._ignoreCommitValue = false;
      } else {
        this.__commitUserInput();
      }

      // Clear filter unless keepFilter is set
      if (!this.keepFilter || !this.opened) {
        this.filter = '';
      }
    }

    /** @private */
    __commitUserInput() {
      if (this._focusedIndex > -1) {
        const focusedItem = this._dropdownItems[this._focusedIndex];
        this.__selectItem(focusedItem);
      } else if (this._inputElementValue) {
        // Detect if input value doesn't match an existing item
        const items = [...this._dropdownItems];
        const itemMatchingInputValue = items[this.__getItemIndexByLabel(items, this._inputElementValue)];

        if (this.allowCustomValue && !itemMatchingInputValue) {
          const customValue = this._inputElementValue;

          // Store reference to the last custom value for checking it on focusout.
          this._lastCustomValue = customValue;

          this.__clearInternalValue(true);

          this.dispatchEvent(
            new CustomEvent('custom-value-set', {
              detail: customValue,
              composed: true,
              bubbles: true,
            }),
          );
        } else if (!this.allowCustomValue && !this.opened && itemMatchingInputValue) {
          // An item matching by label was found, select it.
          this.__selectItem(itemMatchingInputValue);
        } else {
          // Clear input value on Escape press while closed.
          this._inputElementValue = '';
        }
      }
    }

    /**
     * Override method inherited from `FocusMixin` to validate on blur.
     * @param {boolean} focused
     * @protected
     */
    _setFocused(focused) {
      if (!focused) {
        this._ignoreCommitValue = true;
      }

      super._setFocused(focused);

      // Do not validate when focusout is caused by document
      // losing focus, which happens on browser tab switch.
      if (!focused && document.hasFocus()) {
        this._focusedChipIndex = -1;
        this._requestValidation();
      }

      if (!focused && this.readonly && !this._closeOnBlurIsPrevented) {
        this.close();
      }
    }

    /**
     * Implement callback from `ResizeMixin` to update chips.
     * @protected
     * @override
     */
    _onResize() {
      this.__updateChips();
    }

    /**
     * Override method from `DelegateStateMixin` to set required state
     * using `aria-required` attribute instead of `required`, in order
     * to prevent screen readers from announcing "invalid entry".
     * @protected
     * @override
     */
    _delegateAttribute(name, value) {
      if (!this.stateTarget) {
        return;
      }

      if (name === 'required') {
        this._delegateAttribute('aria-required', value ? 'true' : false);
        return;
      }

      super._delegateAttribute(name, value);
    }

    /** @private */
    _placeholderChanged(placeholder) {
      const tmpPlaceholder = this.__tmpA11yPlaceholder;
      // Do not store temporary placeholder
      if (tmpPlaceholder !== placeholder) {
        this.__savedPlaceholder = placeholder;

        if (tmpPlaceholder) {
          this.placeholder = tmpPlaceholder;
        }
      }
    }

    /** @private */
    _selectedItemsChanged(selectedItems) {
      this._toggleHasValue(this._hasValue);

      // Use placeholder for announcing items
      if (this._hasValue) {
        const tmpPlaceholder = this._mergeItemLabels(selectedItems);
        if (this.__tmpA11yPlaceholder === undefined) {
          this.__savedPlaceholder = this.placeholder;
        }
        this.__tmpA11yPlaceholder = tmpPlaceholder;
        this.placeholder = tmpPlaceholder;
      } else if (this.__tmpA11yPlaceholder !== undefined) {
        delete this.__tmpA11yPlaceholder;
        this.placeholder = this.__savedPlaceholder;
      }

      // Re-render chips
      this.__updateChips();

      // Update selected for dropdown items
      this.requestContentUpdate();
    }

    /** @private */
    _topGroupChanged(topGroup) {
      if (topGroup) {
        this._setDropdownItems(this.filteredItems);
      }
    }

    /**
     * Override method from `ComboBoxBaseMixin` to handle valid value.
     * @protected
     * @override
     */
    _hasValidInputValue() {
      const hasInvalidOption = this._focusedIndex < 0 && this._inputElementValue !== '';
      return this.allowCustomValue || !hasInvalidOption;
    }

    /**
     * Override method inherited from the combo-box
     * to not request data provider when read-only.
     *
     * @protected
     * @override
     */
    _shouldFetchData() {
      if (this.readonly) {
        return false;
      }

      return super._shouldFetchData();
    }

    /**
     * Override combo-box method to group selected
     * items at the top of the overlay.
     *
     * @protected
     * @override
     */
    _setDropdownItems(items) {
      if (this.readonly) {
        this.__setDropdownItems(this.selectedItems);
        return;
      }

      if (this.filter || !this.selectedItemsOnTop) {
        this.__setDropdownItems(items);
        return;
      }

      if (items && items.length && this._topGroup && this._topGroup.length) {
        // Filter out items included to the top group.
        const filteredItems = items.filter((item) => this._findIndex(item, this._topGroup, this.itemIdPath) === -1);

        this.__setDropdownItems(this._topGroup.concat(filteredItems));
        return;
      }

      this.__setDropdownItems(items);
    }

    /** @private */
    __setDropdownItems(newItems) {
      const oldItems = this._dropdownItems;
      this._dropdownItems = newItems;

      // Store the currently focused item if any. The focused index preserves
      // in the case when more filtered items are loading but it is reset
      // when the user types in a filter query.
      const focusedItem = oldItems ? oldItems[this._focusedIndex] : null;

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
    _mergeItemLabels(items) {
      return items.map((item) => this._getItemLabel(item)).join(', ');
    }

    /** @private */
    _findIndex(item, selectedItems, itemIdPath) {
      if (itemIdPath && item) {
        for (let index = 0; index < selectedItems.length; index++) {
          if (selectedItems[index] && selectedItems[index][itemIdPath] === item[itemIdPath]) {
            return index;
          }
        }
        return -1;
      }

      return selectedItems.indexOf(item);
    }

    /**
     * Clear the internal combo box value and filter. Filter will not be cleared
     * when the `keepFilter` option is enabled. Using `force` can enforce clearing
     * the filter.
     * @param {boolean} force overrides the keepFilter option
     * @private
     */
    __clearInternalValue(force = false) {
      if (!this.keepFilter || force) {
        // Clear both input value and filter.
        this.filter = '';
        this._inputElementValue = '';
      } else {
        // Restore input to the filter value. Needed when items are
        // navigated with keyboard, which overrides the input value
        // with the item label.
        this._inputElementValue = this.filter;
      }
    }

    /** @private */
    __announceItem(itemLabel, isSelected, itemCount) {
      const state = isSelected ? 'selected' : 'deselected';
      const total = this.__effectiveI18n.total.replace('{count}', itemCount || 0);
      announce(`${itemLabel} ${this.__effectiveI18n[state]} ${total}`);
    }

    /** @private */
    __removeItem(item) {
      const itemsCopy = [...this.selectedItems];
      itemsCopy.splice(itemsCopy.indexOf(item), 1);
      this.__updateSelection(itemsCopy);
      const itemLabel = this._getItemLabel(item);
      this.__announceItem(itemLabel, false, itemsCopy.length);
    }

    /** @private */
    __selectItem(item) {
      const itemsCopy = [...this.selectedItems];

      const index = this._findIndex(item, itemsCopy, this.itemIdPath);
      const itemLabel = this._getItemLabel(item);

      let isSelected = false;

      if (index !== -1) {
        const lastFilter = this._lastFilter;
        // Do not unselect when manually typing and committing an already selected item.
        if (lastFilter && lastFilter.toLowerCase() === itemLabel.toLowerCase()) {
          this.__clearInternalValue();
          return;
        }

        itemsCopy.splice(index, 1);
      } else {
        itemsCopy.push(item);
        isSelected = true;
      }

      this.__updateSelection(itemsCopy);

      // Suppress `value-changed` event.
      this.__clearInternalValue();

      this.__announceItem(itemLabel, isSelected, itemsCopy.length);
    }

    /** @private */
    __updateSelection(selectedItems) {
      this.selectedItems = selectedItems;

      this._requestValidation();

      this.dispatchEvent(new CustomEvent('change', { bubbles: true }));
    }

    /** @private */
    __updateTopGroup(selectedItemsOnTop, selectedItems, opened) {
      if (!selectedItemsOnTop) {
        this._topGroup = [];
      } else if (!opened || this.__needToSyncTopGroup()) {
        this._topGroup = [...selectedItems];
      }
    }

    /** @private */
    __needToSyncTopGroup() {
      // Only sync for object items
      if (!this.itemIdPath) {
        return false;
      }
      return (
        this._topGroup &&
        this._topGroup.some((item) => {
          const selectedItem = this.selectedItems[this._findIndex(item, this.selectedItems, this.itemIdPath)];
          return selectedItem && item !== selectedItem;
        })
      );
    }

    /** @private */
    __createChip(item) {
      const chip = document.createElement('vaadin-multi-select-combo-box-chip');
      chip.setAttribute('slot', 'chip');

      chip.item = item;
      chip.disabled = this.disabled;
      chip.readonly = this.readonly;

      const label = this._getItemLabel(item);
      chip.label = label;
      chip.setAttribute('title', label);

      if (typeof this.itemClassNameGenerator === 'function') {
        chip.className = this.itemClassNameGenerator(item);
      }

      chip.addEventListener('item-removed', (e) => this._onItemRemoved(e));
      chip.addEventListener('mousedown', (e) => this._preventBlur(e));

      return chip;
    }

    /** @private */
    __getOverflowWidth() {
      const chip = this._overflow;

      chip.style.visibility = 'hidden';
      chip.removeAttribute('hidden');

      const count = chip.getAttribute('count');

      // Detect max possible width of the overflow chip
      // by measuring it with widest number (2 digits)
      chip.setAttribute('count', '99');
      const overflowStyle = getComputedStyle(chip);
      const overflowWidth = chip.clientWidth + parseInt(overflowStyle.marginInlineStart);

      chip.setAttribute('count', count);
      chip.setAttribute('hidden', '');
      chip.style.visibility = '';

      return overflowWidth;
    }

    /** @private */
    __updateChips() {
      if (!this._inputField || !this.inputElement) {
        return;
      }

      // Clear all chips except the overflow
      this._chips.forEach((chip) => {
        chip.remove();
      });

      const items = [...this.selectedItems];

      // Detect available remaining width for chips
      const totalWidth = this._inputField.$.wrapper.clientWidth;
      const inputWidth = parseInt(getComputedStyle(this.inputElement).flexBasis);

      let remainingWidth = totalWidth - inputWidth;

      if (items.length > 1) {
        remainingWidth -= this.__getOverflowWidth();
      }

      const chipMinWidth = parseInt(getComputedStyle(this).getPropertyValue('--_chip-min-width'));

      if (this.autoExpandHorizontally) {
        const chips = [];

        // First, add all chips to make the field fully expand
        for (let i = items.length - 1, refNode = null; i >= 0; i--) {
          const chip = this.__createChip(items[i]);
          this.insertBefore(chip, refNode);
          refNode = chip;
          chips.unshift(chip);
        }

        const overflowItems = [];
        const availableWidth = this._inputField.$.wrapper.clientWidth - this.$.chips.clientWidth;

        // When auto expanding vertically, no need to measure width
        if (!this.autoExpandVertically && availableWidth < inputWidth) {
          // Always show at least last item as a chip
          while (chips.length > 1) {
            const lastChip = chips.pop();
            lastChip.remove();
            overflowItems.unshift(items.pop());

            // Remove chips until there is enough width for the input element to fit
            const neededWidth = overflowItems.length > 0 ? inputWidth + this.__getOverflowWidth() : inputWidth;
            if (this._inputField.$.wrapper.clientWidth - this.$.chips.clientWidth >= neededWidth) {
              break;
            }
          }

          if (chips.length === 1) {
            chips[0].style.maxWidth = `${Math.max(chipMinWidth, remainingWidth)}px`;
          }
        }

        this._overflowItems = overflowItems;
        return;
      }

      // Add chips until remaining width is exceeded
      for (let i = items.length - 1, refNode = null; i >= 0; i--) {
        const chip = this.__createChip(items[i]);
        this.insertBefore(chip, refNode);

        // When auto expanding vertically, no need to measure remaining width
        if (!this.autoExpandVertically) {
          if (this.$.chips.clientWidth > remainingWidth) {
            // If there is no more space for chips, or if there is at least one
            // chip already shown, collapse all remaining chips to the overflow
            if (remainingWidth < chipMinWidth || refNode !== null) {
              chip.remove();
              break;
            }
          }

          chip.style.maxWidth = `${remainingWidth}px`;
        }

        items.pop();
        refNode = chip;
      }

      this._overflowItems = items;
    }

    /** @private */
    __updateOverflowChip(overflow, items, disabled, readonly) {
      if (overflow) {
        const count = items.length;

        overflow.label = `${count}`;
        overflow.setAttribute('count', `${count}`);
        overflow.setAttribute('title', this._mergeItemLabels(items));
        overflow.toggleAttribute('hidden', count === 0);

        overflow.disabled = disabled;
        overflow.readonly = readonly;
      }
    }

    /**
     * Override method from `ComboBoxBaseMixin` to deselect
     * dropdown item by requesting content update on clear.
     * @param {Event} event
     * @protected
     */
    _onClearButtonClick(event) {
      event.stopPropagation();

      super._onClearButtonClick(event);

      if (this.opened) {
        this.requestContentUpdate();
      }
    }

    /**
     * Override an event listener from `InputControlMixin` to
     * stop the change event re-targeted from the input.
     *
     * @param {!Event} event
     * @protected
     * @override
     */
    _onChange(event) {
      event.stopPropagation();
    }

    /**
     * Override an event listener from `KeyboardMixin`.
     * Do not call `super` in order to override clear
     * button logic defined in `InputControlMixin`.
     *
     * @param {!KeyboardEvent} event
     * @protected
     * @override
     */
    _onEscape(event) {
      if (this.readonly) {
        event.stopPropagation();
        if (this.opened) {
          this.close();
        }
        return;
      }

      if (this.clearButtonVisible && !this.opened && this.selectedItems && this.selectedItems.length) {
        event.stopPropagation();
        this.selectedItems = [];
      }

      super._onEscape(event);
    }

    /**
     * Override method from `ComboBoxBaseMixin` to handle Escape pres.
     * @protected
     * @override
     */
    _onEscapeCancel() {
      this._closeOrCommit();
    }

    /**
     * Override an event listener from `KeyboardMixin` to keep
     * overlay open when item is selected or unselected.
     * @param {!Event} event
     * @protected
     * @override
     */
    _onEnter(event) {
      if (this.opened) {
        // Do not submit the surrounding form.
        event.preventDefault();
        // Do not trigger global listeners.
        event.stopPropagation();

        if (this.readonly) {
          this.close();
        } else if (this._hasValidInputValue()) {
          // Keep selected item focused after committing on Enter.
          const focusedItem = this._dropdownItems[this._focusedIndex];
          this._commitValue();
          this._focusedIndex = this._dropdownItems.indexOf(focusedItem);
        }

        return;
      }

      super._onEnter(event);
    }

    /**
     * Override method inherited from the combo-box
     * to not update focused item when readonly.
     * @protected
     * @override
     */
    _onArrowDown() {
      if (!this.readonly) {
        super._onArrowDown();
      } else if (!this.opened) {
        this.open();
      }
    }

    /**
     * Override method inherited from the combo-box
     * to not update focused item when readonly.
     * @protected
     * @override
     */
    _onArrowUp() {
      if (!this.readonly) {
        super._onArrowUp();
      } else if (!this.opened) {
        this.open();
      }
    }

    /**
     * Override an event listener from `KeyboardMixin`.
     * @param {KeyboardEvent} event
     * @protected
     * @override
     */
    _onKeyDown(event) {
      super._onKeyDown(event);

      const chips = this._chips;

      if (!this.readonly && chips.length > 0) {
        switch (event.key) {
          case 'Backspace':
            this._onBackSpace(chips);
            break;
          case 'ArrowLeft':
            this._onArrowLeft(chips, event);
            break;
          case 'ArrowRight':
            this._onArrowRight(chips, event);
            break;
          default:
            this._focusedChipIndex = -1;
            break;
        }
      }
    }

    /** @private */
    _onArrowLeft(chips, event) {
      if (this.inputElement.selectionStart !== 0) {
        return;
      }

      const idx = this._focusedChipIndex;
      if (idx !== -1) {
        event.preventDefault();
      }
      let newIdx;

      if (!this.__isRTL) {
        if (idx === -1) {
          // Focus last chip
          newIdx = chips.length - 1;
        } else if (idx > 0) {
          // Focus prev chip
          newIdx = idx - 1;
        }
      } else if (idx === chips.length - 1) {
        // Blur last chip
        newIdx = -1;
      } else if (idx > -1) {
        // Focus next chip
        newIdx = idx + 1;
      }

      if (newIdx !== undefined) {
        this._focusedChipIndex = newIdx;
      }
    }

    /** @private */
    _onArrowRight(chips, event) {
      if (this.inputElement.selectionStart !== 0) {
        return;
      }

      const idx = this._focusedChipIndex;
      if (idx !== -1) {
        event.preventDefault();
      }
      let newIdx;

      if (this.__isRTL) {
        if (idx === -1) {
          // Focus last chip
          newIdx = chips.length - 1;
        } else if (idx > 0) {
          // Focus prev chip
          newIdx = idx - 1;
        }
      } else if (idx === chips.length - 1) {
        // Blur last chip
        newIdx = -1;
      } else if (idx > -1) {
        // Focus next chip
        newIdx = idx + 1;
      }

      if (newIdx !== undefined) {
        this._focusedChipIndex = newIdx;
      }
    }

    /** @private */
    _onBackSpace(chips) {
      if (this.inputElement.selectionStart !== 0) {
        return;
      }

      const idx = this._focusedChipIndex;
      if (idx === -1) {
        this._focusedChipIndex = chips.length - 1;
      } else {
        this.__removeItem(chips[idx].item);
        this._focusedChipIndex = -1;
      }
    }

    /** @private */
    _focusedChipIndexChanged(focusedIndex, oldFocusedIndex) {
      if (focusedIndex > -1 || oldFocusedIndex > -1) {
        const chips = this._chips;
        chips.forEach((chip, index) => {
          chip.toggleAttribute('focused', index === focusedIndex);
        });

        // Announce focused chip
        if (focusedIndex > -1) {
          const item = chips[focusedIndex].item;
          const itemLabel = this._getItemLabel(item);
          announce(`${itemLabel} ${this.__effectiveI18n.focused}`);
        }
      }
    }

    /**
     * @param {CustomEvent} event
     * @protected
     * @override
     */
    _overlaySelectedItemChanged(event) {
      event.stopPropagation();

      // Do not un-select on click when readonly
      if (this.readonly) {
        return;
      }

      if (event.detail.item instanceof ComboBoxPlaceholder) {
        return;
      }

      if (this.opened) {
        // Store filter value for checking if user input is matching
        // an item which is already selected, to not un-select it.
        this._lastFilter = this._inputElementValue;
        this.__selectItem(event.detail.item);
      }
    }

    /** @private */
    _onItemRemoved(event) {
      this.__removeItem(event.detail.item);
    }

    /** @private */
    _preventBlur(event) {
      // Prevent mousedown event to keep the input focused
      // and keep the overlay opened when clicking a chip.
      event.preventDefault();
    }

    /**
     * Fired when the user sets a custom value.
     * @event custom-value-set
     * @param {string} detail the custom value
     */
  };
