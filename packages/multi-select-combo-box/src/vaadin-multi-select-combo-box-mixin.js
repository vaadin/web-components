/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { announce } from '@vaadin/a11y-base/src/announce.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';
import { processTemplates } from '@vaadin/component-base/src/templates.js';
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';
import { InputControlMixin } from '@vaadin/field-base/src/input-control-mixin.js';
import { InputController } from '@vaadin/field-base/src/input-controller.js';
import { LabelledInputController } from '@vaadin/field-base/src/labelled-input-controller.js';

/**
 * @polymerMixin
 * @mixes InputControlMixin
 * @mixes ResizeMixin
 */
export const MultiSelectComboBoxMixin = (superClass) =>
  class MultiSelectComboBoxMixinClass extends InputControlMixin(ResizeMixin(superClass)) {
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
          observer: '_autoExpandHorizontallyChanged',
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
          observer: '_autoExpandVerticallyChanged',
          sync: true,
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
         * Set to true to display the clear icon which clears the input.
         * @attr {boolean} clear-button-visible
         */
        clearButtonVisible: {
          type: Boolean,
          reflectToAttribute: true,
          observer: '_clearButtonVisibleChanged',
          value: false,
          sync: true,
        },

        /**
         * A full set of items to filter the visible options from.
         * The items can be of either `String` or `Object` type.
         */
        items: {
          type: Array,
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
          observer: '__itemClassNameGeneratorChanged',
          sync: true,
        },

        /**
         * The item property used for a visual representation of the item.
         * @attr {string} item-label-path
         */
        itemLabelPath: {
          type: String,
          value: 'label',
          sync: true,
        },

        /**
         * Path for the value of the item. If `items` is an array of objects,
         * this property is used as a string value for the selected item.
         * @attr {string} item-value-path
         */
        itemValuePath: {
          type: String,
          value: 'value',
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
         * The object used to localize this component.
         * To change the default localization, replace the entire
         * _i18n_ object or just the property you want to modify.
         *
         * The object has the following JSON structure and default values:
         * ```
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
         * @type {!MultiSelectComboBoxI18n}
         * @default {English/US}
         */
        i18n: {
          type: Object,
          value: () => {
            return {
              cleared: 'Selection cleared',
              focused: 'focused. Press Backspace to remove',
              selected: 'added to selection',
              deselected: 'removed from selection',
              total: '{count} items selected',
            };
          },
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
         * A space-delimited list of CSS class names to set on the overlay element.
         *
         * @attr {string} overlay-class
         */
        overlayClass: {
          type: String,
          sync: true,
        },

        /**
         * When present, it specifies that the field is read-only.
         */
        readonly: {
          type: Boolean,
          value: false,
          observer: '_readonlyChanged',
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
         * True if the dropdown is open, false otherwise.
         */
        opened: {
          type: Boolean,
          notify: true,
          value: false,
          reflectToAttribute: true,
          sync: true,
        },

        /**
         * Total number of items.
         */
        size: {
          type: Number,
          sync: true,
        },

        /**
         * Number of items fetched at a time from the data provider.
         * @attr {number} page-size
         */
        pageSize: {
          type: Number,
          value: 50,
          observer: '_pageSizeChanged',
          sync: true,
        },

        /**
         * Function that provides items lazily. Receives two arguments:
         *
         * - `params` - Object with the following properties:
         *   - `params.page` Requested page index
         *   - `params.pageSize` Current page size
         *   - `params.filter` Currently applied filter
         *
         * - `callback(items, size)` - Callback function with arguments:
         *   - `items` Current page of items
         *   - `size` Total number of items.
         */
        dataProvider: {
          type: Object,
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
         * Filtering string the user has typed into the input field.
         */
        filter: {
          type: String,
          value: '',
          notify: true,
          sync: true,
        },

        /**
         * A subset of items, filtered based on the user input. Filtered items
         * can be assigned directly to omit the internal filtering functionality.
         * The items can be of either `String` or `Object` type.
         */
        filteredItems: {
          type: Array,
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
        },
      };
    }

    static get observers() {
      return [
        '_selectedItemsChanged(selectedItems)',
        '__updateOverflowChip(_overflow, _overflowItems, disabled, readonly)',
        '__updateTopGroup(selectedItemsOnTop, selectedItems, opened)',
      ];
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

      this._inputField = this.shadowRoot.querySelector('[part="input-field"]');

      this._overflowController = new SlotController(this, 'overflow', 'vaadin-multi-select-combo-box-chip', {
        initializer: (chip) => {
          chip.addEventListener('mousedown', (e) => this._preventBlur(e));
          this._overflow = chip;
        },
      });
      this.addController(this._overflowController);

      this.__updateChips();

      processTemplates(this);
    }

    /**
     * Returns true if the current input value satisfies all constraints (if any).
     * @return {boolean}
     */
    checkValidity() {
      return this.required && !this.readonly ? this._hasValue : true;
    }

    /**
     * Clears the selected items.
     */
    clear() {
      this.__updateSelection([]);

      announce(this.i18n.cleared);
    }

    /**
     * Clears the cached pages and reloads data from data provider when needed.
     */
    clearCache() {
      if (this.$ && this.$.comboBox) {
        this.$.comboBox.clearCache();
      }
    }

    /**
     * Requests an update for the content of items.
     * While performing the update, it invokes the renderer (passed in the `renderer` property) once an item.
     *
     * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
     */
    requestContentUpdate() {
      if (this.$ && this.$.comboBox) {
        this.$.comboBox.requestContentUpdate();
      }
    }

    /**
     * Override method inherited from `DisabledMixin` to forward disabled to chips.
     * @protected
     * @override
     */
    _disabledChanged(disabled, oldDisabled) {
      super._disabledChanged(disabled, oldDisabled);

      if (disabled || oldDisabled) {
        this.__updateChips();
      }
    }

    /**
     * Override method inherited from `InputMixin` to forward the input to combo-box.
     * @protected
     * @override
     */
    _inputElementChanged(input) {
      super._inputElementChanged(input);

      if (input) {
        this.$.comboBox._setInputElement(input);
      }
    }

    /**
     * Override method inherited from `FocusMixin` to validate on blur.
     * @param {boolean} focused
     * @protected
     */
    _setFocused(focused) {
      super._setFocused(focused);

      // Do not validate when focusout is caused by document
      // losing focus, which happens on browser tab switch.
      if (!focused && document.hasFocus()) {
        this._focusedChipIndex = -1;
        this._requestValidation();
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
    _autoExpandHorizontallyChanged(autoExpand, oldAutoExpand) {
      if (autoExpand || oldAutoExpand) {
        this.__updateChips();
      }
    }

    /** @private */
    _autoExpandVerticallyChanged(autoExpand, oldAutoExpand) {
      if (autoExpand || oldAutoExpand) {
        this.__updateChips();
      }
    }

    /**
     * Setting clear button visible reduces total space available
     * for rendering chips, and making it hidden increases it.
     * @private
     */
    _clearButtonVisibleChanged(visible, oldVisible) {
      if (visible || oldVisible) {
        this.__updateChips();
      }
    }

    /**
     * Implement two-way binding for the `filteredItems` property
     * that can be set on the internal combo-box element.
     *
     * @param {CustomEvent} event
     * @private
     */
    _onFilteredItemsChanged(event) {
      const { value } = event.detail;
      if (Array.isArray(value) || value == null) {
        this.filteredItems = value;
      }
    }

    /** @private */
    _readonlyChanged(readonly, oldReadonly) {
      if (readonly || oldReadonly) {
        this.__updateChips();
      }

      if (this.dataProvider) {
        this.clearCache();
      }
    }

    /** @private */
    __itemClassNameGeneratorChanged(generator, oldGenerator) {
      if (generator || oldGenerator) {
        this.__updateChips();
      }
    }

    /** @private */
    _pageSizeChanged(pageSize, oldPageSize) {
      if (Math.floor(pageSize) !== pageSize || pageSize <= 0) {
        this.pageSize = oldPageSize;
        console.error('"pageSize" value must be an integer > 0');
      }

      this.$.comboBox.pageSize = this.pageSize;
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

      if (this.opened) {
        this.$.comboBox._updateOverlayWidth();
      }
    }

    /** @private */
    _getItemLabel(item) {
      return this.$.comboBox._getItemLabel(item);
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
        // Clear both combo box value and filter.
        this.filter = '';
        this.$.comboBox.clear();
      } else {
        // Only clear combo box value. This effectively resets _lastCommittedValue
        // which allows toggling the same item multiple times via keyboard.
        this.$.comboBox.clear();
        // Restore input to the filter value. Needed when items are
        // navigated with keyboard, which overrides the input value
        // with the item label.
        this._inputElementValue = this.filter;
      }
    }

    /** @private */
    __announceItem(itemLabel, isSelected, itemCount) {
      const state = isSelected ? 'selected' : 'deselected';
      const total = this.i18n.total.replace('{count}', itemCount || 0);
      announce(`${itemLabel} ${this.i18n[state]} ${total}`);
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
      } else if (!opened) {
        this._topGroup = [...selectedItems];
      }
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
    async __updateChips() {
      if (!this._inputField || !this.inputElement) {
        return;
      }

      if (!this._inputField.$) {
        await this._inputField.updateComplete;
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
          // Render Lit based chip
          if (chip.performUpdate) {
            chip.performUpdate();
          }
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
        // Render Lit based chip
        if (chip.performUpdate) {
          chip.performUpdate();
        }

        // When auto expanding vertically, no need to measure remaining width
        if (!this.autoExpandVertically && this.$.chips.clientWidth > remainingWidth) {
          // Always show at least last selected item as a chip
          if (refNode === null) {
            chip.style.maxWidth = `${Math.max(chipMinWidth, remainingWidth)}px`;
          } else {
            chip.remove();
            break;
          }
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

    /** @private */
    _onClearButtonTouchend(event) {
      // Cancel the following click and focus events
      event.preventDefault();
      // Prevent default combo box behavior which can otherwise unnecessarily
      // clear the input and filter
      event.stopPropagation();

      this.clear();
    }

    /**
     * Override method inherited from `InputControlMixin` and clear items.
     * @protected
     * @override
     */
    _onClearButtonClick(event) {
      event.stopPropagation();

      this.clear();
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
      if (this.clearButtonVisible && this.selectedItems && this.selectedItems.length) {
        event.stopPropagation();
        this.selectedItems = [];
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
          announce(`${itemLabel} ${this.i18n.focused}`);
        }
      }
    }

    /** @private */
    _onComboBoxChange() {
      const item = this.$.comboBox.selectedItem;
      if (item) {
        this.__selectItem(item);
      }
    }

    /** @private */
    _onComboBoxItemSelected(event) {
      this.__selectItem(event.detail.item);
    }

    /** @private */
    _onCustomValueSet(event) {
      // Do not set combo-box value
      event.preventDefault();

      // Stop the original event
      event.stopPropagation();

      this.__clearInternalValue(true);

      this.dispatchEvent(
        new CustomEvent('custom-value-set', {
          detail: event.detail,
          composed: true,
          bubbles: true,
        }),
      );
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
