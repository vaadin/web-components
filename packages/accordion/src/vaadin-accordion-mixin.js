/**
 * @license
 * Copyright (c) 2019 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { isElementFocused } from '@vaadin/a11y-base/src/focus-utils.js';
import { KeyboardDirectionMixin } from '@vaadin/a11y-base/src/keyboard-direction-mixin.js';
import { SlotObserver } from '@vaadin/component-base/src/slot-observer.js';

/**
 * A mixin providing common accordion functionality.
 *
 * @polymerMixin
 * @mixes KeyboardDirectionMixin
 */
export const AccordionMixin = (superClass) =>
  class AccordionMixinClass extends KeyboardDirectionMixin(superClass) {
    static get properties() {
      return {
        /**
         * The index of currently opened panel. First panel is opened by
         * default. Only one panel can be opened at the same time.
         * Setting null or undefined closes all the accordion panels.
         * @type {number}
         */
        opened: {
          type: Number,
          value: 0,
          notify: true,
          reflectToAttribute: true,
        },

        /**
         * The list of `<vaadin-accordion-panel>` child elements.
         * It is populated from the elements passed to the light DOM,
         * and updated dynamically when adding or removing panels.
         * @type {!Array<!AccordionPanel>}
         */
        items: {
          type: Array,
          readOnly: true,
          notify: true,
        },
      };
    }

    static get observers() {
      return ['_updateItems(items, opened)'];
    }

    constructor() {
      super();
      this._boundUpdateOpened = this._updateOpened.bind(this);
    }

    /**
     * Override getter from `KeyboardDirectionMixin`
     * to check if the heading element has focus.
     *
     * @return {Element | null}
     * @protected
     * @override
     */
    get focused() {
      return (this._getItems() || []).find((item) => isElementFocused(item.focusElement));
    }

    /**
     * @protected
     * @override
     */
    focus() {
      if (this._observer) {
        this._observer.flush();
      }
      super.focus();
    }

    /** @protected */
    ready() {
      super.ready();

      const slot = this.shadowRoot.querySelector('slot');
      this._observer = new SlotObserver(slot, (info) => {
        this._setItems(this._filterItems(Array.from(this.children)));

        this._filterItems(info.addedNodes).forEach((el) => {
          el.addEventListener('opened-changed', this._boundUpdateOpened);
        });
      });
    }

    /**
     * Override method inherited from `KeyboardDirectionMixin`
     * to use the stored list of accordion panels as items.
     *
     * @return {Element[]}
     * @protected
     * @override
     */
    _getItems() {
      return this.items;
    }

    /**
     * @param {!Array<!Element>} array
     * @return {!Array<!AccordionPanel>}
     * @protected
     */
    _filterItems(array) {
      return array.filter((el) => el instanceof customElements.get('vaadin-accordion-panel'));
    }

    /** @private */
    _updateItems(items, opened) {
      if (items) {
        const itemToOpen = items[opened];
        items.forEach((item) => {
          item.opened = item === itemToOpen;
        });
      }
    }

    /**
     * Override an event listener from `KeyboardMixin`
     * to only handle details toggle buttons events.
     *
     * @param {!KeyboardEvent} event
     * @protected
     * @override
     */
    _onKeyDown(event) {
      // Only check keyboard events on details toggle buttons
      if (!this.items.some((item) => item.focusElement === event.target)) {
        return;
      }

      super._onKeyDown(event);
    }

    /** @private */
    _updateOpened(e) {
      const target = this._filterItems(e.composedPath())[0];
      const idx = this.items.indexOf(target);
      if (e.detail.value) {
        if (target.disabled || idx === -1) {
          return;
        }

        this.opened = idx;
      } else if (!this.items.some((item) => item.opened)) {
        this.opened = null;
      }
    }
  };
