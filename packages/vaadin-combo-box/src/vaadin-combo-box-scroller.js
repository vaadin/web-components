/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { Virtualizer } from '@vaadin/vaadin-virtual-list/src/virtualizer.js';
import { ComboBoxPlaceholder } from './vaadin-combo-box-placeholder.js';

/**
 * Element for internal use only.
 *
 * @extends HTMLElement
 * @private
 */
class ComboBoxScrollerElement extends PolymerElement {
  static get is() {
    return 'vaadin-combo-box-scroller';
  }

  static get template() {
    return html`
      <style>
        :host {
          display: block;
          min-height: 1px;
          overflow: auto;

          /* Fixes item background from getting on top of scrollbars on Safari */
          transform: translate3d(0, 0, 0);

          /* Enable momentum scrolling on iOS */
          -webkit-overflow-scrolling: touch;

          /* Fixes scrollbar disappearing when 'Show scroll bars: Always' enabled in Safari */
          box-shadow: 0 0 0 white;
        }

        #selector {
          border-width: var(--_vaadin-combo-box-items-container-border-width);
          border-style: var(--_vaadin-combo-box-items-container-border-style);
          border-color: var(--_vaadin-combo-box-items-container-border-color);
        }
      </style>
      <div id="selector">
        <slot></slot>
      </div>
    `;
  }

  static get properties() {
    return {
      items: {
        type: Array,
        observer: '__itemsChanged'
      },

      focusedIndex: {
        type: Number,
        observer: '__focusedIndexChanged'
      },

      loading: {
        type: Boolean,
        observer: '__loadingChanged'
      },

      opened: {
        type: Boolean
      },

      selectedItem: {
        type: Object
      },

      itemIdPath: {
        type: String
      },

      renderer: {
        type: Object,
        observer: '__rendererChanged'
      },

      theme: {
        type: String
      }
    };
  }

  constructor() {
    super();
    this.__boundOnItemClick = this.__onItemClick.bind(this);
  }

  /** @protected */
  ready() {
    super.ready();

    this.setAttribute('role', 'listbox');

    this.addEventListener('click', (e) => e.stopPropagation());

    this.__patchWheelOverScrolling();

    this.__virtualizer = new Virtualizer({
      createElements: this.__createElements.bind(this),
      updateElement: this.__updateElement.bind(this),
      elementsContainer: this,
      scrollTarget: this,
      scrollContainer: this.$.selector
    });
  }

  scrollIntoView(index) {
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
    const lastPhysicalItem = [...this.children].find(
      (el) => !el.hidden && el.index === this.__virtualizer.lastVisibleIndex
    );
    if (!lastPhysicalItem || index !== lastPhysicalItem.index) {
      return;
    }
    const lastPhysicalItemRect = lastPhysicalItem.getBoundingClientRect();
    const scrollerRect = this.getBoundingClientRect();
    const scrollTopAdjust = lastPhysicalItemRect.bottom - scrollerRect.bottom + this._viewportTotalPaddingBottom;
    if (scrollTopAdjust > 0) {
      this.scrollTop += scrollTopAdjust;
    }
  }

  /** @private */
  __getAriaRole(itemIndex) {
    return itemIndex !== undefined ? 'option' : false;
  }

  /** @private */
  __getAriaSelected(focusedIndex, itemIndex) {
    return this.__isItemFocused(focusedIndex, itemIndex).toString();
  }

  /** @private */
  __isItemFocused(focusedIndex, itemIndex) {
    return focusedIndex == itemIndex;
  }

  /** @private */
  __isItemSelected(item, selectedItem, itemIdPath) {
    if (item instanceof ComboBoxPlaceholder) {
      return false;
    } else if (itemIdPath && item !== undefined && selectedItem !== undefined) {
      return this.get(itemIdPath, item) === this.get(itemIdPath, selectedItem);
    } else {
      return item === selectedItem;
    }
  }

  /** @private */
  __itemsChanged(items) {
    if (this.__virtualizer && items) {
      this.__virtualizer.size = items.length;
      this.__virtualizer.flush();
    }
  }

  /** @private */
  __loadingChanged(loading) {
    if (this.__virtualizer && !loading) {
      setTimeout(() => this.__virtualizer.update());
    }
  }

  /** @private */
  __focusedIndexChanged(index) {
    if (this.__virtualizer && index >= 0) {
      this.scrollIntoView(index);
    }
  }

  /** @private */
  __rendererChanged(renderer, oldRenderer) {
    if (this.__virtualizer && (renderer || oldRenderer)) {
      this.__virtualizer.update();
    }
  }

  /** @private */
  __createElements(count) {
    return [...Array(count)].map(() => {
      const item = document.createElement('vaadin-combo-box-item');
      item.addEventListener('click', this.__boundOnItemClick);
      item.tabIndex = '-1';
      item.style.width = '100%';
      return item;
    });
  }

  /** @private */
  __updateElement(el, index) {
    const wrapper = this.wrapper;

    const item = this.items[index];

    const focusedIndex = this.focusedIndex;

    el.setProperties({
      item,
      index: this.__requestItemByIndex(item, index),
      label: wrapper.getItemLabel(item),
      selected: this.__isItemSelected(item, this.selectedItem, this.itemIdPath),
      renderer: this.renderer,
      focused: this.__isItemFocused(focusedIndex, index)
    });

    el.setAttribute('role', this.__getAriaRole(index));
    el.setAttribute('aria-selected', this.__getAriaSelected(focusedIndex, index));
    el.setAttribute('theme', this.theme);
  }

  /** @private */
  __onItemClick(e) {
    this.dispatchEvent(new CustomEvent('selection-changed', { detail: { item: e.currentTarget.item } }));
  }

  /**
   * We want to prevent the kinetic scrolling energy from being transferred from the overlay contents over to the parent.
   * Further improvement ideas: after the contents have been scrolled to the top or bottom and scrolling has stopped, it could allow
   * scrolling the parent similarly to touch scrolling.
   */
  __patchWheelOverScrolling() {
    this.$.selector.addEventListener('wheel', (e) => {
      const scrolledToTop = this.scrollTop === 0;
      const scrolledToBottom = this.scrollHeight - this.scrollTop - this.clientHeight <= 1;
      if (scrolledToTop && e.deltaY < 0) {
        e.preventDefault();
      } else if (scrolledToBottom && e.deltaY > 0) {
        e.preventDefault();
      }
    });
  }

  get _viewportTotalPaddingBottom() {
    if (this._cachedViewportTotalPaddingBottom === undefined) {
      const itemsStyle = window.getComputedStyle(this.$.selector);
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

  /**
   * If dataProvider is used, dispatch a request for the item’s index if
   * the item is a placeholder object.
   *
   * @return {number}
   */
  __requestItemByIndex(item, index) {
    if (item instanceof ComboBoxPlaceholder && index !== undefined) {
      this.dispatchEvent(
        new CustomEvent('index-requested', { detail: { index, currentScrollerPos: this._oldScrollerPosition } })
      );
    }

    return index;
  }

  /** @private */
  _visibleItemsCount() {
    // Ensure items are positioned
    this.__virtualizer.scrollToIndex(this.__virtualizer.firstVisibleIndex);
    const hasItems = this.__virtualizer.size > 0;
    return hasItems ? this.__virtualizer.lastVisibleIndex - this.__virtualizer.firstVisibleIndex + 1 : 0;
  }
}

customElements.define(ComboBoxScrollerElement.is, ComboBoxScrollerElement);
