/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

import { getFocusableElements } from '@vaadin/a11y-base';
import { get } from '@vaadin/component-base/src/path-utils';

/**
 * @polymerMixin
 */
export const SelectionMixin = (superClass) =>
  class SelectionMixin extends superClass {
    static get properties() {
      return {
        /**
         * Selection mode for the virtual list. Available modes are: `single` and `multi`.
         * @type {string}
         */
        selectionMode: {
          type: String,
          observer: '__selectionModeChanged',
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
          type: Object,
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
         * @private
         */
        __focusIndex: {
          type: Object,
          value: 0,
          sync: true,
        },
      };
    }

    static get observers() {
      return ['__selectedItemsChanged(itemIdPath, selectedItems, __focusIndex)'];
    }

    constructor() {
      super();

      this.addEventListener('keydown', (e) => this.__onKeyDown(e));
      this.addEventListener('click', (e) => this.__onClick(e));
      this.addEventListener('focusin', (e) => this.__onFocusIn(e));
      this.addEventListener('focusout', (e) => this.__onFocusOut(e));
    }

    /** @private */
    __updateElement(el, index) {
      const item = this.items[index];
      el.__item = item;

      el.toggleAttribute('selected', this.__isSelected(item));
      el.tabIndex = this.__isNavigating() && this.selectionMode && this.__focusIndex === index ? 0 : -1;

      el.toggleAttribute(
        'focused',
        this.selectionMode && this.__focusIndex === index && el.contains(document.activeElement),
      );
    }

    /** @private */
    __selectionModeChanged() {
      this.__setNavigating(true);
      this.requestContentUpdate();
    }

    /** @private */
    __isSelected(item) {
      return this.__selectedKeys.has(this.__getItemId(item));
    }

    /** @private */
    __selectedItemsChanged() {
      this.requestContentUpdate();
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
    __getItemFromEvent(e) {
      const element = e.composedPath().find((el) => el.parentElement === this);
      return element ? element.__item : null;
    }

    /** @private */
    __toggleSelection(item) {
      if (this.__isSelected(item)) {
        this.selectedItems = this.selectedItems.filter((selectedItem) => !this.__itemsEqual(selectedItem, item));
      } else if (this.selectionMode === 'multi') {
        this.selectedItems = [...this.selectedItems, item];
      } else {
        this.selectedItems = [item];
      }
    }

    /** @private */
    __focusElementWithFocusIndex() {
      if (!this.__getRenderedFocusIndexElement()) {
        this.scrollToIndex(this.__focusIndex);
      }
      this.__getRenderedFocusIndexElement().focus();
      this.requestContentUpdate();
    }

    /** @private */
    __getRenderedFocusIndexElement() {
      return [...this.children].find((el) => this.__getItemIndex(el.__item) === this.__focusIndex);
    }

    /** @private */
    __getRootElementWithFocus() {
      return [...this.children].find((el) => el.contains(document.activeElement));
    }

    /** @private */
    __isNavigating() {
      return this.hasAttribute('navigating');
    }

    /** @private */
    __getItemIndex(item) {
      return this.items.indexOf(item);
    }

    /** @private */
    __setNavigating(navigating) {
      this.tabIndex = this.selectionMode && navigating ? 0 : -1;
      this.$.focusexit.hidden = !this.selectionMode || !navigating;
      this.toggleAttribute('navigating', navigating);
      this.toggleAttribute('interacting', !navigating);
      this.requestContentUpdate();
    }

    /** @private */
    __onKeyDown(e) {
      if (!this.selectionMode) {
        return;
      }

      if (this.__isNavigating()) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          this.__onNavigationArrowKey(e.key === 'ArrowDown');
        } else if (e.key === 'Enter') {
          e.preventDefault();
          this.__onNavigationEnterKey();
        } else if (e.key === ' ') {
          e.preventDefault();
          this.__toggleSelection(this.__getItemFromEvent(e));
        } else if (e.key === 'Tab') {
          this.__onNavigationTabKey(e.shiftKey);
        }
      } else if (e.key === 'Escape' && !e.defaultPrevented) {
        this.__getRootElementWithFocus().focus();
      }
    }

    /** @private */
    __onNavigationArrowKey(down) {
      this.__focusIndex = Math.min(Math.max(this.__focusIndex + (down ? 1 : -1), 0), this.items.length - 1);
      this.__focusElementWithFocusIndex();
    }

    /** @private */
    __onNavigationTabKey(shift) {
      if (shift) {
        this.focus();
      } else {
        const scrollTop = this.scrollTop;
        this.$.focusexit.focus();
        this.scrollTop = scrollTop;
      }
    }

    /** @private */
    __onNavigationEnterKey() {
      // Get the focused item
      const focusedItem = this.querySelector('[focused]');
      // First the first focusable element in the focused item and focus it
      const focusableElement = getFocusableElements(focusedItem).find((el) => el !== focusedItem);
      if (focusableElement) {
        focusableElement.focus();
      }
    }

    /** @private */
    __onClick(e) {
      if (!this.selectionMode || !this.__isNavigating()) {
        return;
      }

      const item = this.__getItemFromEvent(e);
      if (item) {
        this.__toggleSelection(item);
      }
    }

    /** @private */
    __onFocusIn(e) {
      if (!this.selectionMode) {
        return;
      }

      // Set navigating state if one of the root elements, virtual-list or focusexit, is focused
      const navigating = [...this.children, this, this.$.focusexit].includes(e.target);
      this.__setNavigating(navigating);

      // Update focus index based on the focused item
      const targetItem = this.__getItemFromEvent(e);
      if (targetItem) {
        this.__focusIndex = this.__getItemIndex(targetItem);
      }

      // Focus the root element matching focus index if focus came from outside
      if (navigating && !this.contains(e.relatedTarget)) {
        this.__focusElementWithFocusIndex();
      }
    }

    /** @private */
    __onFocusOut() {
      if (!this.selectionMode) {
        return;
      }
      if (!this.contains(document.activeElement)) {
        // If the focus leaves the virtual list, restore navigating state
        this.__setNavigating(true);
      }
    }

    /**
     * Fired when the `selectedItems` property changes.
     *
     * @event selected-items-changed
     */
  };
