/**
 * @license
 * Copyright (c) 2015 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { dedupeMixin } from '@open-wc/dedupe-mixin';

/**
 * A mixin that tracks which element of a combo box has the keyboard highlight
 * while the DOM focus stays in the input. Only one element is highlighted at
 * a time.
 *
 * The state is one of:
 *
 * - `{ type: 'none' }`: nothing is highlighted.
 * - `{ type: 'item', index }`: the dropdown item at `index`.
 *
 * Mixins applied on top can add more types by calling `_setHighlightState()`.
 *
 * @polymerMixin
 */
const ComboBoxHighlightMixinImplementation = (superClass) =>
  class ComboBoxHighlightMixinClass extends superClass {
    static get properties() {
      return {
        /**
         * The element that currently has the keyboard highlight.
         * @protected
         */
        _highlightState: {
          type: Object,
          value: () => ({ type: 'none' }),
          sync: true,
        },
      };
    }

    /** @protected */
    get _hasHighlightedItem() {
      return this._highlightState.type === 'item';
    }

    /** @protected */
    get _highlightedItemIndex() {
      return this._hasHighlightedItem ? this._highlightState.index : -1;
    }

    /** @protected */
    get _highlightedItem() {
      return this._hasHighlightedItem ? this._dropdownItems?.[this._highlightState.index] : undefined;
    }

    /** @protected */
    _highlightNextItem() {
      const items = this._dropdownItems;
      if (items) {
        this._highlightItemAt(Math.min(items.length - 1, this._highlightedItemIndex + 1));
      }
    }

    /** @protected */
    _highlightPrevItem() {
      const items = this._dropdownItems;
      if (items) {
        this._highlightItemAt(
          this._hasHighlightedItem ? Math.max(0, this._highlightState.index - 1) : items.length - 1,
        );
      }
    }

    /** @protected */
    _highlightItem(item) {
      const items = this._dropdownItems;
      this._highlightItemAt(items ? items.indexOf(item) : -1);
    }

    /** @protected */
    _highlightItemAt(index) {
      if (index > -1) {
        this._setHighlightState({ type: 'item', index });
      } else {
        this._clearItemHighlight();
      }
    }

    /**
     * @protected
     */
    _clearItemHighlight() {
      if (this._hasHighlightedItem) {
        this._clearHighlight();
      }
    }

    /** @protected */
    _clearHighlight() {
      this._setHighlightState({ type: 'none' });
    }

    /**
     * @protected
     */
    _setHighlightState(state) {
      const oldState = this._highlightState;
      if (state.type !== oldState.type || state.index !== oldState.index) {
        this._highlightState = state;
      }
    }
  };

export const ComboBoxHighlightMixin = dedupeMixin(ComboBoxHighlightMixinImplementation);
