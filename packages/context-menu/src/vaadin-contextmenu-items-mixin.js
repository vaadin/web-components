/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-context-menu-item.js';
import './vaadin-context-menu-list-box.js';
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
         *   { text: 'Menu Item 1', theme: 'primary', children:
         *     [
         *       { text: 'Menu Item 1-1', checked: true },
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
         *   { text: 'Menu Item 3', disabled: true }
         * ];
         * ```
         *
         * @type {!Array<!ContextMenuItem> | undefined}
         *
         *
         * ### Styling
         *
         * The `<vaadin-context-menu-item>` sub-menu elements have the following additional state attributes on top of
         * the built-in `<vaadin-item>` state attributes (see `<vaadin-item>` documentation for full listing).
         *
         * Part name | Attribute | Description
         * ----------------|----------------|----------------
         * `:host` | expanded | Expanded parent item
         */
        items: Array,
      };
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
    ready() {
      super.ready();

      // Overlay's outside click listener doesn't work with modeless
      // overlays (submenus) so we need additional logic for it
      this.__itemsOutsideClickListener = (e) => {
        if (!e.composedPath().some((el) => el.localName === `${this._tagNamePrefix}-overlay`)) {
          this.dispatchEvent(new CustomEvent('items-outside-click'));
        }
      };
      this.addEventListener('items-outside-click', () => this.items && this.close());
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

    /** @protected */
    __forwardFocus() {
      const overlay = this.$.overlay;
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

      const parent = this.$.overlay;

      const subMenuOverlay = subMenu.$.overlay;
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

      const content = subMenu.$.overlay.$.content;
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

      this.__toggleMenuComponentAttribute(component, 'menu-item-checked', item.checked);
      this.__toggleMenuComponentAttribute(component, 'disabled', item.disabled);

      if (item.children && item.children.length) {
        this.__updateExpanded(component, false);
        component.setAttribute('aria-haspopup', 'true');
      }

      return component;
    }

    /** @private */
    __initOverlay() {
      const overlay = this.$.overlay;

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
        } else if ((!isRTL && isArrowLeft) || (isRTL && isArrowRight)) {
          // Close the menu
          this.close();
          this.listenOn.focus();
        } else if (key === 'Escape' || key === 'Tab') {
          // Close all menus
          this.dispatchEvent(new CustomEvent('close-all-menus'));
        }
      });
    }

    /** @private */
    __showSubMenu(event, item = event.composedPath().find((node) => node.localName === `${this._tagNamePrefix}-item`)) {
      // Delay enabling the mouseover listener to avoid it from triggering on parent menu open
      if (!this.__openListenerActive) {
        return;
      }

      // Don't open sub-menus while the menu is still opening
      if (this.$.overlay.hasAttribute('opening')) {
        requestAnimationFrame(() => {
          this.__showSubMenu(event, item);
        });

        return;
      }

      const subMenu = this._subMenu;

      if (item) {
        if (subMenu.items !== item._item.children) {
          subMenu.close();
        }
        if (!this.opened) {
          return;
        }

        if (item._item.children && item._item.children.length) {
          this.__updateExpanded(item, true);

          // Forward parent overlay class
          const { overlayClass } = this;
          this.__openSubMenu(subMenu, item, overlayClass);
        } else {
          subMenu.listenOn.focus();
        }
      }
    }

    /**
     * @param {!HTMLElement} root
     * @param {!ContextMenu} menu
     * @param {!ContextMenuRendererContext} context
     * @protected
     */
    __itemsRenderer(root, menu, context) {
      this.__initMenu(root, menu);

      const subMenu = root.querySelector(this.constructor.is);
      subMenu.closeOn = menu.closeOn;

      const listBox = root.querySelector(`${this._tagNamePrefix}-list-box`);

      listBox.innerHTML = '';

      const items = Array.from(context.detail.children || menu.items);

      items.forEach((item) => {
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

      if (theme) {
        component.setAttribute('theme', theme);
      } else {
        component.removeAttribute('theme');
      }
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
    __initMenu(root, menu) {
      if (!root.firstElementChild) {
        this.__initOverlay();

        const listBox = document.createElement(`${this._tagNamePrefix}-list-box`);
        root.appendChild(listBox);

        if (this._theme) {
          listBox.setAttribute('theme', this._theme);
        }
        requestAnimationFrame(() => listBox.setAttribute('role', 'menu'));

        const subMenu = document.createElement(this.constructor.is);
        this._subMenu = subMenu;
        subMenu.setAttribute('hidden', '');
        root.appendChild(subMenu);
        subMenu.$.overlay.modeless = true;
        subMenu.openOn = 'opensubmenu';

        menu.addEventListener('opened-changed', (e) => !e.detail.value && subMenu.close());
        subMenu.addEventListener('opened-changed', (e) => {
          if (!e.detail.value) {
            const expandedItem = listBox.querySelector('[expanded]');
            if (expandedItem) {
              this.__updateExpanded(expandedItem, false);
            }
          }
        });

        listBox.addEventListener('selected-changed', (e) => {
          if (typeof e.detail.value === 'number') {
            const item = e.target.items[e.detail.value]._item;
            if (!item.children) {
              const detail = { value: item };
              menu.dispatchEvent(new CustomEvent('item-selected', { detail }));
            }
            listBox.selected = null;
          }
        });

        subMenu.addEventListener('item-selected', (e) => {
          menu.dispatchEvent(new CustomEvent('item-selected', { detail: e.detail }));
        });

        subMenu.addEventListener('close-all-menus', () => {
          menu.dispatchEvent(new CustomEvent('close-all-menus'));
        });
        menu.addEventListener('close-all-menus', menu.close);
        menu.addEventListener('item-selected', menu.close);

        requestAnimationFrame(() => {
          this.__openListenerActive = true;
        });
      } else {
        const listBox = root.querySelector(`${this._tagNamePrefix}-list-box`);
        if (this._theme) {
          listBox.setAttribute('theme', this._theme);
        } else {
          listBox.removeAttribute('theme');
        }
      }
    }

    /** @private */
    __updateExpanded(component, expanded) {
      component.setAttribute('aria-expanded', expanded.toString());
      component.toggleAttribute('expanded', expanded);
    }
  };
