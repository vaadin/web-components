/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

import { getFocusableElements } from '@vaadin/a11y-base';
import { timeOut } from '@vaadin/component-base/src/async';
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
         * The index of the focused item.
         * @private
         */
        __focusIndex: {
          type: Number,
          value: 0,
          sync: true,
        },

        __focusExitVisible: {
          type: Boolean,
          value: false,
        },
      };
    }

    static get observers() {
      return ['__selectionChanged(itemIdPath, selectedItems, itemAccessibleNameGenerator)'];
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
    __isSelectable() {
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
      const isFocusable = this.__isNavigating() && this.__focusIndex === index;
      el.tabIndex = isFocusable ? 0 : -1;
      el.toggleAttribute('focused', isFocusable && el.contains(document.activeElement));

      el.role = this.__isSelectable() ? 'option' : 'listitem';
      el.ariaSelected = this.__isSelectable() ? String(this.__isSelected(item)) : null;
      el.ariaSetSize = String(this.items.length);
      el.ariaPosInSet = String(index + 1);

      el.ariaLabel = this.itemAccessibleNameGenerator ? this.itemAccessibleNameGenerator(item) : null;
    }

    /**
     * @private
     * @override
     */
    __updateItemModel(model, item) {
      // Include "selected" property in the model passed to the renderer
      model.selected = this.__isSelected(item);
    }

    /** @private */
    __selectionModeChanged() {
      this.__updateAria();
      this.__updateNavigating(true);
    }

    /** @private */
    __updateAria() {
      this.role = this.__isSelectable() ? 'listbox' : 'list';
      this.ariaMultiSelectable = this.selectionMode === 'multi' ? 'true' : null;
    }

    /** @private */
    __clampIndex(index) {
      return Math.max(0, Math.min(index, (this.items || []).length - 1));
    }

    /** @private */
    __selectionItemsUpdated() {
      if (!this.__isSelectable()) {
        return;
      }

      const oldFocusIndex = this.__focusIndex;
      this.__focusIndex = this.__clampIndex(this.__focusIndex);
      if (oldFocusIndex !== this.__focusIndex) {
        this.__scheduleRequestContentUpdate();
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
      this.__scheduleRequestContentUpdate();
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
      return this.__getRenderedRootElements().find((el) => el.contains(document.activeElement));
    }

    /**
     * Returns the rendered root element containing the given child element.
     * @private
     */
    __getRootElementByContent(element) {
      return this.__getRenderedRootElements().find((el) => el.contains(element));
    }

    /** @private */
    __isNavigating() {
      return this.hasAttribute('navigating');
    }

    /** @private */
    __updateNavigating(navigating) {
      const isNavigating = this.__isSelectable() && navigating;
      this.toggleAttribute('navigating', isNavigating);

      const isInteracting = this.__isSelectable() && !navigating;
      this.toggleAttribute('interacting', isInteracting);

      this.__updateFocusable();
      this.__scheduleRequestContentUpdate();
    }

    /** @private */
    __updateFocusable() {
      const isFocusable = !!(this.__isNavigating() && this.items && this.items.length);
      if (this.__isSelectable()) {
        this.tabIndex = isFocusable ? 0 : -1;
      } else {
        this.removeAttribute('tabindex');
      }
      this.__focusExitVisible = isFocusable;
    }

    /** @private */
    __onKeyDown(e) {
      if (e.defaultPrevented || !this.__isSelectable()) {
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
      this.__focusIndex = this.__clampIndex(this.__focusIndex + (down ? 1 : -1));
      this.__focusElementWithFocusIndex();
    }

    /** @private */
    __scheduleRequestContentUpdate() {
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
        // Focusing the focus exit element causes scroll top to get reset, so we need to save and restore it
        const scrollTop = this.scrollTop;
        this.$.focusexit.focus();
        this.scrollTop = scrollTop;
      }
    }

    /** @private */
    __onNavigationSpaceKey() {
      // Ensure the focused item is in view before toggling selection
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
    __onClick(e) {
      if (!this.__isSelectable() || !this.__isNavigating()) {
        return;
      }

      if (document.activeElement === this) {
        // If the virtual list itself is clicked, focus the root element matching focus index
        this.__focusElementWithFocusIndex();
      }

      const clickedRootElement = this.__getRootElementByContent(e.target);
      if (clickedRootElement) {
        this.__toggleSelection(clickedRootElement.__item);
      }
    }

    /** @private */
    __onFocusIn(e) {
      if (!this.__isSelectable()) {
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
        this.__focusIndex = rootElement.__index;
      }

      // Focus the root element matching focus index if focus came from outside
      if (navigating && !this.contains(e.relatedTarget)) {
        this.__focusElementWithFocusIndex();
      }
    }

    /** @private */
    __onFocusOut(e) {
      if (!this.__isSelectable()) {
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
