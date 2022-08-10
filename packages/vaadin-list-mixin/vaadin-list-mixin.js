/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import { timeOut } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { DirHelper } from '@vaadin/component-base/src/dir-helper.js';
import { isElementFocused } from '@vaadin/component-base/src/focus-utils.js';

/**
 * A mixin for `nav` elements, facilitating navigation and selection of childNodes.
 *
 * @polymerMixin
 */
export const ListMixin = (superClass) =>
  class VaadinListMixin extends superClass {
    static get properties() {
      return {
        /**
         * Used for mixin detection because `instanceof` does not work with mixins.
         * @type {boolean}
         */
        _hasVaadinListMixin: {
          value: true,
        },

        /**
         * The index of the item selected in the items array.
         * Note: Not updated when used in `multiple` selection mode.
         */
        selected: {
          type: Number,
          reflectToAttribute: true,
          notify: true,
        },

        /**
         * Define how items are disposed in the dom.
         * Possible values are: `horizontal|vertical`.
         * It also changes navigation keys from left/right to up/down.
         * @type {!ListOrientation}
         */
        orientation: {
          type: String,
          reflectToAttribute: true,
          value: '',
        },

        /**
         * The list of items from which a selection can be made.
         * It is populated from the elements passed to the light DOM,
         * and updated dynamically when adding or removing items.
         *
         * The item elements must implement `Vaadin.ItemMixin`.
         *
         * Note: unlike `<vaadin-combo-box>`, this property is read-only,
         * so if you want to provide items by iterating array of data,
         * you have to use `dom-repeat` and place it to the light DOM.
         * @type {!Array<!Element> | undefined}
         */
        items: {
          type: Array,
          readOnly: true,
          notify: true,
        },

        /**
         * The search buffer for the keyboard selection feature.
         * @private
         */
        _searchBuf: {
          type: String,
          value: '',
        },
      };
    }

    static get observers() {
      return ['_enhanceItems(items, orientation, selected, disabled)'];
    }

    /** @protected */
    ready() {
      super.ready();
      this.addEventListener('keydown', (e) => this._onKeydown(e));
      this.addEventListener('click', (e) => this._onClick(e));

      this._observer = new FlattenedNodesObserver(this, () => {
        this._setItems(this._filterItems(FlattenedNodesObserver.getFlattenedNodes(this)));
      });
    }

    /** @private */
    _enhanceItems(items, orientation, selected, disabled) {
      if (!disabled) {
        if (items) {
          this.setAttribute('aria-orientation', orientation || 'vertical');
          this.items.forEach((item) => {
            if (orientation) {
              item.setAttribute('orientation', orientation);
            } else {
              item.removeAttribute('orientation');
            }
          });

          this._setFocusable(selected || 0);

          const itemToSelect = items[selected];
          items.forEach((item) => {
            item.selected = item === itemToSelect;
          });
          if (itemToSelect && !itemToSelect.disabled) {
            this._scrollToItem(selected);
          }
        }
      }
    }

    /**
     * @return {Element}
     */
    get focused() {
      return (this.items || []).find(isElementFocused);
    }

    /**
     * @param {!Array<!Element>} array
     * @return {!Array<!Element>}
     * @protected
     */
    _filterItems(array) {
      return array.filter((e) => e._hasVaadinItemMixin);
    }

    /**
     * @param {!MouseEvent} event
     * @protected
     */
    _onClick(event) {
      if (event.metaKey || event.shiftKey || event.ctrlKey || event.defaultPrevented) {
        return;
      }

      const item = this._filterItems(event.composedPath())[0];
      let idx;
      if (item && !item.disabled && (idx = this.items.indexOf(item)) >= 0) {
        this.selected = idx;
      }
    }

    /**
     * @param {number} currentIdx
     * @param {string} key
     * @return {number}
     * @protected
     */
    _searchKey(currentIdx, key) {
      this._searchReset = Debouncer.debounce(this._searchReset, timeOut.after(500), () => {
        this._searchBuf = '';
      });
      this._searchBuf += key.toLowerCase();
      const increment = 1;
      const condition = (item) =>
        !(item.disabled || this._isItemHidden(item)) &&
        item.textContent
          .replace(/[^\p{L}\p{Nd}]/gu, '')
          .toLowerCase()
          .indexOf(this._searchBuf) === 0;

      if (
        !this.items.some(
          (item) =>
            item.textContent
              .replace(/[^\p{L}\p{Nd}]/gu, '')
              .toLowerCase()
              .indexOf(this._searchBuf) === 0,
        )
      ) {
        this._searchBuf = key.toLowerCase();
      }

      const idx = this._searchBuf.length === 1 ? currentIdx + 1 : currentIdx;
      return this._getAvailableIndex(idx, increment, condition);
    }

    /**
     * @return {boolean}
     * @protected
     */
    get _isRTL() {
      return !this._vertical && this.getAttribute('dir') === 'rtl';
    }

    /**
     * @param {!KeyboardEvent} event
     * @protected
     */
    _onKeydown(event) {
      if (event.metaKey || event.ctrlKey) {
        return;
      }

      const key = event.key;

      const currentIdx = this.items.indexOf(this.focused);

      if (/[a-zA-Z0-9]/.test(key) && key.length === 1) {
        const idx = this._searchKey(currentIdx, key);
        if (idx >= 0) {
          this._focus(idx);
        }
        return;
      }

      const condition = (item) => !(item.disabled || this._isItemHidden(item));
      let idx, increment;

      const dirIncrement = this._isRTL ? -1 : 1;

      if ((this._vertical && key === 'ArrowUp') || (!this._vertical && key === 'ArrowLeft')) {
        increment = -dirIncrement;
        idx = currentIdx - dirIncrement;
      } else if ((this._vertical && key === 'ArrowDown') || (!this._vertical && key === 'ArrowRight')) {
        increment = dirIncrement;
        idx = currentIdx + dirIncrement;
      } else if (key === 'Home') {
        increment = 1;
        idx = 0;
      } else if (key === 'End') {
        increment = -1;
        idx = this.items.length - 1;
      }

      idx = this._getAvailableIndex(idx, increment, condition);
      if (idx >= 0) {
        this._focus(idx);
        event.preventDefault();
      }
    }

    /**
     * @param {number} idx
     * @param {number} increment
     * @param {function(!Element):boolean} condition
     * @return {number}
     * @protected
     */
    _getAvailableIndex(idx, increment, condition) {
      const totalItems = this.items.length;
      for (let i = 0; typeof idx === 'number' && i < totalItems; i++, idx += increment || 1) {
        if (idx < 0) {
          idx = totalItems - 1;
        } else if (idx >= totalItems) {
          idx = 0;
        }

        const item = this.items[idx];

        if (condition(item)) {
          return idx;
        }
      }
      return -1;
    }

    /**
     * @param {!Element} item
     * @return {boolean}
     * @protected
     */
    _isItemHidden(item) {
      return getComputedStyle(item).display === 'none';
    }

    /**
     * @param {number} idx
     * @protected
     */
    _setFocusable(idx) {
      idx = this._getAvailableIndex(idx, 1, (item) => !item.disabled);
      const item = this.items[idx];
      this.items.forEach((e) => {
        e.tabIndex = e === item ? 0 : -1;
      });
    }

    /**
     * @param {number} idx
     * @protected
     */
    _focus(idx) {
      const item = this.items[idx];
      this.items.forEach((e) => {
        e.focused = e === item;
      });
      this._setFocusable(idx);
      this._scrollToItem(idx);
      this._focusItem(item);
    }

    /**
     * Always set focus-ring on the item managed by the list-box
     * for backwards compatibility with the old implementation.
     * @param {HTMLElement} item
     * @protected
     */
    _focusItem(item) {
      if (item) {
        item.focus();
        item.setAttribute('focus-ring', '');
      }
    }

    focus() {
      // In initialization (e.g vaadin-select) observer might not been run yet.
      if (this._observer) {
        this._observer.flush();
      }
      const firstItem = this.querySelector('[tabindex="0"]') || (this.items ? this.items[0] : null);
      this._focusItem(firstItem);
    }

    /**
     * @return {!HTMLElement}
     * @protected
     */
    get _scrollerElement() {
      // Returning scroller element of the component
      console.warn(`Please implement the '_scrollerElement' property in <${this.localName}>`);
      return this;
    }

    /**
     * Scroll the container to have the next item by the edge of the viewport.
     * @param {number} idx
     * @protected
     */
    _scrollToItem(idx) {
      const item = this.items[idx];
      if (!item) {
        return;
      }

      const props = this._vertical ? ['top', 'bottom'] : this._isRTL ? ['right', 'left'] : ['left', 'right'];

      const scrollerRect = this._scrollerElement.getBoundingClientRect();
      const nextItemRect = (this.items[idx + 1] || item).getBoundingClientRect();
      const prevItemRect = (this.items[idx - 1] || item).getBoundingClientRect();

      let scrollDistance = 0;
      if (
        (!this._isRTL && nextItemRect[props[1]] >= scrollerRect[props[1]]) ||
        (this._isRTL && nextItemRect[props[1]] <= scrollerRect[props[1]])
      ) {
        scrollDistance = nextItemRect[props[1]] - scrollerRect[props[1]];
      } else if (
        (!this._isRTL && prevItemRect[props[0]] <= scrollerRect[props[0]]) ||
        (this._isRTL && prevItemRect[props[0]] >= scrollerRect[props[0]])
      ) {
        scrollDistance = prevItemRect[props[0]] - scrollerRect[props[0]];
      }

      this._scroll(scrollDistance);
    }

    /**
     * @return {boolean}
     * @protected
     */
    get _vertical() {
      return this.orientation !== 'horizontal';
    }

    /**
     * @param {number} pixels
     * @protected
     */
    _scroll(pixels) {
      if (this._vertical) {
        this._scrollerElement.scrollTop += pixels;
      } else {
        const dir = this.getAttribute('dir') || 'ltr';
        const scrollType = DirHelper.detectScrollType();
        const scrollLeft = DirHelper.getNormalizedScrollLeft(scrollType, dir, this._scrollerElement) + pixels;
        DirHelper.setNormalizedScrollLeft(scrollType, dir, this._scrollerElement, scrollLeft);
      }
    }

    /**
     * Fired when the selection is changed.
     * Not fired when used in `multiple` selection mode.
     *
     * @event selected-changed
     * @param {Object} detail
     * @param {Object} detail.value the index of the item selected in the items array.
     */
  };
