/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { announce } from '@vaadin/a11y-base/src/announce.js';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';

/**
 * A controller that manages the select all button of `<vaadin-multi-select-combo-box>`.
 * It shows or hides the button, updates its label, selects or deselects the items
 * matching the current filter when the button is clicked, and keeps focus inside
 * the component while moving between the input and the button.
 *
 * The button is only supported with the `items` API. With a data provider, the
 * component may not have all items loaded, so the button is not shown.
 *
 * The host renders the button and calls `update` after every change to a property
 * the button depends on.
 */
export class SelectAllController {
  #allSelected = false;

  #host;

  #button;

  /**
   * @param {HTMLElement} host the multi-select combo box
   * @param {HTMLButtonElement} button the select all button rendered by the host
   */
  constructor(host, button) {
    this.#host = host;
    this.#button = button;
    button.addEventListener('click', () => this.#onClick());
    this.update();
  }

  /**
   * Updates the button to reflect the current state of the host. To be called
   * by the host whenever a property the button depends on has changed.
   */
  update() {
    const host = this.#host;
    const button = this.#button;

    const visible = host.selectAllButtonVisible && !host.readonly && !host.dataProvider;
    if (!visible) {
      // Do not drop focus to the body when the button is about to be hidden.
      if (this.#isButtonFocused()) {
        host.inputElement.focus();
      }
    }

    button.hidden = !visible;

    if (!visible) {
      // Skip further updates if the button is hidden anyway
      return;
    }

    this.#allSelected = this.#isEveryFilteredItemSelected();

    const { selectAll, deselectAll, selectFiltered, deselectFiltered } = host.__effectiveI18n;
    if (host.filter) {
      button.textContent = this.#allSelected ? deselectFiltered : selectFiltered;
    } else {
      button.textContent = this.#allSelected ? deselectAll : selectAll;
    }
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
        default:
          // Leave other keys to the button, e.g. Enter and Space activating it.
          return true;
      }
    }

    // Move focus to the button instead of leaving the component
    if (event.key === 'Tab' && host._overlayOpened && !this.#button.hidden) {
      event.preventDefault();
      this.#focusButton();
      return true;
    }

    return false;
  }

  /**
   * Moves focus back to the input if the button has focus, e.g. when the
   * overlay containing the button is about to close.
   */
  restoreFocus() {
    if (this.#isButtonFocused()) {
      this.#host.inputElement.focus();
    }
  }

  /**
   * Selects the items matching the current filter, or deselects them when
   * they are all selected already.
   */
  #onClick() {
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

  #focusButton() {
    const host = this.#host;

    // Only the button should look focused, so reset the highlighted
    // item and chip, and restore the input to show the filter instead
    // of the label of the previously highlighted item.
    if (host._focusedIndex > -1) {
      host._focusedIndex = -1;
      host._inputElementValue = host.filter;
    }
    host._focusedChipIndex = -1;

    this.#button.focus({ focusVisible: true });
    host.removeAttribute('focus-ring');
  }

  /**
   * Returns true when the event originates from the button.
   */
  #isButtonEvent(event) {
    return event.composedPath().includes(this.#button);
  }

  /**
   * Returns true when the button has focus.
   */
  #isButtonFocused() {
    return this.#button === getDeepActiveElement();
  }

  /**
   * Returns the items matching the current filter.
   */
  #getFilteredItems() {
    return this.#host.filteredItems || [];
  }

  /**
   * Returns true when there are items matching the current filter and
   * all of them are selected.
   */
  #isEveryFilteredItemSelected() {
    const host = this.#host;
    const items = this.#getFilteredItems();
    return items.length > 0 && items.every((item) => host._findIndex(item, host.selectedItems) > -1);
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
