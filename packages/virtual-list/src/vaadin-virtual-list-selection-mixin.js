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
         * A function that generates accessible names for virtual list items.
         */
        itemAccessibleNameGenerator: {
          type: Function,
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
      return ['__selectedItemsChanged(itemIdPath, selectedItems, __focusIndex, itemAccessibleNameGenerator)'];
    }

    constructor() {
      super();

      this.addEventListener('keydown', (e) => this.__onKeyDown(e));
      this.addEventListener('click', () => this.__onClick());
      this.addEventListener('focusin', (e) => this.__onFocusIn(e));
      this.addEventListener('focusout', (e) => this.__onFocusOut(e));
    }

    ready() {
      super.ready();
      this.__updateAria();
    }

    /** @private */
    __updateElement(el, index) {
      const item = this.items[index];
      el.__item = item;
      el.__index = index;

      el.toggleAttribute('selected', this.__isSelected(item));
      el.tabIndex = this.__isNavigating() && this.selectionMode && this.__focusIndex === index ? 0 : -1;
      el.role = this.selectionMode ? 'option' : 'listitem';
      el.ariaSelected = this.selectionMode ? this.__isSelected(item) : null;
      el.ariaSetSize = this.items.length;
      el.ariaPosInSet = index + 1;

      el.toggleAttribute(
        'focused',
        !!this.selectionMode && this.__focusIndex === index && el.contains(document.activeElement),
      );
      el.ariaLabel = this.itemAccessibleNameGenerator ? this.itemAccessibleNameGenerator(item) : null;
    }

    /**
     * @private
     */
    __updateItemModel(model, item, index) {
      model.selected = this.__isSelected(item);
      if (super.__updateItemModel) {
        super.__updateItemModel(model, item, index);
      }
    }

    /** @private */
    __selectionModeChanged() {
      this.__setNavigating(true);
      this.requestContentUpdate();
      this.__updateAria();
    }

    /** @private */
    __updateAria() {
      this.role = this.selectionMode ? 'listbox' : 'list';
      this.ariaMultiSelectable = this.selectionMode === 'multi' ? 'true' : null;
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
      const element = this.__getRootElementFromEvent(e);
      return element ? element.__item : null;
    }

    /** @private */
    __getRootElementFromEvent(e) {
      return e.composedPath().find((el) => el.parentElement === this);
    }

    /** @private */
    __toggleSelection(item) {
      if (item === undefined) {
        return;
      }
      if (this.__isSelected(item)) {
        this.selectedItems = this.selectedItems.filter((selectedItem) => !this.__itemsEqual(selectedItem, item));
      } else if (this.selectionMode === 'multi') {
        this.selectedItems = [...this.selectedItems, item];
      } else {
        this.selectedItems = [item];
      }
    }

    /** @private */
    __ensureFocusedIndexInView() {
      if (!this.__getRenderedFocusIndexElement()) {
        this.scrollToIndex(this.__focusIndex);
      } else {
        const listRect = this.getBoundingClientRect();
        const elementRect = this.__getRenderedFocusIndexElement().getBoundingClientRect();
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
      this.__getRenderedFocusIndexElement().focus();
    }

    /** @private */
    __getRenderedFocusIndexElement() {
      return [...this.children].find((el) => el.__index === this.__focusIndex);
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
    __setNavigating(navigating) {
      if (this.selectionMode && navigating) {
        this.tabIndex = 0;
      } else {
        this.removeAttribute('tabindex');
      }
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
          this.__onNavigationSpaceKey();
        } else if (e.key === 'Tab') {
          this.__onNavigationTabKey(e.shiftKey);
        }
      } else if (e.key === 'Escape' && !e.defaultPrevented) {
        // Prevent closing a dialog etc. when returning to navigation mode on Escape
        e.preventDefault();
        e.stopPropagation();
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
    __onNavigationSpaceKey() {
      this.__ensureFocusedIndexInView();
      this.__toggleSelection(this.__getRenderedFocusIndexElement().__item);
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
    __onClick() {
      if (!this.selectionMode || !this.__isNavigating()) {
        return;
      }

      this.__toggleSelection(this.__getRenderedFocusIndexElement().__item);
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
        this.__focusIndex = this.__getRootElementFromEvent(e).__index;
      }

      // Focus the root element matching focus index if focus came from outside
      if (navigating && !this.contains(e.relatedTarget)) {
        this.__focusElementWithFocusIndex();
      }
    }

    /** @private */
    __onFocusOut(e) {
      if (!this.selectionMode) {
        return;
      }
      if (!this.contains(e.relatedTarget)) {
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
