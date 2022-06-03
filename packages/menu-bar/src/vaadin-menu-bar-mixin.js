/**
 * @license
 * Copyright (c) 2019 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { KeyboardMixin } from '@vaadin/component-base/src/keyboard-mixin.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';

/**
 * @polymerMixin
 * @mixes KeyboardMixin
 * @mixes ResizeMixin
 */
export const MenuBarMixin = (superClass) =>
  class MenuBarMixinClass extends KeyboardMixin(ResizeMixin(superClass)) {
    static get properties() {
      return {
        /**
         * If true, the submenu will open on hover (mouseover) instead of click.
         * @attr {boolean} open-on-hover
         */
        openOnHover: {
          type: Boolean,
        },

        /**
         * @type {boolean}
         * @protected
         */
        _hasOverflow: {
          type: Boolean,
          value: false,
        },
      };
    }

    static get observers() {
      return ['_menuItemsChanged(items, items.splices)'];
    }

    constructor() {
      super();
      this.__boundOnContextMenuKeydown = this.__onContextMenuKeydown.bind(this);
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

    /** @protected */
    ready() {
      super.ready();

      this.setAttribute('role', 'menubar');

      this._initButtonAttrs(this._overflow);

      this.addEventListener('focusin', (e) => this._onFocusin(e));

      this._subMenu.addEventListener('item-selected', this.__onItemSelected.bind(this));
      this._subMenu.addEventListener('close-all-menus', this.__onEscapeClose.bind(this));

      const overlay = this._subMenu.$.overlay;
      overlay.addEventListener('keydown', this.__boundOnContextMenuKeydown);
      overlay.addEventListener('vaadin-overlay-open', this.__alignOverlayPosition.bind(this));

      const container = this._container;
      container.addEventListener('click', this.__onButtonClick.bind(this));
      container.addEventListener('mouseover', (e) => this._onMouseOver(e));
    }

    /** @private */
    get __isRTL() {
      return this.getAttribute('dir') === 'rtl';
    }

    /**
     * Implement resize callback from `ResizeMixin`.
     *
     * @protected
     * @override
     */
    _onResize() {
      this.__detectOverflow();
    }

    /** @private */
    _menuItemsChanged(items) {
      if (items !== this._oldItems) {
        this._oldItems = items;
        this.__renderButtons(items);
      }

      const subMenu = this._subMenu;
      if (subMenu && subMenu.opened) {
        subMenu.close();
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
    }

    /** @protected */
    _removeButtons() {
      const container = this._container;

      while (container.children.length > 1) {
        container.removeChild(container.firstElementChild);
      }
    }

    /** @protected */
    _initButton(item) {
      const button = document.createElement('vaadin-menu-bar-button');
      button.setAttribute('part', 'menu-bar-button');

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

    /** @protected */
    _appendButton(button) {
      this._container.insertBefore(button, this._overflow);
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
        this._appendButton(button);
        this._setButtonDisabled(button, item.disabled);
        this._initButtonAttrs(button);
        this._setButtonTheme(button, this._theme);
      });

      this.__detectOverflow();
    }

    /** @protected */
    _setExpanded(button, expanded) {
      button.toggleAttribute('expanded', expanded);
      button.toggleAttribute('active', expanded);
      button.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    }

    /** @protected */
    _setTabindex(button, focused) {
      button.setAttribute('tabindex', focused ? '0' : '-1');
    }

    /** @private */
    _focusButton(button) {
      button.focus();
      button.setAttribute('focus-ring', '');
      this._buttons.forEach((btn) => {
        this._setTabindex(btn, btn === button);
      });
    }

    /** @private */
    _getButtonFromEvent(e) {
      return Array.from(e.composedPath()).filter((el) => el.localName === 'vaadin-menu-bar-button')[0];
    }

    /** @private */
    _getCurrentButton() {
      return this.shadowRoot.activeElement || this._expandedButton;
    }

    /**
     * @param {!FocusEvent} event
     * @protected
     */
    _onFocusin() {
      const target = this.shadowRoot.querySelector('[part$="button"][tabindex="0"]');
      if (target) {
        this._buttons.forEach((btn) => {
          this._setTabindex(btn, btn === target);
        });
      }
    }

    /**
     * Override an event listener from `KeyboardMixin`.
     *
     * @param {!KeyboardEvent} event
     * @protected
     * @override
     */
    _onKeyDown(event) {
      const button = this._getButtonFromEvent(event);
      if (button) {
        if (event.keyCode === 40) {
          // ArrowDown, prevent page scroll
          event.preventDefault();
          if (button === this._expandedButton) {
            // Menu opened previously, focus first item
            this._focusFirstItem();
          } else {
            this.__openSubMenu(button, event);
          }
        } else if (event.keyCode === 38) {
          // ArrowUp, prevent page scroll
          event.preventDefault();
          if (button === this._expandedButton) {
            // Menu opened previously, focus last item
            this._focusLastItem();
          } else {
            this.__openSubMenu(button, event, { focusLast: true });
          }
        } else if (event.keyCode === 27 && button === this._expandedButton) {
          this._close(true);
        } else {
          this._navigateByKey(event);
        }
      }
    }

    /** @private */
    _navigateByKey(event) {
      // IE names for arrows do not include the Arrow prefix
      const key = event.key.replace(/^Arrow/, '');
      const buttons = this._buttons;
      const currentBtn = this._getCurrentButton();
      const currentIdx = buttons.indexOf(currentBtn);
      let idx;
      let increment;
      const dirIncrement = this.__isRTL ? -1 : 1;

      switch (key) {
        case 'Left':
          increment = -dirIncrement;
          idx = currentIdx - dirIncrement;
          break;
        case 'Right':
          increment = dirIncrement;
          idx = currentIdx + dirIncrement;
          break;
        case 'Home':
          increment = 1;
          idx = 0;
          break;
        case 'End':
          increment = -1;
          idx = buttons.length - 1;
          break;
        default:
        // Do nothing.
      }

      idx = this._getAvailableIndex(idx, increment, buttons);
      if (idx >= 0) {
        event.preventDefault();
        const btn = buttons[idx];
        const wasExpanded = currentBtn === this._expandedButton;
        if (wasExpanded) {
          this._close();
        }
        this._focusButton(btn);
        if (wasExpanded && btn.item && btn.item.children) {
          this.__openSubMenu(btn, event, { keepFocus: true });
        }
      }
    }

    /** @private */
    _getAvailableIndex(index, increment, buttons) {
      const totalItems = buttons.length;
      let idx = index;
      for (let i = 0; typeof idx === 'number' && i < totalItems; i++, idx += increment || 1) {
        if (idx < 0) {
          idx = totalItems - 1;
        } else if (idx >= totalItems) {
          idx = 0;
        }

        const btn = buttons[idx];
        if (!btn.disabled && !btn.hasAttribute('hidden')) {
          return idx;
        }
      }
      return -1;
    }

    /** @private */
    get _subMenu() {
      return this.shadowRoot.querySelector('vaadin-menu-bar-submenu');
    }

    /** @private */
    __alignOverlayPosition(e) {
      /* c8 ignore next */
      if (!this._expandedButton) {
        // When `openOnHover` is true, quickly moving cursor can close submenu,
        // so by the time when event listener gets executed button is null.
        // See https://github.com/vaadin/vaadin-menu-bar/issues/85
        return;
      }
      const overlay = e.target;
      const { width, height, left } = this._expandedButton.getBoundingClientRect();
      if (overlay.hasAttribute('bottom-aligned')) {
        overlay.style.bottom = `${parseInt(getComputedStyle(overlay).bottom) + height}px`;
      }
      const endAligned = overlay.hasAttribute('end-aligned');
      if (endAligned) {
        if (this.__isRTL) {
          overlay.style.left = `${left}px`;
        } else {
          overlay.style.right = `${parseInt(getComputedStyle(overlay).right) - width}px`;
        }
      }
    }

    /** @private */
    _itemsChanged() {
      const subMenu = this._subMenu;
      if (subMenu && subMenu.opened) {
        subMenu.close();
      }
    }

    /**
     * @param {!MouseEvent} e
     * @protected
     */
    _onMouseOver(e) {
      const button = this._getButtonFromEvent(e);
      if (button && button !== this._expandedButton) {
        const isOpened = this._subMenu.opened;
        if (button.item.children && (this.openOnHover || isOpened)) {
          this.__openSubMenu(button, e);
        } else if (isOpened) {
          this._close();
        }
      }
    }

    /** @private */
    __onContextMenuKeydown(e) {
      const item = Array.from(e.composedPath()).filter((el) => el._item)[0];
      if (item) {
        const list = item.parentNode;
        if (e.keyCode === 38 && item === list.items[0]) {
          this._close(true);
        }
        // ArrowLeft, or ArrowRight on non-parent submenu item
        if (e.keyCode === 37 || (e.keyCode === 39 && !item._item.children)) {
          // Prevent ArrowLeft from being handled in context-menu
          e.stopImmediatePropagation();
          this._navigateByKey(e);
          const button = this.shadowRoot.activeElement;
          if (button && button.item && button.item.children) {
            this.__openSubMenu(button, e, { keepFocus: true });
          }
        }
      }
    }

    /** @private */
    __fireItemSelected(value) {
      this.dispatchEvent(new CustomEvent('item-selected', { detail: { value } }));
    }

    /** @private */
    __onButtonClick(e) {
      e.stopPropagation();
      const button = this._getButtonFromEvent(e);
      if (button) {
        this.__openSubMenu(button, e);
      }
    }

    /** @private */
    __openSubMenu(button, event, options = {}) {
      const subMenu = this._subMenu;
      const item = button.item;

      if (subMenu.opened) {
        this._close();
        if (subMenu.listenOn === button) {
          return;
        }
      }

      const items = item && item.children;
      if (!items || items.length === 0) {
        this.__fireItemSelected(item);
        return;
      }

      subMenu.items = items;
      subMenu.listenOn = button;
      const overlay = subMenu.$.overlay;
      overlay.positionTarget = button;
      overlay.noVerticalOverlap = true;

      this._expandedButton = button;

      requestAnimationFrame(() => {
        button.dispatchEvent(
          new CustomEvent('opensubmenu', {
            detail: {
              children: items,
            },
          }),
        );

        this._setExpanded(button, true);
      });

      if (options.focusLast) {
        this.__onceOpened(() => this._focusLastItem());
      }

      if (options.keepFocus) {
        this.__onceOpened(() => {
          this._focusButton(this._expandedButton);
        });
      }

      this.__onceOpened(() => {
        // Do not focus item when open not from keyboard
        if (event.type !== 'keydown') {
          subMenu.$.overlay.$.overlay.focus();
        }
        overlay._updatePosition();
      });
    }

    /** @private */
    _focusFirstItem() {
      const list = this._subMenu.$.overlay.firstElementChild;
      list.focus();
    }

    /** @private */
    _focusLastItem() {
      const list = this._subMenu.$.overlay.firstElementChild;
      const item = list.items[list.items.length - 1];
      if (item) {
        item.focus();
      }
    }

    /** @private */
    __onceOpened(cb) {
      this.style.pointerEvents = 'auto';
      const overlay = this._subMenu.$.overlay;
      const listener = () => {
        cb();
        overlay.removeEventListener('vaadin-overlay-open', listener);
      };
      overlay.addEventListener('vaadin-overlay-open', listener);
    }

    /** @private */
    __onItemSelected(e) {
      e.stopPropagation();
      this._close();
      this.__fireItemSelected(e.detail.value);
    }

    /** @private */
    __onEscapeClose() {
      this.__deactivateButton(true);
    }

    /** @private */
    __deactivateButton(restoreFocus) {
      const button = this._expandedButton;
      if (button && button.hasAttribute('expanded')) {
        this._setExpanded(button, false);
        if (restoreFocus) {
          this._focusButton(button);
        }
        this._expandedButton = null;
      }
    }

    /**
     * @param {boolean} restoreFocus
     * @protected
     */
    _close(restoreFocus) {
      this.style.pointerEvents = '';
      this.__deactivateButton(restoreFocus);
      if (this._subMenu.opened) {
        this._subMenu.close();
      }
    }
  };
