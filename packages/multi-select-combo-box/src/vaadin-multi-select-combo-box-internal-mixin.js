/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ComboBoxDataProviderMixin } from '@vaadin/combo-box/src/vaadin-combo-box-data-provider-mixin.js';
import { ComboBoxMixin } from '@vaadin/combo-box/src/vaadin-combo-box-mixin.js';
import { ComboBoxPlaceholder } from '@vaadin/combo-box/src/vaadin-combo-box-placeholder.js';

/**
 * @polymerMixin
 * @mixes ComboBoxDataProviderMixin
 * @mixes ComboBoxMixin
 */
export const MultiSelectComboBoxInternalMixin = (superClass) =>
  class MultiSelectComboBoxInternalMixinClass extends ComboBoxDataProviderMixin(ComboBoxMixin(superClass)) {
    static get properties() {
      return {
        /**
         * A subset of items, filtered based on the user input.
         */
        filteredItems: {
          type: Array,
          notify: true,
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
         * When set to `true`, "loading" attribute is set
         * on the host and the overlay element.
         * @type {boolean}
         */
        loading: {
          type: Boolean,
          notify: true,
          sync: true,
        },

        /**
         * Total number of items.
         * @type {number | undefined}
         */
        size: {
          type: Number,
          notify: true,
          observer: '_sizeChanged',
          sync: true,
        },

        /**
         * Selected items to render in the dropdown
         * when the component is read-only.
         */
        selectedItems: {
          type: Array,
          value: () => [],
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

        /**
         * Last input value entered by the user before value is updated.
         * Used to store `filter` property value before clearing it.
         */
        lastFilter: {
          type: String,
          notify: true,
          sync: true,
        },

        /**
         * A subset of items to be shown at the top of the overlay.
         */
        topGroup: {
          type: Array,
          observer: '_topGroupChanged',
          sync: true,
        },

        owner: {
          type: Object,
        },

        _target: {
          type: Object,
        },
      };
    }

    static get observers() {
      return ['_readonlyChanged(readonly)'];
    }

    /**
     * Reference to the clear button element.
     * @protected
     * @return {!HTMLElement}
     */
    get clearElement() {
      return this.querySelector('[part="clear-button"]');
    }

    /**
     * Tag name prefix used by scroller and items.
     * @protected
     * @return {string}
     */
    get _tagNamePrefix() {
      return 'vaadin-multi-select-combo-box';
    }

    constructor() {
      super();

      this.addEventListener('custom-value-set', this.__onCustomValueSet.bind(this));
    }

    /**
     * Override method inherited from the combo-box
     * to allow opening dropdown when readonly.
     * @override
     */
    open() {
      if (!this.disabled && !(this.readonly && this.selectedItems.length === 0)) {
        this.opened = true;
      }
    }

    /** @protected */
    ready() {
      super.ready();

      this._target = this;
      this._toggleElement = this.querySelector('.toggle-button');
    }

    /** @protected */
    _updateOverlayWidth() {
      this.$.overlay._updateOverlayWidth();
    }

    /** @private */
    _readonlyChanged() {
      this._setDropdownItems(this.filteredItems);
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
        super._setDropdownItems(this.selectedItems);
        return;
      }

      if (this.filter || !this.selectedItemsOnTop) {
        super._setDropdownItems(items);
        return;
      }

      if (items && items.length && this.topGroup && this.topGroup.length) {
        // Filter out items included to the top group.
        const filteredItems = items.filter(
          (item) => this.owner._findIndex(item, this.topGroup, this.itemIdPath) === -1,
        );

        super._setDropdownItems(this.topGroup.concat(filteredItems));
        return;
      }

      super._setDropdownItems(items);
    }

    /** @private */
    _topGroupChanged(topGroup) {
      if (topGroup) {
        this._setDropdownItems(this.filteredItems);
      }
    }

    /**
     * Override combo-box method to set correct owner for using by item renderers.
     * @protected
     * @override
     */
    _initScroller() {
      super._initScroller(this.owner);
    }

    /**
     * Override Enter handler to keep overlay open
     * when item is selected or unselected.
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
     * Override Escape handler to not clear
     * selected items when readonly.
     * @param {!Event} event
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

      super._onEscape(event);
    }

    /**
     * Override from combo-box to ignore requests to clear the filter if the
     * keepFilter option is enabled. Exceptions are when the dropdown is closed,
     * so the filter is still cleared on cancel and focus out.
     * @protected
     * @override
     */
    _clearFilter() {
      if (!this.keepFilter || !this.opened) {
        super._clearFilter();
      }
    }

    /**
     * Override method from combo-box to always clear the filter when reverting
     * the input value, regardless of the keepFilter option.
     * @override
     * @protected
     */
    _revertInputValueToValue() {
      super._revertInputValueToValue();
      this.filter = '';
    }

    /**
     * @protected
     * @override
     */
    _commitValue() {
      // Store filter value for checking if user input is matching
      // an item which is already selected, to not un-select it.
      this.lastFilter = this.filter;

      super._commitValue();
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
     * Override method inherited from the combo-box
     * to close dropdown on blur when readonly.
     * @param {boolean} focused
     * @protected
     * @override
     */
    _setFocused(focused) {
      // Disable combo-box logic that updates selectedItem
      // based on the overlay focused index on input blur
      if (!focused) {
        this._ignoreCommitValue = true;
      }

      super._setFocused(focused);

      if (!focused && this.readonly && !this._closeOnBlurIsPrevented) {
        this.close();
      }
    }

    /**
     * Override method inherited from the combo-box
     * to not commit an already selected item again
     * after closing overlay on outside click.
     * @protected
     * @override
     */
    _onClosed() {
      this._ignoreCommitValue = true;

      super._onClosed();
    }

    /**
     * Override method inherited from the combo-box
     * to not commit an already selected item again
     * on blur, which would result in un-selecting.
     * @protected
     * @override
     */
    _detectAndDispatchChange() {
      if (this._ignoreCommitValue) {
        this._ignoreCommitValue = false;

        // Reset internal combo-box state
        this.clear();
        this._inputElementValue = '';
        return;
      }

      super._detectAndDispatchChange();
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
        this.lastFilter = this.filter;

        this.dispatchEvent(
          new CustomEvent('combo-box-item-selected', {
            detail: {
              item: event.detail.item,
            },
          }),
        );
      }
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
     * Override method inherited from the combo-box
     * to not clear the data provider cache when read-only.
     *
     * @protected
     * @override
     */
    clearCache() {
      if (this.readonly) {
        return;
      }

      super.clearCache();
    }

    /** @private */
    __onCustomValueSet(event) {
      // Prevent setting custom value on input blur or outside click,
      // so it can be only committed explicitly by pressing Enter.
      if (this._ignoreCommitValue) {
        event.stopImmediatePropagation();
      }
    }
  };
