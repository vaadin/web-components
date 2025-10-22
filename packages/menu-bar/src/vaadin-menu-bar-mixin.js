/**
 * @license
 * Copyright (c) 2019 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, noChange, nothing, render } from 'lit';
import { Directive, directive } from 'lit/directive.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { DisabledMixin } from '@vaadin/a11y-base/src/disabled-mixin.js';
import { FocusMixin } from '@vaadin/a11y-base/src/focus-mixin.js';
import { isElementFocused, isElementHidden, isKeyboardActive } from '@vaadin/a11y-base/src/focus-utils.js';
import { KeyboardDirectionMixin } from '@vaadin/a11y-base/src/keyboard-direction-mixin.js';
import { microTask } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { I18nMixin } from '@vaadin/component-base/src/i18n-mixin.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';

/**
 * Custom Lit directive for rendering item components
 * inspired by the `flowComponentDirective` logic.
 */
class ItemComponentDirective extends Directive {
  update(part, [{ component, text }]) {
    const { parentNode, startNode } = part;

    const newNode = component || (text ? document.createTextNode(text) : null);
    const oldNode = this.getOldNode(part);

    if (oldNode === newNode) {
      return noChange;
    } else if (oldNode && newNode) {
      parentNode.replaceChild(newNode, oldNode);
    } else if (oldNode) {
      parentNode.removeChild(oldNode);
    } else if (newNode) {
      startNode.after(newNode);
    }

    return noChange;
  }

  getOldNode(part) {
    const { startNode, endNode } = part;
    if (startNode.nextSibling === endNode) {
      return null;
    }
    return startNode.nextSibling;
  }
}

const componentDirective = directive(ItemComponentDirective);

const DEFAULT_I18N = {
  moreOptions: 'More options',
};

/**
 * @polymerMixin
 * @mixes DisabledMixin
 * @mixes FocusMixin
 * @mixes I18nMixin
 * @mixes KeyboardDirectionMixin
 * @mixes ResizeMixin
 */
export const MenuBarMixin = (superClass) =>
  class MenuBarMixinClass extends I18nMixin(
    DEFAULT_I18N,
    KeyboardDirectionMixin(ResizeMixin(FocusMixin(DisabledMixin(superClass)))),
  ) {
    static get properties() {
      return {
        /**
         * @typedef MenuBarItem
         * @type {object}
         * @property {string} text - Text to be set as the menu button component's textContent.
         * @property {string} tooltip - Text to be set as the menu button's tooltip.
         * Requires a `<vaadin-tooltip slot="tooltip">` element to be added inside the `<vaadin-menu-bar>`.
         * @property {string | HTMLElement} component - The component to represent the button content.
         * Either a tagName or an element instance. Defaults to "vaadin-menu-bar-item".
         * @property {boolean} disabled - If true, the button is disabled and cannot be activated.
         * @property {string | string[]} theme - Theme(s) to be set as the theme attribute of the button, overriding any theme set on the menu bar.
         * @property {SubMenuItem[]} children - Array of submenu items.
         */

        /**
         * @typedef SubMenuItem
         * @type {object}
         * @property {string} text - Text to be set as the menu item component's textContent.
         * @property {string | HTMLElement} component - The component to represent the item.
         * Either a tagName or an element instance. Defaults to "vaadin-menu-bar-item".
         * @property {boolean} disabled - If true, the item is disabled and cannot be selected.
         * @property {boolean} checked - If true, the item shows a checkmark next to it.
         * @property {SubMenuItem[]} children - Array of child submenu items.
         */

        /**
         * Defines a hierarchical structure, where root level items represent menu bar buttons,
         * and `children` property configures a submenu with items to be opened below
         * the button on click, Enter, Space, Up and Down arrow keys.
         *
         * #### Example
         *
         * ```js
         * menubar.items = [
         *   {
         *     text: 'File',
         *     className: 'file',
         *     children: [
         *       {text: 'Open', className: 'file open'}
         *       {text: 'Auto Save', checked: true},
         *     ]
         *   },
         *   {component: 'hr'},
         *   {
         *     text: 'Edit',
         *     children: [
         *       {text: 'Undo', disabled: true},
         *       {text: 'Redo'}
         *     ]
         *   },
         *   {text: 'Help'}
         * ];
         * ```
         *
         * #### Disabled buttons
         *
         * When disabled, menu bar buttons (root-level items) are rendered
         * as "dimmed" and prevent all user interactions (mouse and keyboard).
         *
         * Since disabled buttons are not focusable and cannot react to hover
         * events by default, it can cause accessibility issues by making them
         * entirely invisible to assistive technologies, and prevents the use
         * of Tooltips to explain why the action is not available. This can be
         * addressed by enabling the feature flag `accessibleDisabledButtons`,
         * which makes disabled buttons focusable and hoverable, while still
         * preventing them from being triggered:
         *
         * ```js
         * // Set before any menu bar is attached to the DOM.
         * window.Vaadin.featureFlags.accessibleDisabledButtons = true;
         * ```
         *
         * @type {!Array<!MenuBarItem>}
         */
        items: {
          type: Array,
          sync: true,
          value: () => [],
        },

        /**
         * If true, the submenu will open on hover (mouseover) instead of click.
         * @attr {boolean} open-on-hover
         */
        openOnHover: {
          type: Boolean,
        },

        /**
         * If true, the buttons will be collapsed into the overflow menu
         * starting from the "start" end of the bar instead of the "end".
         * @attr {boolean} reverse-collapse
         */
        reverseCollapse: {
          type: Boolean,
          sync: true,
        },

        /**
         * If true, the top-level menu items is traversable by tab
         * instead of arrow keys (i.e. disabling roving tabindex)
         * @attr {boolean} tab-navigation
         */
        tabNavigation: {
          type: Boolean,
          sync: true,
        },
      };
    }

    /**
     * The object used to localize this component. To change the default
     * localization, replace this with an object that provides all properties, or
     * just the individual properties you want to change.
     *
     * The object has the following JSON structure and default values:
     * ```js
     * {
     *   moreOptions: 'More options'
     * }
     * ```
     * @return {!MenuBarI18n}
     */
    get i18n() {
      return super.i18n;
    }

    set i18n(value) {
      super.i18n = value;
    }

    constructor() {
      super();
      this.__boundOnContextMenuKeydown = this.__onContextMenuKeydown.bind(this);
      this.__boundOnTooltipMouseLeave = this.__onTooltipOverlayMouseLeave.bind(this);
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
     * Override getter from `KeyboardDirectionMixin`.
     *
     * @return {boolean}
     * @protected
     * @override
     */
    get _tabNavigation() {
      return this.tabNavigation;
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
    get _hasOverflow() {
      return this._overflow && !this._overflow.hasAttribute('hidden');
    }

    /** @private */
    set _hasOverflow(hasOverflow) {
      if (this._overflow) {
        this._overflow.toggleAttribute('hidden', !hasOverflow);
      }
    }

    /** @protected */
    ready() {
      super.ready();

      this.setAttribute('role', 'menubar');

      this._subMenuController = new SlotController(this, 'submenu', 'vaadin-menu-bar-submenu', {
        initializer: (menu) => {
          menu.setAttribute('is-root', '');

          menu.addEventListener('item-selected', this.__onItemSelected.bind(this));
          menu.addEventListener('close-all-menus', this.__onEscapeClose.bind(this));

          const overlay = menu._overlayElement;
          overlay._contentRoot.addEventListener('keydown', this.__boundOnContextMenuKeydown);

          this._subMenu = menu;
        },
      });

      this._overflowController = new SlotController(this, 'overflow', 'vaadin-menu-bar-button', {
        initializer: (btn) => {
          btn.setAttribute('hidden', '');

          const dots = document.createElement('div');
          dots.setAttribute('aria-hidden', 'true');
          dots.innerHTML = '&centerdot;'.repeat(3);
          btn.appendChild(dots);

          btn.setAttribute('aria-haspopup', 'true');
          btn.setAttribute('aria-expanded', 'false');
          btn.setAttribute('role', this.tabNavigation ? 'button' : 'menuitem');

          this._overflow = btn;
        },
      });

      this.addController(this._subMenuController);
      this.addController(this._overflowController);

      this.addEventListener('mousedown', () => this._hideTooltip(true));
      this.addEventListener('mouseleave', () => this._hideTooltip());

      this._container = this.shadowRoot.querySelector('[part="container"]');
    }

    /** @protected */
    updated(props) {
      super.updated(props);

      if (props.has('items') || props.has('_theme') || props.has('disabled')) {
        this.__renderButtons(this.items);
      }

      if (props.has('items') || props.has('_theme') || props.has('reverseCollapse')) {
        this.__scheduleOverflow();
      }

      if (props.has('items')) {
        this.__updateSubMenu();
      }

      if (props.has('_theme')) {
        this._themeChanged(this._theme);
      }

      if (props.has('disabled')) {
        this._overflow.toggleAttribute('disabled', this.disabled);
      }

      if (props.has('tabNavigation')) {
        this._tabNavigationChanged(this.tabNavigation);
      }

      if (props.has('__effectiveI18n')) {
        this.__i18nChanged(this.__effectiveI18n);
      }
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
      this.__scheduleOverflow();
    }

    /** @private */
    _themeChanged(theme) {
      if (theme) {
        this._overflow.setAttribute('theme', theme);
        this._subMenu.setAttribute('theme', theme);
      } else {
        this._overflow.removeAttribute('theme');
        this._subMenu.removeAttribute('theme');
      }
    }

    /** @private */
    _tabNavigationChanged(tabNavigation) {
      const target = this.querySelector('[tabindex="0"]');
      this._buttons.forEach((btn) => {
        if (target) {
          this._setTabindex(btn, btn === target);
        } else {
          this._setTabindex(btn, false);
        }
        btn.setAttribute('role', tabNavigation ? 'button' : 'menuitem');
      });

      this.setAttribute('role', tabNavigation ? 'group' : 'menubar');
    }

    /** @private */
    __updateSubMenu() {
      const subMenu = this._subMenu;
      if (subMenu && subMenu.opened) {
        const button = subMenu._positionTarget;

        // Close sub-menu if the corresponding button is no longer in the DOM,
        // or if the item on it has been changed to no longer have children.
        if (!button.isConnected || !Array.isArray(button.item.children) || button.item.children.length === 0) {
          subMenu.close();
        }
      }
    }

    /** @private */
    __i18nChanged(effectiveI18n) {
      if (effectiveI18n && effectiveI18n.moreOptions !== undefined) {
        if (effectiveI18n.moreOptions) {
          this._overflow.setAttribute('aria-label', effectiveI18n.moreOptions);
        } else {
          this._overflow.removeAttribute('aria-label');
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
        button.style.visibility = '';
        button.style.position = '';
        button.style.width = '';

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
        const containerLeft = container.offsetLeft;

        const remaining = [...buttons];
        while (remaining.length) {
          const lastButton = remaining[remaining.length - 1];
          const btnLeft = lastButton.offsetLeft - containerLeft;

          // If this button isn't overflowing, then the rest aren't either
          if (
            (!isRTL && btnLeft + lastButton.offsetWidth < container.offsetWidth - overflow.offsetWidth) ||
            (isRTL && btnLeft >= overflow.offsetWidth)
          ) {
            break;
          }

          const btn = this.reverseCollapse ? remaining.shift() : remaining.pop();

          // Save width for buttons with component
          btn.style.width = getComputedStyle(btn).width;
          btn.style.visibility = 'hidden';
          btn.style.position = 'absolute';
        }

        const items = buttons.filter((b) => !remaining.includes(b)).map((b) => b.item);
        this.__updateOverflow(items);
      }
    }

    /** @private */
    __scheduleOverflow() {
      this._overflowDebouncer = Debouncer.debounce(this._overflowDebouncer, microTask, () => {
        this.__detectOverflow();
      });
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

      // Collect visible buttons to detect if tabindex should be updated
      const visibleButtons = buttons.filter((btn) => btn.style.visibility !== 'hidden');

      if (!visibleButtons.length) {
        // If all buttons except overflow are hidden, set tabindex on it
        this._overflow.setAttribute('tabindex', '0');
      } else if (!visibleButtons.some((btn) => btn.getAttribute('tabindex') === '0')) {
        // Ensure there is at least one button with tabindex set to 0
        // so that menu-bar is not skipped when navigating with Tab
        this._setTabindex(visibleButtons[visibleButtons.length - 1], true);
      }

      // Apply first/last visible attributes to the visible buttons
      visibleButtons.forEach((btn, index, visibleButtons) => {
        btn.toggleAttribute('first-visible', index === 0);
        btn.toggleAttribute('last-visible', !this._hasOverflow && index === visibleButtons.length - 1);
      });
    }

    /** @private */
    __getButtonTheme(item, hostTheme) {
      let theme = hostTheme;

      // Item theme takes precedence over host theme even if it's empty, as long as it's not undefined or null
      const itemTheme = item && item.theme;
      if (itemTheme != null) {
        theme = Array.isArray(itemTheme) ? itemTheme.join(' ') : itemTheme;
      }

      return theme;
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
      render(
        html`
          ${items.map((item) => {
            const itemCopy = { ...item };
            const hasChildren = Boolean(item && item.children);

            if (itemCopy.component) {
              const component = this.__getComponent(itemCopy);
              itemCopy.component = component;
              component.item = itemCopy;
            }

            return html`
              <vaadin-menu-bar-button
                .item="${itemCopy}"
                .disabled="${this.disabled || item.disabled}"
                role="${this.tabNavigation ? 'button' : 'menuitem'}"
                aria-haspopup="${ifDefined(hasChildren ? 'true' : nothing)}"
                aria-expanded="${ifDefined(hasChildren ? 'false' : nothing)}"
                class="${ifDefined(item.className || nothing)}"
                theme="${ifDefined(this.__getButtonTheme(item, this._theme) || nothing)}"
                @click="${this.__onRootButtonClick}"
                >${componentDirective(itemCopy)}</vaadin-menu-bar-button
              >
            `;
          })}
        `,
        this,
        { renderBefore: this._overflow },
      );
    }

    /** @private */
    __onRootButtonClick(event) {
      const button = event.target;
      // Propagate click event from button to the item component if it was outside
      // it e.g. by calling `click()` on the button (used by the Flow counterpart).
      if (button.item && button.item.component && !event.composedPath().includes(button.item.component)) {
        event.stopPropagation();
        button.item.component.click();
      }
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

        if (!tooltip._mouseLeaveListenerAdded) {
          tooltip._overlayElement.addEventListener('mouseleave', this.__boundOnTooltipMouseLeave);
          tooltip._mouseLeaveListenerAdded = true;
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
        this._tooltipController.setContext({ item: null });
        tooltip._stateController.close(immediate);
      }
    }

    /** @private */
    __onTooltipOverlayMouseLeave(event) {
      if (event.relatedTarget !== this._tooltipController.target) {
        this._hideTooltip();
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
      if (this.tabNavigation && this._isItemFocusable(button)) {
        button.setAttribute('tabindex', '0');
      } else {
        button.setAttribute('tabindex', focused ? '0' : '-1');
      }
    }

    /**
     * Override method inherited from `KeyboardDirectionMixin`
     * to close the submenu for the previously focused button
     * and open another one for the newly focused button.
     *
     * @param {Element} item
     * @param {FocusOptions=} options
     * @param {boolean} navigating
     * @protected
     * @override
     */
    _focusItem(item, options, navigating) {
      const wasExpanded = navigating && this.focused === this._expandedButton;
      if (wasExpanded) {
        this._close();
      }

      super._focusItem(item, options, navigating);

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
     * @override
     * @protected
     */
    _shouldSetFocus(event) {
      // Ignore events from the submenu
      if (event.composedPath().includes(this._subMenu)) {
        return false;
      }
      return super._shouldSetFocus(event);
    }

    /**
     * Override method inherited from `FocusMixin`
     *
     * @override
     * @protected
     */
    _shouldRemoveFocus(event) {
      // Ignore events from the submenu
      if (event.composedPath().includes(this._subMenu)) {
        return false;
      }
      return super._shouldRemoveFocus(event);
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
        const target = this.__getFocusTarget();
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

    /** @private */
    __getFocusTarget() {
      // First, check if focus is moving to a visible button
      let target = this._buttons.find((btn) => isElementFocused(btn));

      if (!target) {
        const selector = this.tabNavigation ? '[focused]' : '[tabindex="0"]';
        // Next, check if there is a button that could be focused but is hidden
        target = this.querySelector(`vaadin-menu-bar-button${selector}`);

        if (isElementHidden(target)) {
          target = this._buttons[this._getFocusableIndex()];
        }
      }

      return target;
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
      // Ignore events from the submenu
      if (event.composedPath().includes(this._subMenu)) {
        return;
      }

      this._handleKeyDown(event);
    }

    /** @private */
    _handleKeyDown(event) {
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

    /**
     * @param {!MouseEvent} event
     * @protected
     */
    _onMouseOver(event) {
      // Ignore events from the submenu
      if (event.composedPath().includes(this._subMenu)) {
        return;
      }

      const button = this._getButtonFromEvent(event);
      if (!button) {
        // Hide tooltip on mouseover to disabled button
        this._hideTooltip();
      } else if (button !== this._expandedButton) {
        // Switch sub-menu when moving cursor over another button
        // with children, regardless of whether openOnHover is set.
        // If the button has no children, keep the sub-menu opened.
        if (button.item.children && (this.openOnHover || this._subMenu.opened)) {
          this.__openSubMenu(button, false);
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
        // ArrowLeft, or ArrowRight on non-parent submenu item,
        if (e.keyCode === 37 || (e.keyCode === 39 && !item._item.children)) {
          // Prevent ArrowLeft from being handled in context-menu
          e.stopImmediatePropagation();
          this._handleKeyDown(e);
        }

        if (e.key === 'Tab' && this.tabNavigation) {
          this._handleKeyDown(e);
        }
      }
    }

    /** @private */
    __fireItemSelected(value) {
      this.dispatchEvent(new CustomEvent('item-selected', { detail: { value } }));
    }

    /** @private */
    __onButtonClick(e) {
      const button = this._getButtonFromEvent(e);
      if (button) {
        this.__openSubMenu(button, button.__triggeredWithActiveKeys);
      }
    }

    /** @private */
    __openSubMenu(button, keydown, options = {}) {
      if (button.disabled) {
        return;
      }

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
      subMenu._positionTarget = button;
      const overlay = subMenu._overlayElement;
      overlay.noVerticalOverlap = true;

      this._hideTooltip(true);

      this._expandedButton = button;
      this._setExpanded(button, true);

      this.style.pointerEvents = 'auto';

      button.dispatchEvent(
        new CustomEvent('opensubmenu', {
          detail: {
            children: items,
          },
        }),
      );

      overlay.addEventListener(
        'vaadin-overlay-open',
        () => {
          if (options.focusLast) {
            this._focusLastItem();
          }

          if (options.keepFocus) {
            const focusOptions = { focusVisible: isKeyboardActive() };
            this._focusItem(this._expandedButton, focusOptions, false);
          }

          // Do not focus item when open not from keyboard
          if (!keydown) {
            overlay.$.overlay.focus();
          }
        },
        { once: true },
      );
    }

    /** @private */
    _focusFirstItem() {
      const list = this._subMenu._overlayElement._contentRoot.firstElementChild;
      list.focus();
    }

    /** @private */
    _focusLastItem() {
      const list = this._subMenu._overlayElement._contentRoot.firstElementChild;
      const item = list.items[list.items.length - 1];
      if (item) {
        item.focus();
      }
    }

    /** @private */
    __onItemSelected(e) {
      e.stopPropagation();
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
          const focusOptions = { focusVisible: isKeyboardActive() };
          this._focusItem(button, focusOptions, false);
        }
        this._expandedButton = null;
      }
    }

    /**
     * @param {boolean} restoreFocus
     * @protected
     */
    _close(restoreFocus = false) {
      this.style.pointerEvents = '';
      this.__deactivateButton(restoreFocus);
      if (this._subMenu.opened) {
        this._subMenu.close();
      }
    }

    /**
     * Closes the current submenu.
     */
    close() {
      this._close();
    }

    /**
     * Override method inherited from `KeyboardDirectionMixin` to allow
     * focusing disabled buttons that are configured so.
     *
     * @param {Element} button
     * @protected
     * @override
     */
    _isItemFocusable(button) {
      if (button.disabled && button.__shouldAllowFocusWhenDisabled) {
        return button.__shouldAllowFocusWhenDisabled();
      }

      return super._isItemFocusable(button);
    }
  };
