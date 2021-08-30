/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { animationFrame } from '@polymer/polymer/lib/utils/async.js';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';
import { IronResizableBehavior } from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { SlotMixin } from '@vaadin/field-base/src/slot-mixin.js';

/**
 * @polymerMixin
 */
export const ButtonsMixin = (superClass) =>
  class extends SlotMixin(mixinBehaviors(IronResizableBehavior, superClass)) {
    static get properties() {
      return {
        /**
         * The object used to localize this component.
         * To change the default localization, replace the entire
         * `i18n` object with a custom one.
         *
         * To update individual properties, extend the existing i18n object like so:
         * ```
         * menuBar.i18n = {
         *   ...menuBar.i18n,
         *   moreOptions: 'More options'
         * }
         * ```
         *
         * The object has the following JSON structure and default values:
         * ```
         * {
         *   moreOptions: 'More options'
         * }
         * ```
         *
         * @type {!MenuBarI18n}
         * @default {English/US}
         */
        i18n: {
          type: Object,
          value: () => {
            return {
              moreOptions: 'More options'
            };
          }
        },

        /**
         * @type {boolean}
         * @protected
         */
        _hasOverflow: {
          type: Boolean,
          value: false,
          observer: '__hasOverflowChanged'
        }
      };
    }

    static get observers() {
      return ['_menuItemsChanged(items, items.splices)', '__i18nChanged(i18n.*)'];
    }

    /**
     * @protected
     * @override
     */
    get slots() {
      return {
        ...super.slots,
        overflow: () => {
          const overflow = document.createElement('vaadin-menu-bar-button');
          overflow.setAttribute('hidden', '');
          const dots = document.createElement('div');
          dots.setAttribute('aria-hidden', 'true');
          dots.textContent = '···';
          overflow.appendChild(dots);
          return overflow;
        }
      };
    }

    constructor() {
      super();

      this.__boundOnResize = this.__onResize.bind(this);
    }

    /** @protected */
    ready() {
      super.ready();

      this.setAttribute('role', 'menubar');
    }

    /** @protected */
    connectedCallback() {
      super.connectedCallback();

      this._initButtonAttrs(this._overflow);
      this._setAriaLabel(this.i18n);
      this.addEventListener('iron-resize', this.__boundOnResize);
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();

      this.removeEventListener('iron-resize', this.__boundOnResize);
    }

    /**
     * @return {!Array<!HTMLElement>}
     * @protected
     */
    get _buttons() {
      return Array.from(this.querySelectorAll('vaadin-menu-bar-button'));
    }

    /**
     * @return {!HTMLElement}
     * @protected
     */
    get _container() {
      return this.shadowRoot.querySelector('[part="container"]');
    }

    /**
     * @return {!HTMLElement}
     * @protected
     */
    get _overflow() {
      return this._getDirectSlotChild('overflow');
    }

    /** @private */
    __hasOverflowChanged(hasOverflow) {
      if (!this._overflow) {
        return;
      }
      this._overflow.toggleAttribute('hidden', !hasOverflow);
    }

    /** @private */
    _menuItemsChanged(items) {
      if (items !== this._oldItems) {
        this._oldItems = items;
        this.__renderButtons(items);
      }
    }

    /** @private */
    __i18nChanged() {
      this._setAriaLabel(this.i18n);
    }

    /** @protected */
    _setAriaLabel(i18n) {
      if (this._overflow && i18n && i18n.moreOptions) {
        this._overflow.setAttribute('aria-label', i18n.moreOptions);
      }
    }

    /** @private */
    __getOverflowCount(overflow) {
      // We can't use optional chaining due to webpack 4
      return (overflow.item && overflow.item.children && overflow.item.children.length) || 0;
    }

    /** @private */
    __detectOverflow() {
      const container = this._container;
      const buttons = this._buttons.slice(0);
      const overflow = buttons.pop();
      const isRTL = this.getAttribute('dir') === 'rtl';

      const oldOverflowCount = this.__getOverflowCount(overflow);

      // reset all buttons in the menu bar and the overflow button
      for (let i = 0; i < buttons.length; i++) {
        const btn = buttons[i];
        btn.disabled = btn.item && btn.item.disabled;
        btn.style.visibility = '';
        btn.style.position = '';

        // teleport item component back from "overflow" sub-menu
        const item = btn.item && btn.item.component;
        if (item instanceof HTMLElement && item.classList.contains('vaadin-menu-item')) {
          btn.appendChild(item);
          item.classList.remove('vaadin-menu-item');
        }
      }
      overflow.item = { children: [] };
      this._hasOverflow = false;

      // hide any overflowing buttons and put them in the 'overflow' button
      if (container.offsetWidth < container.scrollWidth) {
        this._hasOverflow = true;

        let i;
        for (i = buttons.length; i > 0; i--) {
          const btn = buttons[i - 1];
          const btnStyle = getComputedStyle(btn);

          const btnWidth = btn.offsetWidth;
          // if this button isn't overflowing, then the rest aren't either
          if (
            (!isRTL && btn.offsetLeft + btnWidth < container.offsetWidth - overflow.offsetWidth) ||
            (isRTL && btn.offsetLeft >= overflow.offsetWidth)
          ) {
            break;
          }

          btn.disabled = true;
          btn.style.visibility = 'hidden';
          btn.style.position = 'absolute';
          // save width for buttons with component
          btn.style.width = btnStyle.width;
        }
        overflow.item = {
          children: buttons.filter((b, idx) => idx >= i).map((b) => b.item)
        };
      }
      // optional chaining is not supported in IE
      const newOverflowCount = this.__getOverflowCount(overflow);
      if (oldOverflowCount !== newOverflowCount && this._subMenu.opened) {
        this._subMenu.close();
      }
    }

    /**
     * Call this method after updating menu bar `items` dynamically, including changing
     * any property on the item object corresponding to one of the menu bar buttons.
     *
     * @deprecated Since Vaadin 21, `render()` is deprecated. The `items` value is immutable. Please replace it with a new value instead of mutating in place.
     */
    render() {
      console.warn(
        'WARNING: Since Vaadin 21, render() is deprecated. The items value is immutable. Please replace it with a new value instead of mutating in place.'
      );

      if (!this.shadowRoot) {
        return;
      }

      this.__renderButtons(this.items);
    }

    /** @protected */
    _removeButtons() {
      while (this.children.length > 1) {
        this.removeChild(this.firstElementChild);
      }
    }

    /** @protected */
    _initButton(item) {
      const button = document.createElement('vaadin-menu-bar-button');

      const itemCopy = Object.assign({}, item);
      button.item = itemCopy;

      if (item.component) {
        const component = this.__getComponent(itemCopy);
        itemCopy.component = component;
        // save item for overflow menu
        component.item = itemCopy;
        button.appendChild(component);
      } else if (item.text) {
        button.textContent = item.text;
      }

      return button;
    }

    /** @protected */
    _initButtonAttrs(button) {
      button.setAttribute('role', 'menuitem');

      if (button === this._overflow || (button.item && button.item.children)) {
        button.setAttribute('aria-haspopup', 'true');
        button.setAttribute('aria-expanded', 'false');
      }
    }

    /** @protected */
    _setButtonDisabled(button, disabled) {
      button.disabled = disabled;
      button.setAttribute('tabindex', disabled ? '-1' : '0');
    }

    /**
     * @param {string | null} theme
     * @protected
     * @override
     */
    _setTheme(theme) {
      super._setTheme(theme);

      // Initializing, do nothing
      if (!this.shadowRoot) {
        return;
      }

      this.__applyTheme(theme);
    }

    /** @private */
    __applyTheme(theme) {
      this._buttons.forEach((btn) => {
        if (theme) {
          btn.setAttribute('theme', theme);
        } else {
          btn.removeAttribute('theme');
        }
      });

      this.__detectOverflow();
    }

    /** @protected */
    _appendButton(button) {
      this.insertBefore(button, this._overflow);
    }

    /** @private */
    __getComponent(item) {
      const itemComponent = item.component;
      let component;

      const isElement = itemComponent instanceof HTMLElement;
      // use existing item component, if any
      if (isElement && itemComponent.localName === 'vaadin-context-menu-item') {
        component = itemComponent;
      } else {
        component = document.createElement('vaadin-context-menu-item');
        component.appendChild(isElement ? itemComponent : document.createElement(itemComponent));
      }
      if (item.text) {
        const node = component.firstChild || component;
        node.textContent = item.text;
      }
      component.setAttribute('theme', 'menu-bar-item');
      return component;
    }

    /** @private */
    __renderButtons(items = []) {
      this._removeButtons();

      /* Empty array, do nothing */
      if (items.length === 0) {
        return;
      }

      items.forEach((item) => {
        const button = this._initButton(item);
        this._appendButton(button);
        this._setButtonDisabled(button, item.disabled);
        this._initButtonAttrs(button);
      });

      this.__applyTheme(this.theme);
    }

    /** @private */
    __onResize() {
      this.__debounceOverflow = Debouncer.debounce(
        this.__debounceOverflow,
        animationFrame,
        this.__detectOverflow.bind(this)
      );
    }
  };
