/**
 * @license
 * Copyright (c) 2015 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
/**
 * Tracks which element of a combo box has the keyboard highlight while the
 * DOM focus stays in the input, and moves the highlight between the dropdown
 * items. Only one element is highlighted at a time.
 *
 * The state is one of:
 *
 * - `{ type: 'none' }`: nothing is highlighted.
 * - `{ type: 'item', index }`: the dropdown item at `index`.
 *
 * Subclasses can add more types.
 */
export class ComboBoxFocusModel {
  /**
   * @param {Object} config
   * @param {() => Array | undefined} config.getItems returns the dropdown items
   * @param {() => void} config.onChange called after the state changed
   */
  constructor(config) {
    this._config = config;
    this._state = { type: 'none' };
  }

  get hasFocusedItem() {
    return this._state.type === 'item';
  }

  get focusedItemIndex() {
    return this.hasFocusedItem ? this._state.index : -1;
  }

  get focusedItem() {
    return this.hasFocusedItem ? this._config.getItems()?.[this._state.index] : undefined;
  }

  focusNextItem() {
    const items = this._config.getItems();
    if (items) {
      this.focusItemAt(Math.min(items.length - 1, this.focusedItemIndex + 1));
    }
  }

  focusPrevItem() {
    const items = this._config.getItems();
    if (items) {
      this.focusItemAt(this.hasFocusedItem ? Math.max(0, this._state.index - 1) : items.length - 1);
    }
  }

  focusItem(item) {
    const items = this._config.getItems();
    this.focusItemAt(items ? items.indexOf(item) : -1);
  }

  focusItemAt(index) {
    if (index > -1) {
      this._setState({ type: 'item', index });
    } else {
      this.clearItemFocus();
    }
  }

  clearItemFocus() {
    if (this.hasFocusedItem) {
      this.clear();
    }
  }

  clear() {
    this._setState({ type: 'none' });
  }

  /** @protected */
  _setState(state) {
    const oldState = this._state;
    if (state.type !== oldState.type || state.index !== oldState.index) {
      this._state = state;
      this._config.onChange();
    }
  }
}
