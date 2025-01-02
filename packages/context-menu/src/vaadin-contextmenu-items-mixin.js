/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { isTouch } from '@vaadin/component-base/src/browser-utils.js';

/**
 * @polymerMixin
 */
export const ItemsMixin = (superClass) =>
  class ItemsMixin extends superClass {
    static get properties() {
      return {
        /**
         * @typedef ContextMenuItem
         * @type {object}
         * @property {string} text - Text to be set as the menu item component's textContent
         * @property {union: string | object} component - The component to represent the item.
         * Either a tagName or an element instance. Defaults to "vaadin-context-menu-item".
         * @property {boolean} disabled - If true, the item is disabled and cannot be selected
         * @property {boolean} checked - If true, the item shows a checkmark next to it
         * @property {boolean} keepOpen - If true, the menu will not be closed on item selection
         * @property {string} className - A space-delimited list of CSS class names to be set on the menu item component.
         * @property {union: string | string[]} theme - If set, sets the given theme(s) as an attribute to the menu item component, overriding any theme set on the context menu.
         * @property {MenuItem[]} children - Array of child menu items
         */

        /**
         * Defines a (hierarchical) menu structure for the component.
         * If a menu item has a non-empty `children` set, a sub-menu with the child items is opened
         * next to the parent menu on mouseover, tap or a right arrow keypress.
         *
         * The items API can't be used together with a renderer!
         *
         * #### Example
         *
         * ```javascript
         * contextMenu.items = [
         *   { text: 'Menu Item 1', theme: 'primary', className: 'first', children:
         *     [
         *       { text: 'Menu Item 1-1', checked: true, keepOpen: true },
         *       { text: 'Menu Item 1-2' }
         *     ]
         *   },
         *   { component: 'hr' },
         *   { text: 'Menu Item 2', children:
         *     [
         *       { text: 'Menu Item 2-1' },
         *       { text: 'Menu Item 2-2', disabled: true }
         *     ]
         *   },
         *   { text: 'Menu Item 3', disabled: true, className: 'last' }
         * ];
         * ```
         *
         * @type {!Array<!ContextMenuItem> | undefined}
         */
        items: {
          type: Array,
          sync: true,
        },
      };
    }

    constructor() {
      super();

      // Overlay's outside click listener doesn't work with modeless
      // overlays (submenus) so we need additional logic for it
      this.__itemsOutsideClickListener = (e) => {
        if (this._shouldCloseOnOutsideClick(e)) {
          this.dispatchEvent(new CustomEvent('items-outside-click'));
        }
      };
      this.addEventListener('items-outside-click', () => {
        this.items && this.close();
      });
    }

    /**
     * Tag name prefix used by overlay, list-box and items.
     * @protected
     * @return {string}
     */
    get _tagNamePrefix() {
      return 'vaadin-context-menu';
    }

    /** @protected */
    connectedCallback() {
      super.connectedCallback();
      // Firefox leaks click to document on contextmenu even if prevented
      // https://bugzilla.mozilla.org/show_bug.cgi?id=990614
      document.documentElement.addEventListener('click', this.__itemsOutsideClickListener);
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();
      document.documentElement.removeEventListener('click', this.__itemsOutsideClickListener);
    }

    /**
     * Whether to close the overlay on outside click or not.
     * Override this method to customize the closing logic.
     *
     * @param {Event} event
     * @return {boolean}
     * @protected
     */
    _shouldCloseOnOutsideClick(event) {
      return !event.composedPath().some((el) => el.localName === `${this._tagNamePrefix}-overlay`);
    }

    /** @protected */
    __forwardFocus() {
      const overlay = this._overlayElement;
      const child = overlay.getFirstChild();
      // If parent item is not focused, do not focus submenu
      if (overlay.parentOverlay) {
        const parent = overlay.parentOverlay.querySelector('[expanded]');
        if (parent && parent.hasAttribute('focused') && child) {
          child.focus();
        } else {
          overlay.$.overlay.focus();
        }
      } else if (child) {
        child.focus();
      }
    }

    /** @private */
    __openSubMenu(subMenu, itemElement, overlayClass) {
      subMenu.items = itemElement._item.children;
      subMenu.listenOn = itemElement;
      subMenu.overlayClass = overlayClass;

      const parent = this._overlayElement;

      const subMenuOverlay = subMenu._overlayElement;
      subMenuOverlay.positionTarget = itemElement;
      subMenuOverlay.noHorizontalOverlap = true;
      // Store the reference parent overlay
      subMenuOverlay._setParentOverlay(parent);

      // Set theme attribute from parent element
      if (parent.hasAttribute('theme')) {
        subMenu.setAttribute('theme', parent.getAttribute('theme'));
      } else {
        subMenu.removeAttribute('theme');
      }

      const content = subMenuOverlay.$.content;
      content.style.minWidth = '';

      itemElement.dispatchEvent(
        new CustomEvent('opensubmenu', {
          detail: {
            children: itemElement._item.children,
          },
        }),
      );
    }

    /**
     * @param {!ContextMenuItem} item
     * @return {HTMLElement}
     * @private
     */
    __createComponent(item) {
      let component;

      if (item.component instanceof HTMLElement) {
        component = item.component;
      } else {
        component = document.createElement(item.component || `${this._tagNamePrefix}-item`);
      }

      // Support menu-bar / context-menu item
      if (component._hasVaadinItemMixin) {
        component.setAttribute('role', 'menuitem');
        component.tabIndex = -1;
      }

      if (component.localName === 'hr') {
        component.setAttribute('role', 'separator');
      } else {
        // Accept not `menuitem` elements e.g. `<button>`
        component.setAttribute('aria-haspopup', 'false');
      }

      this._setMenuItemTheme(component, item, this._theme);

      component._item = item;

      if (item.text) {
        component.textContent = item.text;
      }

      if (item.className) {
        component.setAttribute('class', item.className);
      }

      this.__toggleMenuComponentAttribute(component, 'menu-item-checked', item.checked);
      this.__toggleMenuComponentAttribute(component, 'disabled', item.disabled);

      if (item.children && item.children.length) {
        this.__updateExpanded(component, false);
        component.setAttribute('aria-haspopup', 'true');
      }

      return component;
    }

    /** @private */
    __initListBox() {
      const listBox = document.createElement(`${this._tagNamePrefix}-list-box`);

      if (this._theme) {
        listBox.setAttribute('theme', this._theme);
      }

      listBox.addEventListener('selected-changed', (event) => {
        const { value } = event.detail;
        if (typeof value === 'number') {
          const item = listBox.items[value]._item;
          // Reset selected before dispatching the event to prevent
          // checkmark icon flashing when `keepOpen` is set to true.
          listBox.selected = null;
          if (!item.children) {
            this.dispatchEvent(new CustomEvent('item-selected', { detail: { value: item } }));
          }
        }
      });

      return listBox;
    }

    /** @private */
    __initOverlay() {
      const overlay = this._overlayElement;

      overlay.$.backdrop.addEventListener('click', () => {
        this.close();
      });

      // Open a submenu on click event when a touch device is used.
      // On desktop, a submenu opens on hover.
      overlay.addEventListener(isTouch ? 'click' : 'mouseover', (event) => {
        this.__showSubMenu(event);
      });

      overlay.addEventListener('keydown', (event) => {
        const { key } = event;
        const isRTL = this.__isRTL;

        const isArrowRight = key === 'ArrowRight';
        const isArrowLeft = key === 'ArrowLeft';

        if ((!isRTL && isArrowRight) || (isRTL && isArrowLeft) || key === 'Enter' || key === ' ') {
          // Open a sub-menu
          this.__showSubMenu(event);
        } else if ((!isRTL && isArrowLeft) || (isRTL && isArrowRight) || key === 'Escape') {
          if (key === 'Escape') {
            event.stopPropagation();
          }
          // Close the menu
          this.close();
          this.listenOn.focus();
        } else if (key === 'Tab') {
          // Close all menus
          this.dispatchEvent(new CustomEvent('close-all-menus'));
        }
      });
    }

    /** @private */
    __initSubMenu() {
      const subMenu = document.createElement(this.constructor.is);

      subMenu._modeless = true;
      subMenu.openOn = 'opensubmenu';

      // Sub-menu doesn't have a target to wrap,
      // so there is no need to keep it visible.
      subMenu.setAttribute('hidden', '');

      // Close sub-menu when the parent menu closes.
      this.addEventListener('opened-changed', (event) => {
        if (!event.detail.value) {
          this._subMenu.close();
        }
      });

      // Forward event to the parent menu element.
      subMenu.addEventListener('close-all-menus', () => {
        this.dispatchEvent(new CustomEvent('close-all-menus'));
      });

      // Forward event to the parent menu element.
      subMenu.addEventListener('item-selected', (event) => {
        const { detail } = event;
        this.dispatchEvent(new CustomEvent('item-selected', { detail }));
      });

      // Listen to the forwarded event from sub-menu.
      this.addEventListener('close-all-menus', () => {
        // Call `close()` on the overlay to close synchronously,
        // as we can't have `sync: true` on `opened` property.
        this._overlayElement.close();
      });

      // Listen to the forwarded event from sub-menu.
      this.addEventListener('item-selected', (e) => {
        const menu = e.target;
        const selectedItem = e.detail.value;
        const index = menu.items.indexOf(selectedItem);
        if (!!selectedItem.keepOpen && index > -1) {
          menu._overlayElement.requestContentUpdate();

          // Initialize items synchronously
          menu._listBox._observer.flush();

          const newItem = menu._listBox.children[index];
          newItem.focus();
        } else if (!selectedItem.keepOpen) {
          this.close();
        }
      });

      // Mark parent item as collapsed when closing.
      subMenu.addEventListener('opened-changed', (event) => {
        if (!event.detail.value) {
          const expandedItem = this._listBox.querySelector('[expanded]');
          if (expandedItem) {
            this.__updateExpanded(expandedItem, false);
          }
        }
      });

      return subMenu;
    }

    /** @private */
    __showSubMenu(event, item = event.composedPath().find((node) => node.localName === `${this._tagNamePrefix}-item`)) {
      // Delay enabling the mouseover listener to avoid it from triggering on parent menu open
      if (!this.__openListenerActive) {
        return;
      }

      // Don't open sub-menus while the menu is still opening
      if (this._overlayElement.hasAttribute('opening')) {
        requestAnimationFrame(() => {
          this.__showSubMenu(event, item);
        });

        return;
      }

      const subMenu = this._subMenu;

      if (item) {
        const { children } = item._item;

        // Check if the sub-menu was focused before closing it.
        const child = subMenu._overlayElement.getFirstChild();
        const isSubmenuFocused = child && child.focused;

        if (subMenu.items !== children) {
          subMenu.close();
        }
        if (!this.opened) {
          return;
        }

        if (children && children.length) {
          this.__updateExpanded(item, true);

          // Forward parent overlay class
          const { overlayClass } = this;
          this.__openSubMenu(subMenu, item, overlayClass);
        } else if (isSubmenuFocused) {
          // If the sub-menu item was focused, focus its parent item.
          subMenu.listenOn.focus();
        } else if (!this._listBox.focused) {
          // Otherwise, focus the overlay part to handle arrow keys.
          this._overlayElement.$.overlay.focus();
        }
      }
    }

    /**
     * @param {!HTMLElement} root
     * @param {!ContextMenu} menu
     * @param {!ContextMenuRendererContext} context
     * @protected
     */
    __itemsRenderer(root, menu, { detail }) {
      this.__initMenu(root, menu);

      const subMenu = root.querySelector(this.constructor.is);
      subMenu.closeOn = menu.closeOn;

      const listBox = root.querySelector(`${this._tagNamePrefix}-list-box`);
      listBox.innerHTML = '';

      [...(detail.children || menu.items)].forEach((item) => {
        const component = this.__createComponent(item);
        listBox.appendChild(component);
      });
    }

    /** @protected */
    _setMenuItemTheme(component, item, hostTheme) {
      // Use existing component theme when it is provided
      let theme = component.getAttribute('theme') || hostTheme;

      // Item theme takes precedence over host theme / component theme
      // even if it's empty, as long as it's not undefined or null
      if (item.theme != null) {
        theme = Array.isArray(item.theme) ? item.theme.join(' ') : item.theme;
      }

      this.__updateTheme(component, theme);
    }

    /** @private */
    __toggleMenuComponentAttribute(component, attribute, on) {
      if (on) {
        component.setAttribute(attribute, '');
        component[`__has-${attribute}`] = true;
      } else if (component[`__has-${attribute}`]) {
        component.removeAttribute(attribute);
        component[`__has-${attribute}`] = false;
      }
    }

    /** @private */
    __initMenu(root, _menu) {
      // NOTE: in this method, `menu` and `this` reference the same element,
      // so we can use either of those. Original implementation used `menu`.
      if (!root.firstElementChild) {
        this.__initOverlay();

        const listBox = this.__initListBox();
        this._listBox = listBox;
        root.appendChild(listBox);

        const subMenu = this.__initSubMenu();
        this._subMenu = subMenu;
        root.appendChild(subMenu);

        requestAnimationFrame(() => {
          this.__openListenerActive = true;
        });
      } else {
        this.__updateTheme(this._listBox, this._theme);
      }
    }

    /** @private */
    __updateExpanded(component, expanded) {
      component.setAttribute('aria-expanded', expanded.toString());
      component.toggleAttribute('expanded', expanded);
    }

    /** @private */
    __updateTheme(component, theme) {
      if (theme) {
        component.setAttribute('theme', theme);
      } else {
        component.removeAttribute('theme');
      }
    }
  };
