/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './vaadin-combo-box-item.js';
import './vaadin-combo-box-dropdown.js';
import { Virtualizer } from '@vaadin/vaadin-virtual-list/src/virtualizer.js';
import { ComboBoxPlaceholder } from './vaadin-combo-box-placeholder.js';

const TOUCH_DEVICE = (() => {
  try {
    document.createEvent('TouchEvent');
    return true;
  } catch (e) {
    return false;
  }
})();

/**
 * Element for internal use only.
 *
 * @extends HTMLElement
 * @private
 */
class ComboBoxDropdownWrapperElement extends PolymerElement {
  static get template() {
    return html`
      <vaadin-combo-box-dropdown
        id="dropdown"
        hidden="[[_hidden(_items.*, loading)]]"
        position-target="[[positionTarget]]"
        on-position-changed="_setOverlayHeight"
        disable-upgrade=""
        theme="[[theme]]"
      >
        <template>
          <style>
            #scroller {
              overflow: auto;

              /* Fixes item background from getting on top of scrollbars on Safari */
              transform: translate3d(0, 0, 0);

              /* Enable momentum scrolling on iOS (iron-list v1.2+ no longer does it for us) */
              -webkit-overflow-scrolling: touch;

              /* Fixes scrollbar disappearing when 'Show scroll bars: Always' enabled in Safari */
              box-shadow: 0 0 0 white;
            }
          </style>

          <div id="scroller" on-click="_stopPropagation" style="min-height: 1px">
            <div id="selector" role="listbox"></div>
          </div>
        </template>
      </vaadin-combo-box-dropdown>
    `;
  }

  static get is() {
    return 'vaadin-combo-box-dropdown-wrapper';
  }

  static get properties() {
    return {
      /**
       * True if the device supports touch events.
       */
      touchDevice: {
        type: Boolean,
        value: TOUCH_DEVICE
      },

      opened: Boolean,

      /**
       * The element to position/align the dropdown by.
       */
      positionTarget: {
        type: Object
      },

      /**
       * Custom function for rendering the content of the `<vaadin-combo-box-item>` propagated from the combo box element.
       */
      renderer: Function,

      /**
       * `true` when new items are being loaded.
       */
      loading: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        observer: '_setOverlayHeight'
      },

      /**
       * Used to propagate the `theme` attribute from the host element.
       */
      theme: String,

      /**
       * Used to recognize if the filter changed, so to skip the
       * scrolling restore. If true, then scroll to 0 position. Restore
       * the previous position otherwise.
       */
      filterChanged: {
        type: Boolean,
        value: false
      },

      /**
       * Used to recognize scroller reset after new items have been set
       * to iron-list and to ignore unwanted pages load. If 'true', then
       * skip loading of the pages until it becomes 'false'.
       */
      _resetScrolling: {
        type: Boolean,
        value: false
      },

      _selectedItem: {
        type: Object
      },

      _items: {
        type: Object
      },

      _focusedIndex: {
        type: Number,
        value: -1,
        observer: '_focusedIndexChanged'
      },

      _focusedItem: {
        type: String,
        computed: '_getFocusedItem(_focusedIndex)'
      },

      _itemLabelPath: {
        type: String,
        value: 'label'
      },

      _itemValuePath: {
        type: String,
        value: 'value'
      },

      _selector: Object,

      _itemIdPath: String,

      /**
       * Stores the scroller position before updating the 'items', in
       * order to restore it immediately after 'items' have been updated
       */
      _oldScrollerPosition: {
        type: Number,
        value: 0
      },

      __effectiveItems: {
        computed: '_getItems(opened, _items)',
        observer: '__effectiveItemsChanged'
      }
    };
  }

  static get observers() {
    return ['_loadingChanged(loading)', '_openedChanged(opened, _items, loading)', '_restoreScrollerPosition(_items)'];
  }

  __effectiveItemsChanged(effectiveItems) {
    if (this.__virtualizer && effectiveItems) {
      requestAnimationFrame(() => {
        this.__virtualizer.size = effectiveItems.length;
      });
    }
  }

  __createElements(count) {
    return [...Array(count)].map(() => {
      const item = document.createElement('vaadin-combo-box-item');
      item.addEventListener('click', this._onItemClick.bind(this));
      item.tabIndex = '-1';
      item.style.width = '100%';
      return item;
    });
  }

  __updateElement(el, index) {
    const item = this.__effectiveItems[index];

    el.setProperties({
      item: this.__effectiveItems[index],
      index: this.__requestItemByIndex(item, index, this._resetScrolling), // Should rerender on _resetScrolling change
      label: this.getItemLabel(item, this._itemLabelPath),
      selected: this._isItemSelected(item, this._selectedItem, this._itemIdPath), // These should also invoke rerender
      renderer: this.renderer,
      focused: this._isItemFocused(this._focusedIndex, index)
    });

    el.setAttribute('role', this._getAriaRole(index));
    el.setAttribute('aria-selected', this._getAriaSelected(this._focusedIndex, index));
    el.setAttribute('theme', this.theme);
  }

  _fireTouchAction(sourceEvent) {
    this.dispatchEvent(
      new CustomEvent('vaadin-overlay-touch-action', {
        detail: { sourceEvent: sourceEvent }
      })
    );
  }

  _getItems(opened, items) {
    if (opened) {
      if (this._isNotEmpty(items) && this._selector && !this.filterChanged) {
        // iron-list triggers the scroller's reset after items update, and
        // this is not appropriate for undefined size lazy loading.
        // see https://github.com/vaadin/vaadin-combo-box-flow/issues/386
        // We store iron-list scrolling position in order to restore
        // it later on after the items have been updated.
        const currentScrollerPosition = this._selector.firstVisibleIndex;
        if (currentScrollerPosition !== 0) {
          this._oldScrollerPosition = currentScrollerPosition;
          this._resetScrolling = true;
        }
      }
      // Let the position to be restored in the future calls unless it's not
      // caused by filtering
      this.filterChanged = false;
      return items;
    }
    return [];
  }

  _restoreScrollerPosition(items) {
    if (this._isNotEmpty(items) && this._selector && this._oldScrollerPosition !== 0) {
      // new items size might be less than old scrolling position
      this._scrollIntoView(Math.min(items.length - 1, this._oldScrollerPosition));
      this._resetScrolling = false;
      // reset position to 0 again in order to properly handle the filter
      // cases (scroll to 0 after typing the filter)
      this._oldScrollerPosition = 0;
    }
  }

  _isNotEmpty(items) {
    return !this._isEmpty(items);
  }

  _isEmpty(items) {
    return !items || !items.length;
  }

  _openedChanged(opened, items, loading) {
    if (this.$.dropdown.hasAttribute('disable-upgrade')) {
      if (!opened) {
        return;
      } else {
        this._initDropdown();
      }
    }

    if (this._isEmpty(items)) {
      this.$.dropdown.__emptyItems = true;
    }
    this.$.dropdown.opened = !!(opened && (loading || this._isNotEmpty(items)));
    this.$.dropdown.__emptyItems = false;
  }

  _initDropdown() {
    this.$.dropdown.removeAttribute('disable-upgrade');

    this._selector = this.$.dropdown.$.overlay.content.querySelector('#selector');
    this._scroller = this.$.dropdown.$.overlay.content.querySelector('#scroller');

    this._patchWheelOverScrolling();

    this._loadingChanged(this.loading);

    this.$.dropdown.$.overlay.addEventListener('touchend', (e) => this._fireTouchAction(e));
    this.$.dropdown.$.overlay.addEventListener('touchmove', (e) => this._fireTouchAction(e));

    // Prevent blurring the input when clicking inside the overlay.
    this.$.dropdown.$.overlay.addEventListener('mousedown', (e) => e.preventDefault());

    this.__virtualizer = new Virtualizer({
      createElements: this.__createElements.bind(this),
      updateElement: this.__updateElement.bind(this),
      scrollTarget: this._scroller,
      scrollContainer: this._selector
    });
  }

  _loadingChanged(loading) {
    if (this.$.dropdown.hasAttribute('disable-upgrade')) {
      return;
    }

    if (loading) {
      this.$.dropdown.$.overlay.setAttribute('loading', '');
    } else {
      this.$.dropdown.$.overlay.removeAttribute('loading');
    }
  }

  _setOverlayHeight() {
    if (!this.opened || !this.positionTarget) {
      return;
    }

    const targetRect = this.positionTarget.getBoundingClientRect();

    this._scroller.style.maxHeight =
      getComputedStyle(this).getPropertyValue('--vaadin-combo-box-overlay-max-height') || '65vh';

    const maxHeight = this._maxOverlayHeight(targetRect);

    // overlay max height is restrained by the #scroller max height which is set to 65vh in CSS.
    this.$.dropdown.$.overlay.style.maxHeight = maxHeight;

    // we need to set height for iron-list to make its `firstVisibleIndex` work correctly.
    this._selector.style.maxHeight = maxHeight;

    // this.updateViewportBoundaries();
  }

  _maxOverlayHeight(targetRect) {
    const margin = 8;
    const minHeight = 116; // Height of two items in combo-box
    if (this.$.dropdown.alignedAbove) {
      return Math.max(targetRect.top - margin + Math.min(document.body.scrollTop, 0), minHeight) + 'px';
    } else {
      return Math.max(document.documentElement.clientHeight - targetRect.bottom - margin, minHeight) + 'px';
    }
  }

  _getFocusedItem(focusedIndex) {
    if (focusedIndex >= 0) {
      return this._items[focusedIndex];
    }
  }

  _isItemSelected(item, selectedItem, itemIdPath) {
    if (item instanceof ComboBoxPlaceholder) {
      return false;
    } else if (itemIdPath && item !== undefined && selectedItem !== undefined) {
      return this.get(itemIdPath, item) === this.get(itemIdPath, selectedItem);
    } else {
      return item === selectedItem;
    }
  }

  _onItemClick(e) {
    this.dispatchEvent(new CustomEvent('selection-changed', { detail: { item: e.currentTarget.item } }));
  }

  /**
   * Gets the index of the item with the provided label.
   * @return {number}
   */
  indexOfLabel(label) {
    if (this._items && label) {
      for (let i = 0; i < this._items.length; i++) {
        if (this.getItemLabel(this._items[i]).toString().toLowerCase() === label.toString().toLowerCase()) {
          return i;
        }
      }
    }

    return -1;
  }

  /**
   * If dataProvider is used, dispatch a request for the item’s index if
   * the item is a placeholder object.
   *
   * @return {number}
   */
  __requestItemByIndex(item, index, resetScrolling) {
    if (item instanceof ComboBoxPlaceholder && index !== undefined && !resetScrolling) {
      this.dispatchEvent(
        new CustomEvent('index-requested', { detail: { index, currentScrollerPos: this._oldScrollerPosition } })
      );
    }

    return index;
  }

  /**
   * Gets the label string for the item based on the `_itemLabelPath`.
   * @return {string}
   */
  getItemLabel(item, itemLabelPath) {
    itemLabelPath = itemLabelPath || this._itemLabelPath;
    let label = item && itemLabelPath ? this.get(itemLabelPath, item) : undefined;
    if (label === undefined || label === null) {
      label = item ? item.toString() : '';
    }
    return label;
  }

  _isItemFocused(focusedIndex, itemIndex) {
    return focusedIndex == itemIndex;
  }

  _getAriaSelected(focusedIndex, itemIndex) {
    return this._isItemFocused(focusedIndex, itemIndex).toString();
  }

  _getAriaRole(itemIndex) {
    return itemIndex !== undefined ? 'option' : false;
  }

  _focusedIndexChanged(index) {
    if (index >= 0) {
      this._scrollIntoView(index);
    }
  }

  _scrollIntoView(index) {
    if (!(this.opened && index >= 0)) {
      return;
    }
    const visibleItemsCount = this._visibleItemsCount();

    let targetIndex = index;

    if (index > this.__virtualizer.lastVisibleIndex - 1) {
      // Index is below the bottom, scrolling down. Make the item appear at the bottom.
      // First scroll to target (will be at the top of the scroller) to make sure it's rendered.
      this.__virtualizer.scrollToIndex(index);
      // Then calculate the index for the following scroll (to get the target to bottom of the scroller).
      targetIndex = index - visibleItemsCount + 1;
    } else if (index > this.__virtualizer.firstVisibleIndex) {
      // The item is already visible, scrolling is unnecessary per se. But we need to trigger iron-list to set
      // the correct scrollTop on the scrollTarget. Scrolling to firstVisibleIndex.
      targetIndex = this.__virtualizer.firstVisibleIndex;
    }
    this.__virtualizer.scrollToIndex(Math.max(0, targetIndex));

    // Sometimes the item is partly below the bottom edge, detect and adjust.
    // const pidx = this._selector._getPhysicalIndex(index),
    //   physicalItem = this._selector._physicalItems[pidx];
    // if (!physicalItem) {
    //   return;
    // }
    // const physicalItemRect = physicalItem.getBoundingClientRect(),
    //   scrollerRect = this._scroller.getBoundingClientRect(),
    //   scrollTopAdjust = physicalItemRect.bottom - scrollerRect.bottom + this._viewportTotalPaddingBottom;
    // if (scrollTopAdjust > 0) {
    //   this._scroller.scrollTop += scrollTopAdjust;
    // }
  }

  ensureItemsRendered() {
    this.__virtualizer.update();
  }

  adjustScrollPosition() {
    if (this.opened && this._items) {
      this._scrollIntoView(this._focusedIndex);
    }
  }

  /**
   * We want to prevent the kinetic scrolling energy from being transferred from the overlay contents over to the parent.
   * Further improvement ideas: after the contents have been scrolled to the top or bottom and scrolling has stopped, it could allow
   * scrolling the parent similarly to touch scrolling.
   */
  _patchWheelOverScrolling() {
    // const selector = this._selector;
    // selector.addEventListener('wheel', (e) => {
    //   const scroller = selector._scroller || selector.scrollTarget;
    //   const scrolledToTop = scroller.scrollTop === 0;
    //   const scrolledToBottom = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight <= 1;

    //   if (scrolledToTop && e.deltaY < 0) {
    //     e.preventDefault();
    //   } else if (scrolledToBottom && e.deltaY > 0) {
    //     e.preventDefault();
    //   }
    // });
  }

  // updateViewportBoundaries() {
  //   this._cachedViewportTotalPaddingBottom = undefined;
  //   this._selector.updateViewportBoundaries();
  // }

  get _viewportTotalPaddingBottom() {
    if (this._cachedViewportTotalPaddingBottom === undefined) {
      const itemsStyle = window.getComputedStyle(this._selector.$.items);
      this._cachedViewportTotalPaddingBottom = [itemsStyle.paddingBottom, itemsStyle.borderBottomWidth]
        .map((v) => {
          return parseInt(v, 10);
        })
        .reduce((sum, v) => {
          return sum + v;
        });
    }

    return this._cachedViewportTotalPaddingBottom;
  }

  _visibleItemsCount() {
    // Ensure items are positioned
    this.__virtualizer.scrollToIndex(this.__virtualizer.firstVisibleIndex);
    // Ensure viewport boundaries are up-to-date
    // this.updateViewportBoundaries();
    return this.__virtualizer.lastVisibleIndex - this.__virtualizer.firstVisibleIndex + 1;
  }

  _stopPropagation(e) {
    e.stopPropagation();
  }

  _hidden() {
    return !this.loading && this._isEmpty(this._items);
  }
}

customElements.define(ComboBoxDropdownWrapperElement.is, ComboBoxDropdownWrapperElement);
