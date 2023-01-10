/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

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
     * We need to listen to click instead of tap because on mobile safari, the
     * document.activeElement has not been updated (focus has not been shifted)
     * yet at the point when tap event is being executed.
     * @param {!MouseEvent} e
     * @protected
     */
    _onClick(e) {
      if (e.defaultPrevented) {
        // Something has handled this click already, e. g., <vaadin-grid-sorter>
        return;
      }

      const path = e.composedPath();
      const cell = path[path.indexOf(this.$.table) - 3];
      if (!cell || cell.getAttribute('part').indexOf('details-cell') > -1) {
        return;
      }
      const cellContent = cell._content;

      const activeElement = this.getRootNode().activeElement;
      const cellContentHasFocus = cellContent.contains(activeElement);
      if (!cellContentHasFocus && !this._isFocusable(e.target) && !(e.target instanceof HTMLLabelElement)) {
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

/**
 * @param {!Element} target
 * @return {boolean}
 * @protected
 */
export const isFocusable = (target) => {
  if (!target.parentNode) {
    return false;
  }
  const focusables = Array.from(
    target.parentNode.querySelectorAll(
      '[tabindex], button, input, select, textarea, object, iframe, a[href], area[href]',
    ),
  ).filter((element) => {
    const part = element.getAttribute('part');
    return !(part && part.includes('body-cell'));
  });

  const isFocusableElement = focusables.includes(target);
  return (
    !target.disabled && isFocusableElement && target.offsetParent && getComputedStyle(target).visibility !== 'hidden'
  );
};
