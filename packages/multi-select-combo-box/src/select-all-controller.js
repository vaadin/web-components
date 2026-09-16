/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, nothing } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { announce } from '@vaadin/a11y-base/src/announce.js';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';

/**
 * A controller that manages the select all button of `<vaadin-multi-select-combo-box>`.
 * It renders the button with a label reflecting the current selection, selects or
 * deselects the items matching the current filter when the button is clicked, and
 * keeps focus inside the component while moving between the input and the button.
 *
 * The button is only supported with the `items` API. With a data provider, the
 * component may not have all items loaded, so the button is not rendered.
 *
 * The host renders the button calling `render()` from its template, and updates
 * the controller by calling the `willUpdate` hook.
 */
export class SelectAllController {
  #host;

  #buttonRef = createRef();

  #boundOnClick = this.#onClick.bind(this);

  #visible = false;

  #allSelected = false;

  /**
   * @param {HTMLElement} host the multi-select combo box
   */
  constructor(host) {
    this.#host = host;
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
  }

  /**
   * @return {TemplateResult | typeof nothing}
   */
  render() {
    if (!this.#visible) {
      return nothing;
    }

    /* avoid unnecessary white space characters before and after the text */
    return html`
      <button part="select-all" type="button" ${ref(this.#buttonRef)} @click="${this.#boundOnClick}"
        >${this.#getText()}</button
      >
    `;
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
    if (event.key === 'Tab' && host._overlayOpened && this.#button) {
      event.preventDefault();
      this.#focusButton();
      return true;
    }

    return false;
  }

  get #button() {
    return this.#buttonRef.value;
  }

  #getText() {
    const host = this.#host;
    const { selectAll, deselectAll, selectFiltered, deselectFiltered } = host.__effectiveI18n;

    if (host.filter) {
      return this.#allSelected ? deselectFiltered : selectFiltered;
    }

    return this.#allSelected ? deselectAll : selectAll;
  }

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
    if (host._hasHighlightedItem) {
      host._inputElementValue = host.filter;
    }
    host._clearHighlight();

    this.#button.focus({ focusVisible: true });
    host.removeAttribute('focus-ring');
  }

  #isButtonEvent(event) {
    return !!this.#button && event.composedPath().includes(this.#button);
  }

  #isButtonFocused() {
    return !!this.#button && this.#button === getDeepActiveElement();
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
