/**
 * @license
 * Copyright (c) 2019 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';

/**
 * @polymerMixin
 * @mixes ResizeMixin
 * @mixes ControllerMixin
 */
export const ButtonsMixin = (superClass) =>
  class extends ResizeMixin(ControllerMixin(superClass)) {
    static get properties() {
      return {
        /**
         * @type {boolean}
         * @protected
         */
        _hasOverflow: {
          type: Boolean,
          value: false,
        },

        /** @protected */
        _overflow: {
          type: Object,
        },
      };
    }

    static get observers() {
      return [
        '__hasOverflowChanged(_hasOverflow, _overflow)',
        '__i18nChanged(i18n, _overflow)',
        '_menuItemsChanged(items, _overflow, items.splices)',
      ];
    }

    /**
     * Override getter from `ResizeMixin` to observe parent.
     *
     * @protected
     * @override
     */
    get _observeParent() {
      return true;
    }

    /** @protected */
    ready() {
      super.ready();

      this.setAttribute('role', 'menubar');

      this._overflowController = new SlotController(this, 'overflow', 'vaadin-menu-bar-button', (btn) => {
        btn.setAttribute('hidden', '');

        const dots = document.createElement('div');
        dots.setAttribute('aria-hidden', 'true');
        dots.textContent = '···';
        btn.appendChild(dots);

        this._overflow = btn;
        this._initButtonAttrs(btn);
      });
      this.addController(this._overflowController);
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

    /** @private */
    __hasOverflowChanged(hasOverflow, overflow) {
      if (overflow) {
        overflow.toggleAttribute('hidden', !hasOverflow);
      }
    }

    /** @private */
    _menuItemsChanged(items, overflow) {
      if (!overflow) {
        return;
      }

      if (items !== this._oldItems) {
        this._oldItems = items;
        this.__renderButtons(items);
      }
    }

    /** @private */
    __i18nChanged(i18n, overflow) {
      if (overflow && i18n && i18n.moreOptions !== undefined) {
        if (i18n.moreOptions) {
          overflow.setAttribute('aria-label', i18n.moreOptions);
        } else {
          overflow.removeAttribute('aria-label');
        }
      }
    }

    /** @private */
    __getOverflowCount(overflow) {
      // We can't use optional chaining due to webpack 4
      return (overflow.item && overflow.item.children && overflow.item.children.length) || 0;
    }

    /** @private */
    __restoreButtons(buttons) {
      for (let i = 0; i < buttons.length; i++) {
        const btn = buttons[i];
        btn.disabled = (btn.item && btn.item.disabled) || this.disabled;
        btn.style.visibility = '';
        btn.style.position = '';

        // Teleport item component back from "overflow" sub-menu
        const item = btn.item && btn.item.component;
        if (item instanceof HTMLElement && item.classList.contains('vaadin-menu-item')) {
          btn.appendChild(item);
          item.classList.remove('vaadin-menu-item');
        }
      }
      this.__updateOverflow([]);
    }

    /** @private */
    __updateOverflow(items) {
      this._overflow.item = { children: items };
      this._hasOverflow = items.length > 0;
    }

    /** @private */
    __setOverflowItems(buttons, overflow) {
      const container = this._container;

      if (container.offsetWidth < container.scrollWidth) {
        this._hasOverflow = true;

        const isRTL = this.getAttribute('dir') === 'rtl';

        let i;
        for (i = buttons.length; i > 0; i--) {
          const btn = buttons[i - 1];
          const btnStyle = getComputedStyle(btn);

          // If this button isn't overflowing, then the rest aren't either
          if (
            (!isRTL && btn.offsetLeft + btn.offsetWidth < container.offsetWidth - overflow.offsetWidth) ||
            (isRTL && btn.offsetLeft >= overflow.offsetWidth)
          ) {
            break;
          }

          btn.disabled = true;
          btn.style.visibility = 'hidden';
          btn.style.position = 'absolute';
          // Save width for buttons with component
          btn.style.width = btnStyle.width;
        }
        const items = buttons.filter((_, idx) => idx >= i).map((b) => b.item);
        this.__updateOverflow(items);
      }
    }

    /** @private */
    __detectOverflow() {
      const overflow = this._overflow;
      const buttons = this._buttons.filter((btn) => btn !== overflow);
      const oldOverflowCount = this.__getOverflowCount(overflow);

      // Reset all buttons in the menu bar and the overflow button
      this.__restoreButtons(buttons);

      // Hide any overflowing buttons and put them in the 'overflow' button
      this.__setOverflowItems(buttons, overflow);

      const newOverflowCount = this.__getOverflowCount(overflow);
      if (oldOverflowCount !== newOverflowCount && this._subMenu.opened) {
        this._subMenu.close();
      }

      const isSingleButton = newOverflowCount === buttons.length || (newOverflowCount === 0 && buttons.length === 1);
      this.toggleAttribute('has-single-button', isSingleButton);
    }

    /** @protected */
    _removeButtons() {
      this._buttons.forEach((button) => {
        if (button !== this._overflow) {
          this.removeChild(button);
        }
      });
    }

    /** @protected */
    _initButton(item) {
      const button = document.createElement('vaadin-menu-bar-button');

      const itemCopy = { ...item };
      button.item = itemCopy;

      if (item.component) {
        const component = this.__getComponent(itemCopy);
        itemCopy.component = component;
        // Save item for overflow menu
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

    /** @protected */
    _setButtonTheme(btn, hostTheme) {
      let theme = hostTheme;

      // Item theme takes precedence over host theme even if it's empty, as long as it's not undefined or null
      const itemTheme = btn.item && btn.item.theme;
      if (itemTheme != null) {
        theme = Array.isArray(itemTheme) ? itemTheme.join(' ') : itemTheme;
      }

      if (theme) {
        btn.setAttribute('theme', theme);
      } else {
        btn.removeAttribute('theme');
      }
    }

    /** @private */
    __getComponent(item) {
      const itemComponent = item.component;
      let component;

      const isElement = itemComponent instanceof HTMLElement;
      // Use existing item component, if any
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
        this.insertBefore(button, this._overflow);
        this._setButtonDisabled(button, item.disabled);
        this._initButtonAttrs(button);
        this._setButtonTheme(button, this._theme);
      });

      this.__detectOverflow();
    }

    /**
     * @protected
     * @override
     */
    _onResize() {
      this.__detectOverflow();
    }
  };
