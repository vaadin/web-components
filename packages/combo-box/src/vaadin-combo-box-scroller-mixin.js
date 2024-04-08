/**
 * @license
 * Copyright (c) 2015 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { get } from '@vaadin/component-base/src/path-utils.js';
import { generateUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';
import { Virtualizer } from '@vaadin/component-base/src/virtualizer.js';
import { ComboBoxPlaceholder } from './vaadin-combo-box-placeholder.js';

/**
 * @polymerMixin
 */
export const ComboBoxScrollerMixin = (superClass) =>
  class ComboBoxScrollerMixin extends superClass {
    static get properties() {
      return {
        /**
         * A full set of items to filter the visible options from.
         * Set to an empty array when combo-box is not opened.
         */
        items: {
          type: Array,
          sync: true,
          observer: '__itemsChanged',
        },

        /**
         * Index of an item that has focus outline and is scrolled into view.
         * The actual focus still remains in the input field.
         */
        focusedIndex: {
          type: Number,
          sync: true,
          observer: '__focusedIndexChanged',
        },

        /**
         * Set to true while combo-box fetches new page from the data provider.
         */
        loading: {
          type: Boolean,
          sync: true,
          observer: '__loadingChanged',
        },

        /**
         * Whether the combo-box is currently opened or not. If set to false,
         * calling `scrollIntoView` does not have any effect.
         */
        opened: {
          type: Boolean,
          sync: true,
          observer: '__openedChanged',
        },

        /**
         * The selected item from the `items` array.
         */
        selectedItem: {
          type: Object,
          sync: true,
          observer: '__selectedItemChanged',
        },

        /**
         * A function used to generate CSS class names for dropdown
         * items based on the item. The return value should be the
         * generated class name as a string, or multiple class names
         * separated by whitespace characters.
         */
        itemClassNameGenerator: {
          type: Object,
          observer: '__itemClassNameGeneratorChanged',
        },

        /**
         * Path for the id of the item, used to detect whether the item is selected.
         */
        itemIdPath: {
          type: String,
        },

        /**
         * Reference to the owner (combo-box owner), used by the item elements.
         */
        owner: {
          type: Object,
        },

        /**
         * Function used to set a label for every combo-box item.
         */
        getItemLabel: {
          type: Object,
        },

        /**
         * Function used to render the content of every combo-box item.
         */
        renderer: {
          type: Object,
          sync: true,
          observer: '__rendererChanged',
        },

        /**
         * Used to propagate the `theme` attribute from the host element.
         */
        theme: {
          type: String,
        },
      };
    }

    constructor() {
      super();
      this.__boundOnItemClick = this.__onItemClick.bind(this);
    }

    /** @private */
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

    /** @protected */
    ready() {
      super.ready();

      this.setAttribute('role', 'listbox');

      // Ensure every instance has unique ID
      this.id = `${this.localName}-${generateUniqueId()}`;

      // Allow extensions to customize tag name for the items
      this.__hostTagName = this.constructor.is.replace('-scroller', '');

      this.addEventListener('click', (e) => e.stopPropagation());

      this.__patchWheelOverScrolling();
    }

    /**
     * Updates the virtualizer's size and items.
     */
    requestContentUpdate() {
      if (!this.__virtualizer) {
        return;
      }

      if (this.items) {
        this.__virtualizer.size = this.items.length;
      }

      if (this.opened) {
        this.__virtualizer.update();
      }
    }

    /**
     * Scrolls an item at given index into view and adjusts `scrollTop`
     * so that the element gets fully visible on Arrow Down key press.
     * @param {number} index
     */
    scrollIntoView(index) {
      if (!this.__virtualizer || !(this.opened && index >= 0)) {
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
        (el) => !el.hidden && el.index === this.__virtualizer.lastVisibleIndex,
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

    /**
     * @param {string | object} item
     * @param {string | object} selectedItem
     * @param {string} itemIdPath
     * @protected
     */
    _isItemSelected(item, selectedItem, itemIdPath) {
      if (item instanceof ComboBoxPlaceholder) {
        return false;
      } else if (itemIdPath && item !== undefined && selectedItem !== undefined) {
        return get(itemIdPath, item) === get(itemIdPath, selectedItem);
      }
      return item === selectedItem;
    }

    /** @private */
    __initVirtualizer() {
      this.__virtualizer = new Virtualizer({
        createElements: this.__createElements.bind(this),
        updateElement: this._updateElement.bind(this),
        elementsContainer: this,
        scrollTarget: this,
        scrollContainer: this.$.selector,
        reorderElements: true,
      });
    }

    /** @private */
    __itemsChanged(items) {
      if (items && this.__virtualizer) {
        this.requestContentUpdate();
      }
    }

    /** @private */
    __loadingChanged() {
      this.requestContentUpdate();
    }

    /** @private */
    __openedChanged(opened) {
      if (opened) {
        if (!this.__virtualizer) {
          this.__initVirtualizer();
        }

        this.requestContentUpdate();
      }
    }

    /** @private */
    __selectedItemChanged() {
      this.requestContentUpdate();
    }

    /** @private */
    __itemClassNameGeneratorChanged(generator, oldGenerator) {
      if (generator || oldGenerator) {
        this.requestContentUpdate();
      }
    }

    /** @private */
    __focusedIndexChanged(index, oldIndex) {
      if (index !== oldIndex) {
        this.requestContentUpdate();
      }

      // Do not jump back to the previously focused item while loading
      // when requesting next page from the data provider on scroll.
      if (index >= 0 && !this.loading) {
        this.scrollIntoView(index);
      }
    }

    /** @private */
    __rendererChanged(renderer, oldRenderer) {
      if (renderer || oldRenderer) {
        this.requestContentUpdate();
      }
    }

    /** @private */
    __createElements(count) {
      return [...Array(count)].map(() => {
        const item = document.createElement(`${this.__hostTagName}-item`);
        item.addEventListener('click', this.__boundOnItemClick);
        // Negative tabindex prevents the item content from being focused.
        item.tabIndex = '-1';
        item.style.width = '100%';
        return item;
      });
    }

    /**
     * @param {HTMLElement} el
     * @param {number} index
     * @protected
     */
    _updateElement(el, index) {
      const item = this.items[index];
      const focusedIndex = this.focusedIndex;
      const selected = this._isItemSelected(item, this.selectedItem, this.itemIdPath);

      el.setProperties({
        item,
        index,
        label: this.getItemLabel(item),
        selected,
        renderer: this.renderer,
        focused: !this.loading && focusedIndex === index,
      });

      if (typeof this.itemClassNameGenerator === 'function') {
        el.className = this.itemClassNameGenerator(item);
      } else if (el.className !== '') {
        el.className = '';
      }

      // NOTE: in PolylitMixin, setProperties() waits for `hasUpdated` to be set.
      // However, this causes issues with virtualizer. So we enforce sync update.
      if (el.performUpdate && !el.hasUpdated) {
        el.performUpdate();
      }

      el.id = `${this.__hostTagName}-item-${index}`;
      el.setAttribute('role', index !== undefined ? 'option' : false);
      el.setAttribute('aria-selected', selected.toString());
      el.setAttribute('aria-posinset', index + 1);
      el.setAttribute('aria-setsize', this.items.length);

      if (this.theme) {
        el.setAttribute('theme', this.theme);
      } else {
        el.removeAttribute('theme');
      }

      if (item instanceof ComboBoxPlaceholder) {
        this.__requestItemByIndex(index);
      }
    }

    /** @private */
    __onItemClick(e) {
      this.dispatchEvent(new CustomEvent('selection-changed', { detail: { item: e.currentTarget.item } }));
    }

    /**
     * We want to prevent the kinetic scrolling energy from being transferred from the overlay contents over to the parent.
     * Further improvement ideas: after the contents have been scrolled to the top or bottom and scrolling has stopped, it could allow
     * scrolling the parent similarly to touch scrolling.
     * @private
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

    /**
     * Dispatches an `index-requested` event for the given index to notify
     * the data provider that it should start loading the page containing the requested index.
     *
     * The event is dispatched asynchronously to prevent an immediate page request and therefore
     * a possible infinite recursion in case the data provider implements page request cancelation logic
     * by invoking data provider page callbacks with an empty array.
     * The infinite recursion may occur otherwise since invoking a data provider page callback with an empty array
     * triggers a synchronous scroller update and, if the callback corresponds to the currently visible page,
     * the scroller will synchronously request the page again which may lead to looping in the end.
     * That was the case for the Flow counterpart:
     * https://github.com/vaadin/flow-components/issues/3553#issuecomment-1239344828
     * @private
     */
    __requestItemByIndex(index) {
      requestAnimationFrame(() => {
        this.dispatchEvent(
          new CustomEvent('index-requested', {
            detail: {
              index,
            },
          }),
        );
      });
    }

    /** @private */
    _visibleItemsCount() {
      // Ensure items are positioned
      this.__virtualizer.scrollToIndex(this.__virtualizer.firstVisibleIndex);
      const hasItems = this.__virtualizer.size > 0;
      return hasItems ? this.__virtualizer.lastVisibleIndex - this.__virtualizer.firstVisibleIndex + 1 : 0;
    }
  };
