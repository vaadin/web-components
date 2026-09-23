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

        /**
         * When set together with `dataProvider`, shows the select all button
         * and delegates the selection state and the toggle to the provider.
         * The provider is ignored with the `items` API.
         *
         * The object must provide the following callbacks:
         *
         * - `isAllSelected()`: returns `true` when all items matching the
         *   current filter are selected. The component calls it synchronously
         *   each time it updates the button, for example after `selectedItems`,
         *   `filter` or `filteredItems` change. The callback must return
         *   quickly and must not start a request. When the state comes from
         *   elsewhere, for example from the server, return the last known
         *   state and call `_requestSelectAllUpdate()` when a new state is
         *   available.
         * - `toggleSelectAll()`: selects all items matching the current filter,
         *   or deselects them when they are all selected. May return a promise.
         *   The provider must update `selectedItems`. After the promise
         *   resolves, the component announces the new number of selected items.
         *   The component does not fire a `change` event in this case.
         *
         * This API is considered internal: it only facilitates integration of
         * the Flow component, it is not intended to be used for standalone
         * usage of the web component.
         * @private
         */
        _selectAllProvider: {
          type: Object,
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
        (!this.dataProvider || this.#hasActiveProvider) &&
        this.#getFilteredItems().length > 0
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
        '_selectAllProvider',
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
     * `_selectAllProvider.toggleSelectAll` when it is set and
     * a data provider is used.
     * @protected
     */
    _toggleSelectAll() {
      if (this.#hasActiveProvider) {
        this.#toggleSelectAllWithProvider();
        return;
      }

      this._toggleSelectAllLocally();
      this.__announceSelection();
    }

    /**
     * Selects all items matching the current filter, or deselects
     * them when all of them are already selected, by updating
     * `selectedItems`.
     *
     * Only exposed as protected method to be used by the Flow component
     * connector.
     * @protected
     */
    _toggleSelectAllLocally() {
      const filteredItems = this.#getFilteredItems();
      let selectedItems;

      if (this._areAllFilteredItemsSelected()) {
        selectedItems = this.selectedItems.filter((item) => !this.#includesItem(filteredItems, item));
      } else {
        const missingItems = filteredItems.filter((item) => !this.#includesItem(this.selectedItems, item));
        selectedItems = [...this.selectedItems, ...missingItems];
      }

      this.__updateSelection(selectedItems);
    }

    /**
     * Returns true when all items matching the current filter are selected.
     *
     * Only exposed as protected method to be used by the Flow component
     * connector.
     * @return {boolean}
     * @protected
     */
    _areAllFilteredItemsSelected() {
      const items = this.#getFilteredItems();
      return items.length > 0 && items.every((item) => this.#includesItem(this.selectedItems, item));
    }

    /**
     * Updates the select all button, so that its label shows the current
     * result of `_selectAllProvider.isAllSelected()`. Call this method
     * when the provider has a new selection state.
     *
     * Only exposed as protected method to be used by the Flow component
     * connector.
     * @protected
     */
    _requestSelectAllUpdate() {
      this.#updateButton();
    }

    get #hasActiveProvider() {
      return !!this.dataProvider && !!this._selectAllProvider;
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

    async #toggleSelectAllWithProvider() {
      // The provider owns the selection and is expected to update
      // `selectedItems` itself. Intentionally do not fire `change` and do
      // not request validation here, only announce the result.
      try {
        await this._selectAllProvider.toggleSelectAll();
      } catch (error) {
        console.error(error);
        return;
      }

      this.__announceSelection();
    }

    #isAllSelectedWithProvider() {
      // Fall back to "not all selected" so that an error in the provider
      // does not break the update of the component
      try {
        return this._selectAllProvider.isAllSelected();
      } catch (error) {
        console.error(error);
        return false;
      }
    }

    #getButtonLabel() {
      const { selectAll, deselectAll, selectFiltered, deselectFiltered } = this.__effectiveI18n;
      const allSelected = this.#hasActiveProvider
        ? this.#isAllSelectedWithProvider()
        : this._areAllFilteredItemsSelected();

      if (this.filter) {
        return allSelected ? deselectFiltered : selectFiltered;
      }

      return allSelected ? deselectAll : selectAll;
    }

    #getFilteredItems() {
      return this.filteredItems || [];
    }

    #includesItem(items, item) {
      return items.some((other) => this._isSameItem(item, other));
    }
  };
