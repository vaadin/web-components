/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { announce } from '@vaadin/a11y-base/src/announce.js';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';

/**
 * A controller that manages the select all button of `<vaadin-multi-select-combo-box>`.
 * It adds the button to the light DOM of the host in the `select-all` slot while it is
 * visible, updates the label to reflect the current selection, selects or deselects
 * the items matching the current filter when the button is activated, and keeps focus
 * inside the component while moving between the input and the button.
 *
 * The button is only supported with the `items` API. With a data provider, the
 * component may not have all items loaded, so the button is not rendered.
 *
 * The host updates the controller by calling the `willUpdate` hook, and passes
 * its keydown events to `handleKeyDown`.
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

  /**
   * The button element. Only attached to the host while the button is visible.
   * @return {HTMLElement}
   */
  get element() {
    return this.#element;
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

    // When button is hidden or the overlay closes, move focus back to the
    // input to avoid dropping focus to the body
    if (this.#isButtonFocused() && (!this.#visible || !host._overlayOpened)) {
      host.inputElement.focus();
    }

    this.#updateElement();
  }

  /**
   * Handles a keydown event of the host. Returns true when the event was
   * consumed and the host should not handle it any further.
   * @param {KeyboardEvent} event
   * @return {boolean}
   */
  handleKeyDown(event) {
    const host = this.#host;

    if (this.#isButtonEvent(event)) {
      switch (event.key) {
        case 'Tab':
          // Move focus back to the input instead of leaving the component
          event.preventDefault();
          host.inputElement.focus();
          return true;
        case 'Escape':
        case 'ArrowDown':
        case 'ArrowUp':
          // Move focus back to the input and let the host handle the key as if pressed there.
          host.inputElement.focus();
          event.preventDefault();
          return false;
        case 'Enter':
        case ' ':
          // The button is not a native button, so activate it here
          event.preventDefault();
          this.toggleSelection();
          return true;
        default:
          return true;
      }
    }

    // Move focus to the button instead of leaving the component
    if (event.key === 'Tab' && host._overlayOpened && this.#visible) {
      event.preventDefault();
      this.#focusButton();
      return true;
    }

    return false;
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

  #focusButton() {
    const host = this.#host;

    // Only the button should look focused, so reset the highlighted
    // item and chip, and restore the input to show the filter instead
    // of the label of the previously highlighted item.
    if (host._hasHighlightedItem) {
      host._inputElementValue = host.filter;
    }
    host._clearHighlight();

    this.#element.focus({ focusVisible: true });
    host.removeAttribute('focus-ring');
  }

  #isButtonEvent(event) {
    return event.composedPath().includes(this.#element);
  }

  #isButtonFocused() {
    return this.#element === getDeepActiveElement();
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
