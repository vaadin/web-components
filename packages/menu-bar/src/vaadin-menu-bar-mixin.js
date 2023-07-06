/**
 * @license
 * Copyright (c) 2019 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { FocusMixin } from '@vaadin/a11y-base/src/focus-mixin.js';
import { isElementFocused, isKeyboardActive } from '@vaadin/a11y-base/src/focus-utils.js';
import { KeyboardDirectionMixin } from '@vaadin/a11y-base/src/keyboard-direction-mixin.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';

/**
 * @polymerMixin
 * @mixes ControllerMixin
 * @mixes FocusMixin
 * @mixes KeyboardDirectionMixin
 * @mixes ResizeMixin
 */
export const MenuBarMixin = (superClass) =>
  class MenuBarMixinClass extends KeyboardDirectionMixin(ResizeMixin(FocusMixin(ControllerMixin(superClass)))) {
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

        /** @protected */
        _overflow: {
          type: Object,
        },

        /** @protected */
        _container: {
          type: Object,
        },
      };
    }

    static get observers() {
      return [
        '_itemsChanged(items, items.splices)',
        '__hasOverflowChanged(_hasOverflow, _overflow)',
        '__i18nChanged(i18n, _overflow)',
        '_menuItemsChanged(items, _overflow, _container, items.splices)',
      ];
    }

    constructor() {
      super();
      this.__boundOnContextMenuKeydown = this.__onContextMenuKeydown.bind(this);
    }

    /**
     * Override getter from `KeyboardDirectionMixin`
     * to use expanded button for arrow navigation
     * when the sub-menu is opened and has focus.
     *
     * @return {Element | null}
     * @protected
     * @override
     */
    get focused() {
      return (this._getItems() || []).find(isElementFocused) || this._expandedButton;
    }

    /**
     * Override getter from `KeyboardDirectionMixin`.
     *
     * @return {boolean}
     * @protected
     * @override
     */
    get _vertical() {
      return false;
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
      return Array.from(this.querySelectorAll('vaadin-menu-bar-button'));
    }

    /** @private */
    get _subMenu() {
      return this.shadowRoot.querySelector('vaadin-menu-bar-submenu');
    }

    /** @protected */
    ready() {
      super.ready();

      this.setAttribute('role', 'menubar');

      this._overflowController = new SlotController(this, 'overflow', 'vaadin-menu-bar-button', {
        initializer: (btn) => {
          btn.setAttribute('hidden', '');

          const dots = document.createElement('div');
          dots.setAttribute('aria-hidden', 'true');
          dots.innerHTML = '&centerdot;'.repeat(3);
          btn.appendChild(dots);

          this._overflow = btn;
          this._initButtonAttrs(btn);
        },
      });
      this.addController(this._overflowController);

      this.addEventListener('mousedown', () => this._hideTooltip());
      this.addEventListener('mouseleave', () => this._hideTooltip());

      this._subMenu.addEventListener('item-selected', this.__onItemSelected.bind(this));
      this._subMenu.addEventListener('close-all-menus', this.__onEscapeClose.bind(this));

      const overlay = this._subMenu.$.overlay;
      overlay.addEventListener('keydown', this.__boundOnContextMenuKeydown);

      const container = this.shadowRoot.querySelector('[part="container"]');
      container.addEventListener('click', this.__onButtonClick.bind(this));
      container.addEventListener('mouseover', (e) => this._onMouseOver(e));

      this._container = container;
    }

    /**
     * Override method inherited from `KeyboardDirectionMixin`
     * to use the list of menu-bar buttons as items.
     *
     * @return {Element[]}
     * @protected
     * @override
     */
    _getItems() {
      return this._buttons;
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();
      this._hideTooltip(true);
    }

    /**
     * Implement callback from `ResizeMixin` to update buttons
     * and detect whether to show or hide the overflow button.
     *
     * @protected
     * @override
     */
    _onResize() {
      this.__detectOverflow();
    }

    /** @private */
    __hasOverflowChanged(hasOverflow, overflow) {
      if (overflow) {
        overflow.toggleAttribute('hidden', !hasOverflow);
      }
    }

    /** @private */
    _menuItemsChanged(items, overflow, container) {
      if (!overflow || !container) {
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
      buttons.forEach((button) => {
        button.disabled = (button.item && button.item.disabled) || this.disabled;
        button.style.visibility = '';
        button.style.position = '';

        // Teleport item component back from "overflow" sub-menu
        const item = button.item && button.item.component;
        if (item instanceof HTMLElement && item.getAttribute('role') === 'menuitem') {
          this.__restoreItem(button, item);
        }
      });
      this.__updateOverflow([]);
    }

    /** @private */
    __restoreItem(button, item) {
      button.appendChild(item);
      item.removeAttribute('role');
      item.removeAttribute('aria-expanded');
      item.removeAttribute('aria-haspopup');
      item.removeAttribute('tabindex');
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

        const isRTL = this.__isRTL;
        const containerLeft = container.getBoundingClientRect().left;

        let i;
        for (i = buttons.length; i > 0; i--) {
          const btn = buttons[i - 1];
          const btnStyle = getComputedStyle(btn);
          const btnLeft = btn.getBoundingClientRect().left - containerLeft;

          // If this button isn't overflowing, then the rest aren't either
          if (
            (!isRTL && btnLeft + btn.offsetWidth < container.offsetWidth - overflow.offsetWidth) ||
            (isRTL && btnLeft >= overflow.offsetWidth)
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

        const remaining = buttons.slice(0, i);
        // Ensure there is at least one button with tabindex set to 0
        // so that menu-bar is not skipped when navigating with Tab
        if (i > 0 && !remaining.some((btn) => btn.getAttribute('tabindex') === '0')) {
          this._setTabindex(remaining[i - 1], true);
        }
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
      if (isElement && itemComponent.localName === 'vaadin-menu-bar-item') {
        component = itemComponent;
      } else {
        component = document.createElement('vaadin-menu-bar-item');
        component.appendChild(isElement ? itemComponent : document.createElement(itemComponent));
      }
      if (item.text) {
        const node = component.firstChild || component;
        node.textContent = item.text;
      }
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
     * @param {HTMLElement} button
     * @protected
     */
    _showTooltip(button, isHover) {
      // Check if there is a slotted vaadin-tooltip element.
      const tooltip = this._tooltipController.node;
      if (tooltip && tooltip.isConnected) {
        // If the tooltip element doesn't have a generator assigned, use a default one
        // that reads the `tooltip` property of an item.
        if (tooltip.generator === undefined) {
          tooltip.generator = ({ item }) => item && item.tooltip;
        }

        if (!this._subMenu.opened) {
          this._tooltipController.setTarget(button);
          this._tooltipController.setContext({ item: button.item });

          // Trigger opening using the corresponding delay.
          tooltip._stateController.open({
            hover: isHover,
            focus: !isHover,
          });
        }
      }
    }

    /** @protected */
    _hideTooltip(immediate) {
      const tooltip = this._tooltipController && this._tooltipController.node;
      if (tooltip) {
        tooltip._stateController.close(immediate);
      }
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

    /**
     * Override method inherited from `KeyboardDirectionMixin`
     * to close the submenu for the previously focused button
     * and open another one for the newly focused button.
     *
     * @param {Element} item
     * @param {boolean} navigating
     * @protected
     * @override
     */
    _focusItem(item, navigating) {
      const wasExpanded = navigating && this.focused === this._expandedButton;
      if (wasExpanded) {
        this._close();
      }

      super._focusItem(item, navigating);

      this._buttons.forEach((btn) => {
        this._setTabindex(btn, btn === item);
      });

      if (wasExpanded && item.item && item.item.children) {
        this.__openSubMenu(item, true, { keepFocus: true });
      } else if (item === this._overflow) {
        this._hideTooltip();
      } else {
        this._showTooltip(item);
      }
    }

    /** @private */
    _getButtonFromEvent(e) {
      return Array.from(e.composedPath()).find((el) => el.localName === 'vaadin-menu-bar-button');
    }

    /**
     * Override method inherited from `FocusMixin`
     *
     * @param {boolean} focused
     * @override
     * @protected
     */
    _setFocused(focused) {
      if (focused) {
        const target = this.querySelector('[tabindex="0"]');
        if (target) {
          this._buttons.forEach((btn) => {
            this._setTabindex(btn, btn === target);
            if (btn === target && btn !== this._overflow && isKeyboardActive()) {
              this._showTooltip(btn);
            }
          });
        }
      } else {
        this._hideTooltip();
      }
    }

    /**
     * @param {!KeyboardEvent} event
     * @private
     */
    _onArrowDown(event) {
      // Prevent page scroll.
      event.preventDefault();

      const button = this._getButtonFromEvent(event);
      if (button === this._expandedButton) {
        // Menu opened previously, focus first item
        this._focusFirstItem();
      } else {
        this.__openSubMenu(button, true);
      }
    }

    /**
     * @param {!KeyboardEvent} event
     * @private
     */
    _onArrowUp(event) {
      // Prevent page scroll.
      event.preventDefault();

      const button = this._getButtonFromEvent(event);
      if (button === this._expandedButton) {
        // Menu opened previously, focus last item
        this._focusLastItem();
      } else {
        this.__openSubMenu(button, true, { focusLast: true });
      }
    }

    /**
     * Override an event listener from `KeyboardMixin`:
     * - to close the sub-menu for expanded button,
     * - to close a tooltip for collapsed button.
     *
     * @param {!KeyboardEvent} event
     * @protected
     * @override
     */
    _onEscape(event) {
      if (event.composedPath().includes(this._expandedButton)) {
        this._close(true);
      }

      this._hideTooltip(true);
    }

    /**
     * Override an event listener from `KeyboardMixin`.
     *
     * @param {!KeyboardEvent} event
     * @protected
     * @override
     */
    _onKeyDown(event) {
      switch (event.key) {
        case 'ArrowDown':
          this._onArrowDown(event);
          break;
        case 'ArrowUp':
          this._onArrowUp(event);
          break;
        default:
          super._onKeyDown(event);
          break;
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
      if (!button) {
        // Hide tooltip on mouseover to disabled button
        this._hideTooltip();
      } else if (button !== this._expandedButton) {
        const isOpened = this._subMenu.opened;
        if (button.item.children && (this.openOnHover || isOpened)) {
          this.__openSubMenu(button, false);
        } else if (isOpened) {
          this._close();
        }

        if (button === this._overflow || (this.openOnHover && button.item.children)) {
          this._hideTooltip();
        } else {
          this._showTooltip(button, true);
        }
      }
    }

    /** @private */
    __onContextMenuKeydown(e) {
      const item = Array.from(e.composedPath()).find((el) => el._item);
      if (item) {
        const list = item.parentNode;
        if (e.keyCode === 38 && item === list.items[0]) {
          this._close(true);
        }
        // ArrowLeft, or ArrowRight on non-parent submenu item
        if (e.keyCode === 37 || (e.keyCode === 39 && !item._item.children)) {
          // Prevent ArrowLeft from being handled in context-menu
          e.stopImmediatePropagation();
          this._onKeyDown(e);
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
        this.__openSubMenu(button, false);
      }
    }

    /** @private */
    __openSubMenu(button, keydown, options = {}) {
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
        this._hideTooltip(true);

        this._setExpanded(button, true);
      });

      this.style.pointerEvents = 'auto';

      overlay.addEventListener(
        'vaadin-overlay-open',
        () => {
          if (options.focusLast) {
            this._focusLastItem();
          }

          if (options.keepFocus) {
            this._focusItem(this._expandedButton, false);
          }

          // Do not focus item when open not from keyboard
          if (!keydown) {
            overlay.$.overlay.focus();
          }

          overlay._updatePosition();
        },
        { once: true },
      );
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
          this._focusItem(button, false);
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
