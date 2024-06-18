/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

import { isElementFocusable } from '@vaadin/a11y-base/src/focus-utils.js';

/**
 * @param {!Element} target
 * @return {boolean}
 * @protected
 */
export const isFocusable = (target) => {
  return (
    target.offsetParent &&
    !target.part.contains('body-cell') &&
    isElementFocusable(target) &&
    getComputedStyle(target).visibility !== 'hidden'
  );
};

/**
 * @polymerMixin
 */
export const ActiveItemMixin = (superClass) =>
  class ActiveItemMixin extends superClass {
    static get properties() {
      return {
        /**
         * The item user has last interacted with. Turns to `null` after user deactivates
         * the item by re-interacting with the currently active item.
         * @type {GridItem}
         */
        activeItem: {
          type: Object,
          notify: true,
          value: null,
          sync: true,
        },
      };
    }

    /** @protected */
    ready() {
      super.ready();

      this.$.scroller.addEventListener('click', this._onClick.bind(this));
      this.addEventListener('cell-activate', this._activateItem.bind(this));
      this.addEventListener('row-activate', this._activateItem.bind(this));
    }

    /** @private */
    _activateItem(e) {
      const model = e.detail.model;
      const clickedItem = model ? model.item : null;

      if (clickedItem) {
        this.activeItem = !this._itemsEqual(this.activeItem, clickedItem) ? clickedItem : null;
      }
    }

    /**
     * Checks whether the click event should not activate the cell on which it occurred.
     *
     * @protected
     */
    _shouldPreventCellActivationOnClick(e) {
      const { cell } = this._getGridEventLocation(e);
      return (
        // Something has handled this click already, e. g., <vaadin-grid-sorter>
        e.defaultPrevented ||
        // No clicked cell available
        !cell ||
        // Cell is a details cell
        cell.getAttribute('part').includes('details-cell') ||
        // Cell is the empty state cell
        cell === this.$.emptystatecell ||
        // Cell content is focused
        cell._content.contains(this.getRootNode().activeElement) ||
        // Clicked on a focusable element
        this._isFocusable(e.target) ||
        // Clicked on a label element
        e.target instanceof HTMLLabelElement
      );
    }

    /**
     * @param {!MouseEvent} e
     * @protected
     */
    _onClick(e) {
      if (this._shouldPreventCellActivationOnClick(e)) {
        return;
      }

      const { cell } = this._getGridEventLocation(e);
      if (cell) {
        this.dispatchEvent(
          new CustomEvent('cell-activate', {
            detail: {
              model: this.__getRowModel(cell.parentElement),
            },
          }),
        );
      }
    }

    /**
     * @param {!Element} target
     * @return {boolean}
     * @protected
     */
    _isFocusable(target) {
      return isFocusable(target);
    }

    /**
     * Fired when the `activeItem` property changes.
     *
     * @event active-item-changed
     */

    /**
     * Fired when the cell is activated with click or keyboard.
     *
     * @event cell-activate
     */
  };
