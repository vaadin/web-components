/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ComboBoxFocusModel } from '@vaadin/combo-box/src/vaadin-combo-box-focus-model.js';

/**
 * Extends the combo box focus model with the chips of the multi-select
 * combo box, adding the state `{ type: 'chip', index }`: the chip at `index`.
 * The config requires `getChips`, which returns the chips.
 */
export class MultiSelectComboBoxFocusModel extends ComboBoxFocusModel {
  get hasFocusedChip() {
    return this._state.type === 'chip';
  }

  get focusedChip() {
    return this.hasFocusedChip ? this._config.getChips()[this._state.index] : undefined;
  }

  focusPrevChip() {
    if (this.hasFocusedChip) {
      this.focusChipAt(Math.max(0, this._state.index - 1));
    } else {
      this.focusLastChip();
    }
  }

  focusNextChip() {
    if (this.hasFocusedChip) {
      const lastIndex = this._config.getChips().length - 1;
      this.focusChipAt(this._state.index < lastIndex ? this._state.index + 1 : -1);
    }
  }

  focusLastChip() {
    this.focusChipAt(this._config.getChips().length - 1);
  }

  focusChipAt(index) {
    if (index > -1) {
      this._setState({ type: 'chip', index });
    } else {
      this.clearChipFocus();
    }
  }

  clearChipFocus() {
    if (this.hasFocusedChip) {
      this.clear();
    }
  }
}
