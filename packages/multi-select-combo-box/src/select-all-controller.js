/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { announce } from '@vaadin/a11y-base/src/announce.js';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';
import { ComboBoxPlaceholder } from '@vaadin/combo-box/src/vaadin-combo-box-placeholder.js';

/**
 * A controller that manages the select all button of `<vaadin-multi-select-combo-box>`.
 * It shows or hides the button, updates its label, selects or deselects the items
 * matching the current filter when the button is clicked, and keeps focus inside
 * the component while moving between the input and the button.
 *
 * When every item matching the filter is available on the client, the controller
 * computes the state and applies the selection itself. Otherwise, it asks the
 * `selectAllProvider` of the host for the state whenever the filter, the number
 * of matching items or the selection has changed, and delegates clicks to it.
 *
 * The host renders the button and calls `update` after every change to a property
 * the button depends on.
 */
export class SelectAllController {
  /**
   * The state last received from the provider, together with the key of the
   * host state it was requested for. `allSelected` is `undefined` when the
   * provider could not tell, in which case the button is not shown.
   * @type {{ key: object, allSelected: boolean | undefined } | undefined}
   */
  #providedState;

  /**
   * The pending request to the provider, used to ignore its result if a
   * newer request has been made in the meantime.
   * @type {{ key: object } | null}
   */
  #stateRequest = null;

  /** True while waiting for `selectAllProvider.setAllSelected` to settle. */
  #pending = false;

  /**
   * The state the button currently shows: `true` when every item matching the
   * filter is selected, `false` when not, `undefined` when unknown, in which
   * case the button is hidden.
   * @type {boolean | undefined}
   */
  #allSelected;

  /**
   * True when the button accepts clicks, meaning the state it shows is up to
   * date with the host and no selection change is pending.
   */
  #ready = false;

  #host;

  /** @type {HTMLButtonElement} */
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
   * Updates the button to reflect the current state of the host, and asks the
   * provider for the state if needed. To be called by the host whenever a
   * property the button depends on has changed.
   */
  update() {
    if (this.#areAllFilteredItemsLoaded()) {
      this.#render(this.#isEveryLoadedItemSelected(), true);
      return;
    }

    const provider = this.#getProvider();
    if (!provider) {
      this.#render(undefined, false);
      return;
    }

    const key = this.#getRequestKey();
    const current = this.#matchesRequestKey(this.#providedState, key);
    if (!current && this.#canRequestProvidedState(key)) {
      this.#requestProvidedState(key); // Updates again once answered
    }
    // Show the last known state while waiting for the provider, but do not accept clicks.
    this.#render(this.#providedState ? this.#providedState.allSelected : undefined, current);
  }

  /**
   * Returns true when the event originates from the button.
   * @param {Event} event
   * @return {boolean}
   */
  isButtonEvent(event) {
    return event.composedPath().includes(this.#button);
  }

  /**
   * Returns true when the button has focus.
   * @return {boolean}
   */
  isButtonFocused() {
    return this.#button === getDeepActiveElement();
  }

  /**
   * Returns true when the focus event moves focus between the input and the
   * button, in which case the host should keep its focused state.
   * @param {FocusEvent} event
   * @return {boolean}
   */
  isFocusMovingToInputOrButton(event) {
    const host = this.#host;
    if (this.#button.hidden) {
      return false;
    }
    // The button is in the shadow root, so when focus moves from the input to
    // the button, `relatedTarget` is retargeted to the host element itself.
    return event.relatedTarget === host || event.relatedTarget === host.inputElement;
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
    if (this.isButtonFocused()) {
      this.#host.inputElement.focus();
    }
  }

  /**
   * Writes the given state to the button: its visibility, its label, and
   * whether it accepts clicks.
   * @param {boolean | undefined} allSelected see `#allSelected`
   * @param {boolean} current true when `allSelected` is up to date with the host
   */
  #render(allSelected, current) {
    const host = this.#host;
    const button = this.#button;

    this.#allSelected = allSelected;
    this.#ready = current && !host.loading && !this.#pending;

    const visible = host.selectAllButtonVisible && !host.readonly && allSelected !== undefined;

    // Do not drop focus to the body when the button is about to be hidden.
    if (!visible && this.isButtonFocused()) {
      host.inputElement.focus();
    }

    const { selectAll, deselectAll, selectFiltered, deselectFiltered } = host.__effectiveI18n;
    if (host.filter) {
      button.textContent = allSelected ? deselectFiltered : selectFiltered;
    } else {
      button.textContent = allSelected ? deselectAll : selectAll;
    }

    // Clicks are ignored while the button is not ready, so let assistive
    // technology know that it is temporarily not operable, without
    // dropping focus like the disabled attribute would.
    if (this.#ready) {
      button.removeAttribute('aria-disabled');
    } else {
      button.setAttribute('aria-disabled', 'true');
    }

    button.hidden = !visible;
  }

  /**
   * Selects the items matching the current filter, or deselects them when
   * they are all selected already.
   */
  #onClick() {
    if (!this.#ready) {
      return;
    }

    const selected = !this.#allSelected;
    if (this.#areAllFilteredItemsLoaded()) {
      this.#updateSelectionLocally(selected);
    } else {
      this.#updateSelectionViaProvider(selected);
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

    this.#button.focus({ focusVisible: true });
    host.removeAttribute('focus-ring');
  }

  /**
   * Returns the provider of the host if it implements both functions,
   * `null` otherwise.
   */
  #getProvider() {
    const provider = this.#host.selectAllProvider;
    if (provider && typeof provider.isAllSelected === 'function' && typeof provider.setAllSelected === 'function') {
      return provider;
    }
    return null;
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

  /**
   * Returns true when there are loaded items matching the current filter and
   * all of them are selected.
   */
  #isEveryLoadedItemSelected() {
    const host = this.#host;
    const items = this.#getLoadedFilteredItems();
    return items.length > 0 && items.every((item) => host._findIndex(item, host.selectedItems, host.itemIdPath) > -1);
  }

  /**
   * Returns the parts of the host state that the state received from the
   * provider depends on.
   */
  #getRequestKey() {
    const host = this.#host;
    return {
      filter: host.filter,
      size: host.size,
      selectedItems: host.selectedItems,
      provider: this.#getProvider(),
    };
  }

  #matchesRequestKey(stateOrRequest, key) {
    if (!stateOrRequest) {
      return false;
    }
    const other = stateOrRequest.key;
    return (
      other.filter === key.filter &&
      other.size === key.size &&
      other.selectedItems === key.selectedItems &&
      other.provider === key.provider
    );
  }

  /**
   * Returns true when the provider can be asked for the state of the given
   * key: the overlay is open, the items for the current filter are loaded,
   * and the same state has not been requested already.
   */
  #canRequestProvidedState(key) {
    const host = this.#host;
    return host.opened && !host.loading && host.size !== undefined && !this.#matchesRequestKey(this.#stateRequest, key);
  }

  async #requestProvidedState(key) {
    // A newer request replaces a pending one, whose result is then ignored.
    const request = { key };
    this.#stateRequest = request;

    let allSelected;
    try {
      const result = await key.provider.isAllSelected({ filter: key.filter });
      allSelected = result == null ? undefined : !!result;
    } catch {
      // Treated like an unknown state, so the button is not shown.
    }

    if (this.#stateRequest !== request) {
      return;
    }
    this.#stateRequest = null;
    this.#providedState = { key, allSelected };
    this.update();
  }

  /**
   * Adds the items matching the filter to the selection, or removes them from
   * it, directly from the loaded items. Used when every item matching the
   * filter is loaded.
   */
  #updateSelectionLocally(selected) {
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

  /**
   * Asks the provider to add the items matching the filter to the selection,
   * or to remove them from it. Used when not every item matching the filter
   * is loaded, so that only the provider knows all of them.
   */
  async #updateSelectionViaProvider(selected) {
    const host = this.#host;
    const { filter, provider } = this.#getRequestKey();

    this.#pending = true;
    this.update();

    let applied = true;
    try {
      await provider.setAllSelected({ filter, selected });
    } catch {
      // The provider did not apply the selection, nothing to announce.
      applied = false;
    }

    this.#pending = false;
    if (applied && host.isConnected) {
      host._requestValidation();
      this.#announceResult();
    }
    this.update();
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
