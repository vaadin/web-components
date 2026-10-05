/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ComboBoxPlaceholder } from '@vaadin/combo-box/src/vaadin-combo-box-placeholder.js';
import { generateUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';

/**
 * A mixin that manages the select all button of `<vaadin-multi-select-combo-box>`.
 */
export const MultiSelectComboBoxSelectAllMixin = (superClass) =>
  class MultiSelectComboBoxSelectAllMixinClass extends superClass {
    static get properties() {
      return {
        /**
         * Set to true to show a button above the dropdown items for selecting
         * or deselecting all items matching the current filter at once. Items
         * that do not match the filter keep their selection state.
         *
         * The button is only supported with the `items` API. It is not shown
         * when using `dataProvider`.
         * @attr {boolean} select-all-button-visible
         */
        selectAllButtonVisible: {
          type: Boolean,
          value: false,
          sync: true,
        },

        /**
         * Shows the select all button with `dataProvider`, and is called instead of
         * the local toggle while `_allSelected` is set. The function must update
         * `selectedItems` and may return a promise. The component announces the
         * result after it resolves, without firing `change`.
         * Internal API for the Flow component.
         * @private
         */
        _toggleSelectAllHandler: {
          type: Function,
          attribute: false,
          sync: true,
        },

        /**
         * Whether all items matching the filter are selected, set by the server
         * with a data provider. When not set, the component computes it locally.
         * @private
         */
        _allSelected: {
          type: Boolean,
          attribute: false,
          sync: true,
        },
      };
    }

    #button;

    constructor() {
      super();

      const button = document.createElement('vaadin-multi-select-combo-box-select-all-button');
      button.setAttribute('slot', 'select-all');
      button.id = `select-all-${this.localName}-${generateUniqueId()}`;
      button.addEventListener('click', () => this._toggleSelectAll());
      this.#button = button;
    }

    /** @protected */
    get _hasSelectAllButton() {
      return (
        this.selectAllButtonVisible &&
        !this.readonly &&
        (!this.dataProvider || this.#hasActiveHandler) &&
        this.#hasLoadedFilteredItems()
      );
    }

    /** @protected */
    willUpdate(props) {
      super.willUpdate(props);

      if (props.has('filter') || !this.opened || !this._hasSelectAllButton) {
        this._clearSelectAllHighlight();
      }
    }

    /** @protected */
    updated(props) {
      super.updated(props);

      if (props.has('_highlightState')) {
        this.#button.focused = this._isSelectAllHighlighted;

        if (props.get('_highlightState')?.type === 'item' && this._isSelectAllHighlighted) {
          // When highlighting the button, revert input value to the filter
          this._revertInputValue();
        }
      }

      // Properties that affect whether the button is shown, or the label
      // of the button
      const buttonProps = [
        'selectAllButtonVisible',
        '_toggleSelectAllHandler',
        '_allSelected',
        'readonly',
        'dataProvider',
        'filteredItems',
        'selectedItems',
        'itemIdPath',
        'filter',
        '__effectiveI18n',
      ];

      if (buttonProps.some((prop) => props.has(prop))) {
        this.#updateButton();
      }
    }

    /**
     * Override method from `ComboBoxBaseMixin` to reference the select all
     * button from the input while the button is highlighted.
     * @protected
     * @override
     */
    _updateActiveDescendant() {
      if (this._isSelectAllHighlighted) {
        this.inputElement?.setAttribute('aria-activedescendant', this.#button.id);
      } else {
        super._updateActiveDescendant();
      }
    }

    /**
     * Selects all items matching the current filter, or deselects
     * them when all of them are already selected. Delegates to
     * `_toggleSelectAllHandler` while `_allSelected` is set.
     * @protected
     */
    _toggleSelectAll() {
      if (this.#hasServerState) {
        this.#toggleSelectAllWithHandler();
      } else {
        this.#toggleSelectAllLocally();
      }
    }

    get #hasActiveHandler() {
      return !!this.dataProvider && !!this._toggleSelectAllHandler;
    }

    get #hasServerState() {
      return this.#hasActiveHandler && this._allSelected != null;
    }

    #updateButton() {
      this.toggleAttribute('has-select-all', this._hasSelectAllButton);

      if (!this._hasSelectAllButton) {
        this.#button.remove();
        return;
      }

      const button = this.#button;
      button.label = this.#getButtonLabel();

      if (button.parentNode !== this) {
        this.appendChild(button);
      }
    }

    #getButtonLabel() {
      const { selectAll, deselectAll, selectFiltered, deselectFiltered } = this.__effectiveI18n;
      const allSelected = this.#hasServerState ? this._allSelected : this.#areAllFilteredItemsSelected();

      if (this.filter) {
        return allSelected ? deselectFiltered : selectFiltered;
      }

      return allSelected ? deselectAll : selectAll;
    }

    async #toggleSelectAllWithHandler() {
      // The handler owns the selection and is expected to update
      // `selectedItems` itself. Intentionally do not fire `change` and do
      // not request validation here, only announce the result.
      try {
        await this._toggleSelectAllHandler();
      } catch (error) {
        console.error(error);
        return;
      }

      this.__announceSelection();
    }

    #toggleSelectAllLocally() {
      const filteredItems = this.#getFilteredItems();
      let selectedItems;

      if (this.#areAllFilteredItemsSelected()) {
        selectedItems = this.selectedItems.filter((item) => !this.#includesItem(filteredItems, item));
      } else {
        const missingItems = filteredItems.filter((item) => !this.#includesItem(this.selectedItems, item));
        selectedItems = [...this.selectedItems, ...missingItems];
      }

      this.__updateSelection(selectedItems);
      this.__announceSelection();
    }

    #areAllFilteredItemsSelected() {
      const items = this.#getFilteredItems();
      return items.length > 0 && items.every((item) => this.#includesItem(this.selectedItems, item));
    }

    #hasLoadedFilteredItems() {
      // Hide the button while no page is loaded, for example after `clearCache()`
      return (this.filteredItems || []).some((item) => !(item instanceof ComboBoxPlaceholder));
    }

    #getFilteredItems() {
      return this.filteredItems || [];
    }

    #includesItem(items, item) {
      return items.some((other) => this._isSameItem(item, other));
    }
  };
