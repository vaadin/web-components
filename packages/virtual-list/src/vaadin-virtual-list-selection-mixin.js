/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

import { getFocusableElements, isKeyboardActive } from '@vaadin/a11y-base';
import { timeOut } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { get } from '@vaadin/component-base/src/path-utils.js';

/**
 * @polymerMixin
 */
export const SelectionMixin = (superClass) =>
  class SelectionMixin extends superClass {
    static get properties() {
      return {
        /**
         * Selection mode for the virtual list. Available modes are: `none`, `single` and `multi`.
         * @attr {string} selection-mode
         */
        selectionMode: {
          type: String,
          observer: '__selectionModeChanged',
          value: 'none',
        },

        /**
         * Path to an item sub-property that identifies the item.
         * @attr {string} item-id-path
         */
        itemIdPath: {
          type: String,
          value: null,
          sync: true,
        },

        /**
         * An array that contains the selected items.
         * @type {!Array<!VirtualListItem>}
         */
        selectedItems: {
          type: Array,
          notify: true,
          value: () => [],
          sync: true,
        },

        /**
         * Set of selected item ids
         * @private
         */
        __selectedKeys: {
          type: Object,
          computed: '__computeSelectedKeys(itemIdPath, selectedItems)',
        },

        /**
         * The index of the focused item.
         * @private
         */
        __focusIndex: {
          type: Number,
          value: 0,
          sync: true,
        },
      };
    }

    static get observers() {
      return ['__selectionChanged(itemIdPath, selectedItems)'];
    }

    constructor() {
      super();

      this.addEventListener('keydown', (e) => this.__onKeyDown(e));
      this.addEventListener('click', (e) => this.__onClick(e));
      this.addEventListener('focusin', (e) => this.__onFocusIn(e));
      this.addEventListener('focusout', (e) => this.__onFocusOut(e));
    }

    ready() {
      super.ready();

      this._createPropertyObserver('items', '__selectionItemsUpdated');
    }

    /** @private */
    get __isSelectable() {
      return this.selectionMode !== 'none';
    }

    /**
     * @private
     * @override
     */
    __updateElement(el, index) {
      const item = this.items[index];
      el.__item = item;
      el.__index = index;

      el.toggleAttribute('selected', this.__isSelected(item));

      const ariaSelected = this.__isSelectable ? String(this.__isSelected(item)) : null;
      this.__updateArieaSelected(el, ariaSelected);

      const isFocusable = this.__isNavigating() && this.__focusIndex === index;
      el.tabIndex = isFocusable ? 0 : -1;

      const isFocused = this.__isSelectable && this.__focusIndex === index && el.contains(this.__getActiveElement());
      el.toggleAttribute('focused', isFocused);

      super.__updateElement(el, index);
    }

    __updateArieaSelected(el, selected) {
      if (this.selectionMode === 'single') {
        // aria-selected must be applied this way to have VO announce it correctly on single-select mode
        el.ariaSelected = null;
        setTimeout(() => {
          el.ariaSelected = selected;
        });
      } else {
        el.ariaSelected = selected;
      }
    }

    /**
     * @private
     * @override
     */
    __updateElementRole(el) {
      if (this.__isSelectable) {
        el.role = 'option';
      } else {
        super.__updateElementRole(el);
      }
    }

    /**
     * @private
     * @override
     */
    __getItemModel(index) {
      // Include "selected" property in the model passed to the renderer
      return {
        ...super.__getItemModel(index),
        selected: this.__isSelected(this.items[index]),
      };
    }

    /** @private */
    __selectionModeChanged() {
      this.__updateAria();
      this.__updateNavigating(true);
    }

    /**
     * @private
     * @override
     */
    __updateAria() {
      this.role = this.__isSelectable ? 'listbox' : 'list';
      this.ariaMultiSelectable = this.selectionMode === 'multi' ? 'true' : null;
    }

    /** @private */
    __updateFocusIndex(index) {
      this.__focusIndex = Math.max(0, Math.min(index, (this.items || []).length - 1));
    }

    /** @private */
    __selectionItemsUpdated() {
      if (!this.__isSelectable) {
        return;
      }

      const oldFocusIndex = this.__focusIndex;
      this.__updateFocusIndex(this.__focusIndex);
      if (oldFocusIndex !== this.__focusIndex) {
        this.__scheduleContentUpdate();
      }
      // Items may have been emptied, need to update focusability
      this.__updateFocusable();
    }

    /** @private */
    __isSelected(item) {
      return this.__selectedKeys.has(this.__getItemId(item));
    }

    /** @private */
    __selectionChanged() {
      this.__scheduleContentUpdate();
    }

    /** @private */
    __computeSelectedKeys(_itemIdPath, selectedItems) {
      return new Set((selectedItems || []).map((item) => this.__getItemId(item)));
    }

    /** @private */
    __itemsEqual(item1, item2) {
      return this.__getItemId(item1) === this.__getItemId(item2);
    }

    /** @private */
    __getItemId(item) {
      return this.itemIdPath ? get(this.itemIdPath, item) : item;
    }

    /** @private */
    __toggleSelection(item) {
      if (item === undefined) {
        return;
      }

      if (this.selectionMode === 'single') {
        this.selectedItems = this.__isSelected(item) ? [] : [item];
      } else if (this.selectionMode === 'multi') {
        this.selectedItems = this.__isSelected(item)
          ? this.selectedItems.filter((selectedItem) => !this.__itemsEqual(selectedItem, item))
          : [...this.selectedItems, item];
      }
    }

    /** @private */
    __ensureFocusedIndexInView() {
      const focusElement = this.__getRenderedFocusIndexElement();
      if (!focusElement) {
        // The focused element is not rendered, scroll to the focused index
        this.scrollToIndex(this.__focusIndex);
      } else {
        // The focused element is rendered. If it's not inside the visible area, scroll to it
        const listRect = this.getBoundingClientRect();
        const elementRect = focusElement.getBoundingClientRect();
        if (elementRect.top < listRect.top) {
          this.scrollTop -= listRect.top - elementRect.top;
        } else if (elementRect.bottom > listRect.bottom) {
          this.scrollTop += elementRect.bottom - listRect.bottom;
        }
      }
    }

    /** @private */
    __focusElementWithFocusIndex() {
      this.__ensureFocusedIndexInView();
      const focusElement = this.__getRenderedFocusIndexElement();
      if (focusElement) {
        focusElement.focus();
      }
    }

    /** @private */
    __getRenderedRootElements() {
      return [...this.children].filter((el) => !el.hidden);
    }

    /**
     * Returns the rendered root element with the current focus index.
     * @private
     */
    __getRenderedFocusIndexElement() {
      return this.__getRenderedRootElements().find((el) => el.__index === this.__focusIndex);
    }

    /**
     * Returns the rendered root element which contains focus.
     * @private
     */
    __getRootElementWithFocus() {
      return this.__getRenderedRootElements().find((el) => el.contains(this.__getActiveElement()));
    }

    /**
     * Returns the rendered root element matching or containing the given child element.
     * @private
     */
    __getRootElementByContent(element) {
      return this.__getRenderedRootElements().find((el) => el.contains(element));
    }

    /** @private */
    __isNavigating() {
      return !!this.__navigating;
    }

    /** @private */
    __updateNavigating(navigating) {
      this.__navigating = this.__isSelectable && navigating;
      this.toggleAttribute(
        'navigating',
        this.__navigating && isKeyboardActive() && this.contains(this.__getActiveElement()),
      );

      const isInteracting = this.__isSelectable && !navigating;
      this.toggleAttribute('interacting', isInteracting);

      this.__updateFocusable();
      this.__scheduleContentUpdate();
    }

    /** @private */
    __updateFocusable() {
      const isFocusable = !!(this.__isNavigating() && this.items && this.items.length);
      if (this.__isSelectable) {
        this.tabIndex = isFocusable ? 0 : -1;
      } else {
        this.removeAttribute('tabindex');
      }
      this.$.focusexit.hidden = !isFocusable;
    }

    /** @private */
    __getActiveElement() {
      return this.getRootNode().activeElement;
    }

    /** @private */
    __onKeyDown(e) {
      if (e.defaultPrevented || !this.__isSelectable) {
        return;
      }

      if (this.__isNavigating()) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          this.__onNavigationArrowKey(e.key === 'ArrowDown');
        } else if (e.key === 'Enter') {
          this.__onNavigationEnterKey();
        } else if (e.key === ' ') {
          e.preventDefault();
          this.__onNavigationSpaceKey();
        } else if (e.key === 'Tab') {
          this.__onNavigationTabKey(e.shiftKey);
        }
      } else if (e.key === 'Escape') {
        // Prevent closing a dialog etc. when returning to navigation mode on Escape
        e.preventDefault();
        e.stopPropagation();
        this.__getRootElementWithFocus().focus();
      }
    }

    /** @private */
    __onNavigationArrowKey(down) {
      this.__updateFocusIndex(this.__focusIndex + (down ? 1 : -1));
      this.__focusElementWithFocusIndex();

      // Flush the virtualizer's element reordering to have VO announce the element's pos-in-set correctly
      // when navigating with arrow keys
      this.__virtualizer.flush();

      if (this.__debounceRequestContentUpdate) {
        // Render synchronously to avoid jumpiness when navigating near viewport edges
        this.__debounceRequestContentUpdate.flush();
      }
    }

    /** @private */
    __scheduleContentUpdate() {
      this.__debounceRequestContentUpdate = Debouncer.debounce(
        this.__debounceRequestContentUpdate,
        timeOut.after(0),
        () => {
          this.requestContentUpdate();
        },
      );
    }

    /** @private */
    __onNavigationTabKey(shift) {
      if (shift) {
        // Focus the virtual list itself when shift-tabbing so the focus actually ends
        // up on the previous element in the tab order before the virtual list
        // instead of some focusable child on another row.
        this.focus();
      } else {
        // Focus the focus exit element when tabbing so the focus actually ends up on
        // the next element in the tab order after the virtual list instead of some focusable child on another row.
        this.$.focusexit.focus();
      }
    }

    /** @private */
    __onNavigationSpaceKey() {
      // Ensure the focused item is in view and focused before toggling selection
      this.__focusElementWithFocusIndex();
      this.__toggleSelection(this.__getRenderedFocusIndexElement().__item);
    }

    /** @private */
    __onNavigationEnterKey() {
      // Get the focused item
      const focusedItem = this.querySelector('[focused]');
      if (!focusedItem) {
        return;
      }
      // Find the first focusable element in the item and focus it
      const focusableElement = getFocusableElements(focusedItem).find((el) => el !== focusedItem);
      if (!focusableElement) {
        return;
      }
      focusableElement.focus();
    }

    /** @private */
    __onClick(e) {
      if (!this.__isSelectable || !this.__isNavigating()) {
        return;
      }
      if (this.__getActiveElement() === this) {
        // If the virtual list itself is clicked, focus the root element matching focus index
        this.__focusElementWithFocusIndex();
      }

      const clickedRootElement = this.__getRootElementByContent(e.target);
      if (clickedRootElement) {
        this.__updateFocusIndex(clickedRootElement.__index);
        this.__toggleSelection(clickedRootElement.__item);
      }

      if (this.hasAttribute('navigating')) {
        this.__updateNavigating(this.__isNavigating());
      }
    }

    /** @private */
    __onFocusIn(e) {
      if (!this.__isSelectable) {
        return;
      }

      // Set navigating state if one of the root elements, virtual-list or focusexit, is focused
      // Set interacting state otherwise (child element is focused)
      const navigating = [...this.children, this, this.$.focusexit].includes(e.target);
      if (navigating || this.__isNavigating()) {
        this.__updateNavigating(navigating);
      }

      // Update focus index based on the focused item
      const rootElement = this.__getRootElementWithFocus();
      if (rootElement) {
        this.__updateFocusIndex(rootElement.__index);
      }

      // Focus the root element matching focus index if focus came from outside
      if (navigating && !this.contains(e.relatedTarget)) {
        this.__focusElementWithFocusIndex();
      }
    }

    /** @private */
    __onFocusOut(e) {
      if (!this.__isSelectable) {
        return;
      }
      if (!this.contains(e.relatedTarget)) {
        // If the focus leaves the virtual list, restore navigating state
        this.__updateNavigating(true);
      }
    }

    /**
     * Fired when the `selectedItems` property changes.
     *
     * @event selected-items-changed
     */
  };