/**
 * @license
 * Copyright (c) 2019 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { FocusMixin } from '@vaadin/component-base/src/focus-mixin.js';
import { isKeyboardActive } from '@vaadin/component-base/src/focus-utils.js';
import { KeyboardMixin } from '@vaadin/component-base/src/keyboard-mixin.js';

/**
 * @polymerMixin
 * @mixes FocusMixin
 * @mixes KeyboardMixin
 */
export const InteractionsMixin = (superClass) =>
  class InteractionsMixin extends KeyboardMixin(FocusMixin(superClass)) {
    static get properties() {
      return {
        /**
         * If true, the submenu will open on hover (mouseover) instead of click.
         * @attr {boolean} open-on-hover
         */
        openOnHover: {
          type: Boolean,
        },
      };
    }

    constructor() {
      super();
      this.__boundOnContextMenuKeydown = this.__onContextMenuKeydown.bind(this);
    }

    static get observers() {
      return ['_itemsChanged(items, items.splices)'];
    }

    /** @protected */
    ready() {
      super.ready();

      this.addEventListener('mousedown', () => this._hideTooltip());
      this.addEventListener('mouseleave', () => this._hideTooltip());

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

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();
      this._hideTooltip();
    }

    /**
     * @param {HTMLElement} button
     * @protected
     */
    _showTooltip(button) {
      // Check if there is a slotted vaadin-tooltip element.
      if (this._tooltipController.node && this._tooltipController.node.isConnected && !this._subMenu.opened) {
        this._tooltipController.setTarget(button);
        this._tooltipController.setContext({ item: button.item });
        this._tooltipController.setOpened(true);
      }
    }

    /** @protected */
    _hideTooltip() {
      this._tooltipController.setOpened(false);
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

      if (button === this._overflow) {
        this._hideTooltip();
      } else {
        this._showTooltip(button);
      }
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
     * Override method inherited from `FocusMixin`
     *
     * @param {boolean} focused
     * @override
     * @protected
     */
    _setFocused(focused) {
      if (focused) {
        const target = this.shadowRoot.querySelector('[part$="button"][tabindex="0"]');
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
        this.__openSubMenu(button, event);
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
        this.__openSubMenu(button, event, { focusLast: true });
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
      } else {
        this._hideTooltip();
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
      switch (event.key) {
        case 'ArrowDown':
          this._onArrowDown(event);
          break;
        case 'ArrowUp':
          this._onArrowUp(event);
          break;
        default:
          super._onKeyDown(event);

          this._navigateByKey(event);
          break;
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

        if (button === this._overflow || (this.openOnHover && button.item.children)) {
          this._hideTooltip();
        } else {
          this._showTooltip(button);
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
        this._hideTooltip();

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
            this._focusButton(this._expandedButton);
          }

          // Do not focus item when open not from keyboard
          if (event.type !== 'keydown') {
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
