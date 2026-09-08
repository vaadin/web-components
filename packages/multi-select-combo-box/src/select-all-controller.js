/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { announce } from '@vaadin/a11y-base/src/announce.js';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';
import { ComboBoxPlaceholder } from '@vaadin/combo-box/src/vaadin-combo-box-placeholder.js';

// Host properties that affect whether the button is rendered and which label it shows.
const HOST_PROPERTIES = [
  'selectAllButtonVisible',
  'selectAllState',
  'selectAllCallback',
  'readonly',
  'filteredItems',
  'selectedItems',
  'size',
  'loading',
  'filter',
  'itemIdPath',
  '__effectiveI18n',
];

/**
 * A controller that manages the select all button of `<vaadin-multi-select-combo-box>`.
 * It derives whether the button is rendered and which label it shows, selects or
 * deselects the items matching the current filter when the button is clicked, and
 * keeps focus inside the component while moving between the input and the button.
 */
export class SelectAllController {
  /**
   * True when the button should be rendered.
   * @type {boolean}
   */
  rendered = false;

  /**
   * The label of the button.
   * @type {string}
   */
  label = '';

  /**
   * Click listener of the button. Selects the items matching the current
   * filter, or deselects them when they are all selected already.
   */
  onClick = () => {
    const host = this.#host;

    // Ignore clicks while the state might be stale.
    if (host.loading || this.#pending) {
      return;
    }

    const selected = this.#state !== 'all';
    if (this.#areAllFilteredItemsLoaded()) {
      this.#setFilteredItemsSelected(selected);
    } else if (typeof host.selectAllCallback === 'function') {
      this.#delegate(selected);
    }
  };

  /** @type {'all' | 'none' | undefined} */
  #state;

  /** True while waiting for `selectAllCallback` to settle. */
  #pending = false;

  #host;

  constructor(host) {
    this.#host = host;
  }

  /**
   * The button element, if currently rendered.
   * @return {HTMLButtonElement | null}
   */
  get button() {
    const { shadowRoot } = this.#host;
    return shadowRoot ? shadowRoot.querySelector('[part="select-all"]') : null;
  }

  /**
   * Updates `rendered` and `label` when a relevant host property has changed.
   * To be called from the `willUpdate` lifecycle callback of the host.
   * @param {Map<string, unknown>} props
   */
  update(props) {
    if (!HOST_PROPERTIES.some((prop) => props.has(prop))) {
      return;
    }

    const host = this.#host;
    const state = this.#getState();
    const rendered = host.selectAllButtonVisible && !host.readonly && state !== undefined;

    // Do not drop focus to the body when the button is about to be removed.
    if (this.rendered && !rendered && this.isButtonFocused()) {
      host.inputElement.focus();
    }

    const { selectAll, deselectAll, selectFiltered, deselectFiltered } = host.__effectiveI18n;
    const allSelected = state === 'all';
    if (host.filter) {
      this.label = allSelected ? deselectFiltered : selectFiltered;
    } else {
      this.label = allSelected ? deselectAll : selectAll;
    }

    this.rendered = rendered;
    this.#state = state;
  }

  /**
   * Returns true when the event originates from the button.
   * @param {Event} event
   * @return {boolean}
   */
  isButtonEvent(event) {
    const { button } = this;
    return !!button && event.composedPath().includes(button);
  }

  /**
   * Returns true when the button has focus.
   * @return {boolean}
   */
  isButtonFocused() {
    const { button } = this;
    return !!button && button === getDeepActiveElement();
  }

  /**
   * Returns true when the focus event moves focus between the input and the
   * button, in which case the host should keep its focused state.
   * @param {FocusEvent} event
   * @return {boolean}
   */
  isFocusMovingToInputOrButton(event) {
    const host = this.#host;
    // The button is in the shadow root, so when focus moves from the input to
    // the button, `relatedTarget` is retargeted to the host element itself.
    return !!this.button && (event.relatedTarget === host || event.relatedTarget === host.inputElement);
  }

  /**
   * Handles a keydown event of the host. Returns true when the event was
   * consumed and the host should not handle it any further.
   * @param {KeyboardEvent} event
   * @return {boolean}
   */
  handleKeyDown(event) {
    const host = this.#host;

    if (this.isButtonEvent(event)) {
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
          return false;
        default:
          // Leave other keys to the button, e.g. Enter and Space activating it.
          return true;
      }
    }

    // Move focus to the button instead of leaving the component
    if (event.key === 'Tab' && host._overlayOpened && this.button) {
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
    if (this.isButtonFocused()) {
      this.#host.inputElement.focus();
    }
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

    this.button.focus({ focusVisible: true });
    host.removeAttribute('focus-ring');
  }

  /**
   * Returns the items matching the current filter that are loaded on the client.
   */
  #getLoadedFilteredItems() {
    return (this.#host.filteredItems || []).filter((item) => !(item instanceof ComboBoxPlaceholder));
  }

  /**
   * Returns true when every item matching the current filter is available
   * on the client, so that the state and the selection can be handled
   * by the component itself.
   */
  #areAllFilteredItemsLoaded() {
    const host = this.#host;

    if (!host.dataProvider) {
      return true;
    }

    if (host.size === undefined || host.loading) {
      return false;
    }

    return this.#getLoadedFilteredItems().length === host.size;
  }

  #getState() {
    const host = this.#host;

    if (!this.#areAllFilteredItemsLoaded()) {
      // The state can only be provided by the host, and only makes
      // sense when the host also handles the button clicks.
      return typeof host.selectAllCallback === 'function' ? host.selectAllState || undefined : undefined;
    }

    const items = this.#getLoadedFilteredItems();
    const allSelected =
      items.length > 0 && items.every((item) => host._findIndex(item, host.selectedItems, host.itemIdPath) > -1);
    return allSelected ? 'all' : 'none';
  }

  #setFilteredItemsSelected(selected) {
    const host = this.#host;
    const filteredItems = this.#getLoadedFilteredItems();
    let selectedItems;

    if (selected) {
      const missingItems = filteredItems.filter(
        (item) => host._findIndex(item, host.selectedItems, host.itemIdPath) === -1,
      );
      selectedItems = [...host.selectedItems, ...missingItems];
    } else {
      selectedItems = host.selectedItems.filter((item) => host._findIndex(item, filteredItems, host.itemIdPath) === -1);
    }

    host.__updateSelection(selectedItems);
    this.#announceResult();
  }

  #delegate(selected) {
    const host = this.#host;
    this.#pending = true;

    // Use the promise constructor so that both a synchronous
    // exception and a rejected promise are handled the same way.
    new Promise((resolve) => {
      resolve(host.selectAllCallback({ filter: host.filter, selected }));
    })
      .then(
        () => {
          if (host.isConnected) {
            host._requestValidation();
            this.#announceResult();
          }
        },
        () => {
          // The host did not apply the selection, nothing to announce.
        },
      )
      .finally(() => {
        this.#pending = false;
      });
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
