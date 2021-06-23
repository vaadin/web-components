/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { animationFrame } from '@polymer/polymer/lib/utils/async.js';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';
import { IronResizableBehavior } from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';

/**
 * @polymerMixin
 */
export const ButtonsMixin = (superClass) =>
  class extends mixinBehaviors(IronResizableBehavior, superClass) {
    static get properties() {
      return {
        /**
         * @type {boolean}
         * @protected
         */
        _hasOverflow: {
          type: Boolean,
          value: false
        }
      };
    }

    static get observers() {
      return ['_menuItemsChanged(items, items.splices)'];
    }

    /** @protected */
    ready() {
      super.ready();

      this.setAttribute('role', 'menubar');

      this.addEventListener('iron-resize', () => this.__onResize());

      this._overflow.setAttribute('role', 'menuitem');
      this._overflow.setAttribute('aria-haspopup', 'true');
      this._overflow.setAttribute('aria-expanded', 'false');
    }

    /**
     * @return {!Array<!HTMLElement>}
     * @protected
     */
    get _buttons() {
      return Array.from(this.shadowRoot.querySelectorAll('[part$="button"]'));
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
      return this.shadowRoot.querySelector('[part="overflow-button"]');
    }

    /** @private */
    _menuItemsChanged(items) {
      if (items !== this._oldItems) {
        this._oldItems = items;
        this.__renderButtons(items);
      }
    }

    /** @private */
    __detectOverflow() {
      const container = this._container;
      const buttons = this._buttons.slice(0);
      const overflow = buttons.pop();
      const isRTL = this.getAttribute('dir') === 'rtl';

      // reset all buttons in the menu bar and the overflow button
      for (let i = 0; i < buttons.length; i++) {
        const btn = buttons[i];
        btn.disabled = btn.item.disabled;
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

      if (this._subMenu.opened) {
        this._subMenu.close();
      }

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

    /** @private */
    __renderButtons(items = []) {
      const container = this._container;
      const overflow = this._overflow;

      while (container.children.length > 1) {
        container.removeChild(container.firstElementChild);
      }

      items.forEach((item) => {
        const button = document.createElement('vaadin-menu-bar-button');
        const itemCopy = Object.assign({}, item);
        button.item = itemCopy;

        const itemComponent = item.component;
        if (itemComponent) {
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
          itemCopy.component = component;
          // save item for overflow menu
          component.item = itemCopy;
          component.setAttribute('theme', 'menu-bar-item');
          button.appendChild(component);
        } else if (item.text) {
          button.textContent = item.text;
        }
        if (item.disabled) {
          button.disabled = true;
          button.setAttribute('tabindex', '-1');
        } else {
          button.setAttribute('tabindex', '0');
        }
        if (button.item.children) {
          button.setAttribute('aria-haspopup', 'true');
          button.setAttribute('aria-expanded', 'false');
        }
        button.setAttribute('part', 'menu-bar-button');
        if (this.theme && this.theme !== '') {
          button.setAttribute('theme', this.theme);
        }
        container.insertBefore(button, overflow);
        button.setAttribute('role', 'menuitem');
      });

      this.__detectOverflow();
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
