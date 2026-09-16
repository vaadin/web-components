/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ComboBoxHighlightMixin } from '@vaadin/combo-box/src/vaadin-combo-box-highlight-mixin.js';

/**
 * A mixin that extends `ComboBoxHighlightMixin` with a highlight state for the
 * chips of the selected items, so that chips can be navigated with arrow keys
 * while the DOM focus stays in the input.
 *
 * In addition to the states of `ComboBoxHighlightMixin`, the state can be:
 *
 * - `{ type: 'chip', index }`: the chip at `index`.
 *
 * Expects the host to provide a `_chips` getter that returns the chip elements.
 *
 * @polymerMixin
 * @mixes ComboBoxHighlightMixin
 */
export const MultiSelectComboBoxHighlightMixin = (superClass) =>
  class MultiSelectComboBoxHighlightMixinClass extends ComboBoxHighlightMixin(superClass) {
    /** @protected */
    get _hasHighlightedChip() {
      return this._highlightState.type === 'chip';
    }

    /** @protected */
    get _highlightedChip() {
      return this._hasHighlightedChip ? this._chips[this._highlightState.index] : undefined;
    }

    /** @protected */
    _highlightPrevChip() {
      if (this._hasHighlightedChip) {
        this._highlightChipAt(Math.max(0, this._highlightState.index - 1));
      } else {
        this._highlightLastChip();
      }
    }

    /** @protected */
    _highlightNextChip() {
      if (this._hasHighlightedChip) {
        const lastIndex = this._chips.length - 1;
        this._highlightChipAt(this._highlightState.index < lastIndex ? this._highlightState.index + 1 : -1);
      }
    }

    /** @protected */
    _highlightLastChip() {
      this._highlightChipAt(this._chips.length - 1);
    }

    /** @protected */
    _highlightChipAt(index) {
      if (index > -1) {
        this._setHighlightState({ type: 'chip', index });
      } else {
        this._clearChipHighlight();
      }
    }

    /** @protected */
    _clearChipHighlight() {
      if (this._hasHighlightedChip) {
        this._clearHighlight();
      }
    }
  };
