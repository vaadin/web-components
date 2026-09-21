/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
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
      return this.selectAllButtonVisible && !this.readonly && !this.dataProvider && this.#getFilteredItems().length > 0;
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

      if (
        props.has('_highlightState') &&
        props.get('_highlightState')?.type === 'item' &&
        this._isSelectAllHighlighted
      ) {
        // When highlighting the button, revert input value to the filter
        this._revertInputValue();
      }

      const buttonProps = [
        'selectAllButtonVisible',
        'readonly',
        'dataProvider',
        'filteredItems',
        'selectedItems',
        'itemIdPath',
        'filter',
        '_highlightState',
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
     * them when all of them are already selected.
     * @protected
     */
    _toggleSelectAll() {
      const filteredItems = this.#getFilteredItems();
      let selectedItems;

      if (this.#areAllFilteredItemsSelected()) {
        selectedItems = this.selectedItems.filter((item) => !this.#includesItem(filteredItems, item));
      } else {
        const missingItems = filteredItems.filter((item) => !this.#includesItem(this.selectedItems, item));
        selectedItems = [...this.selectedItems, ...missingItems];
      }

      this.__updateSelection(selectedItems, true);
    }

    #updateButton() {
      if (!this._hasSelectAllButton) {
        this.#button.remove();
        return;
      }

      const button = this.#button;
      button.label = this.#getButtonLabel();
      button.focused = this._isSelectAllHighlighted;

      if (button.parentNode !== this) {
        this.appendChild(button);
      }
    }

    #getButtonLabel() {
      const { selectAll, deselectAll, selectFiltered, deselectFiltered } = this.__effectiveI18n;
      const allSelected = this.#areAllFilteredItemsSelected();

      if (this.filter) {
        return allSelected ? deselectFiltered : selectFiltered;
      }

      return allSelected ? deselectAll : selectAll;
    }

    #getFilteredItems() {
      return this.filteredItems || [];
    }

    #areAllFilteredItemsSelected() {
      const items = this.#getFilteredItems();
      return items.length > 0 && items.every((item) => this.#includesItem(this.selectedItems, item));
    }

    #includesItem(items, item) {
      return items.some((other) => this._isSameItem(item, other));
    }
  };
