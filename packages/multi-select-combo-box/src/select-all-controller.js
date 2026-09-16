/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { announce } from '@vaadin/a11y-base/src/announce.js';
import { generateUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';

/**
 * A controller that manages the select all button of `<vaadin-multi-select-combo-box>`.
 * It adds the button to the light DOM of the host in the `select-all` slot while it is
 * visible, updates the label to reflect the current selection, and selects or deselects
 * the items matching the current filter when the button is activated.
 *
 * The button is never focused. The host highlights it through its highlight state,
 * which the controller reflects with the `focused` attribute while the input
 * references the button with `aria-activedescendant`.
 *
 * The button is only supported with the `items` API. With a data provider, the
 * component may not have all items loaded, so the button is not rendered.
 *
 * The host updates the controller by calling the `willUpdate` hook, and
 * references the button with `id`.
 */
export class SelectAllController {
  #host;

  #element;

  #visible = false;

  #allSelected = false;

  /**
   * @param {HTMLElement} host the multi-select combo box
   */
  constructor(host) {
    this.#host = host;

    const element = document.createElement('vaadin-multi-select-combo-box-select-all-button');
    element.setAttribute('slot', 'select-all');
    element.id = `select-all-${host.localName}-${generateUniqueId()}`;
    element.addEventListener('click', () => this.toggleSelection());
    this.#element = element;
  }

  /**
   * Whether the button is currently shown.
   * @return {boolean}
   */
  get visible() {
    return this.#visible;
  }

  get id() {
    return this.#element.id;
  }

  /**
   * @param {Map<string, unknown>} props the changed host properties
   */
  willUpdate(props) {
    const host = this.#host;

    if (
      ['filteredItems', 'selectedItems', 'itemIdPath', 'selectAllButtonVisible', 'readonly', 'dataProvider'].some(
        (prop) => props.has(prop),
      )
    ) {
      const items = this.#getFilteredItems();
      this.#visible = host.selectAllButtonVisible && !host.readonly && !host.dataProvider;
      this.#allSelected = items.length > 0 && items.every((item) => host._findIndex(item, host.selectedItems) > -1);
    }

    this.#updateElement();
  }

  /**
   * Selects all items matching the current filter, or deselects
   * them when all of them are already selected.
   */
  toggleSelection() {
    const host = this.#host;
    const filteredItems = this.#getFilteredItems();
    let selectedItems;

    if (this.#allSelected) {
      selectedItems = host.selectedItems.filter((item) => host._findIndex(item, filteredItems) === -1);
    } else {
      const missingItems = filteredItems.filter((item) => host._findIndex(item, host.selectedItems) === -1);
      selectedItems = [...host.selectedItems, ...missingItems];
    }

    host.__updateSelection(selectedItems);
    this.#announceResult();
  }

  #updateElement() {
    const host = this.#host;
    const element = this.#element;

    if (!this.#visible) {
      element.remove();
      return;
    }

    element.label = this.#getText();
    element.focused = host._isSelectAllHighlighted;

    if (element.parentNode !== host) {
      host.appendChild(element);
    }
  }

  #getText() {
    const host = this.#host;
    const { selectAll, deselectAll, selectFiltered, deselectFiltered } = host.__effectiveI18n;

    if (host.filter) {
      return this.#allSelected ? deselectFiltered : selectFiltered;
    }

    return this.#allSelected ? deselectAll : selectAll;
  }

  #getFilteredItems() {
    return this.#host.filteredItems || [];
  }

  #announceResult() {
    const host = this.#host;
    const count = host.selectedItems.length;
    if (count === 0) {
      announce(host.__effectiveI18n.cleared);
    } else {
      announce(host.__effectiveI18n.total.replace('{count}', count));
    }
  }
}
