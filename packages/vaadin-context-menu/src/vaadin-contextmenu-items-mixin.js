/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { flush } from '@polymer/polymer/lib/utils/flush.js';
import { ItemElement } from '@vaadin/vaadin-item/src/vaadin-item.js';
import { ListBoxElement } from '@vaadin/vaadin-list-box/src/vaadin-list-box.js';

/**
 * An element used internally by `<vaadin-context-menu>`. Not intended to be used separately.
 *
 * @extends ItemElement
 * @protected
 */
class ContextMenuItemElement extends ItemElement {
  static get is() {
    return 'vaadin-context-menu-item';
  }
}

customElements.define(ContextMenuItemElement.is, ContextMenuItemElement);

/**
 * An element used internally by `<vaadin-context-menu>`. Not intended to be used separately.
 *
 * @extends ListBoxElement
 * @protected
 */
class ContextMenuListBoxElement extends ListBoxElement {
  static get is() {
    return 'vaadin-context-menu-list-box';
  }
}

customElements.define(ContextMenuListBoxElement.is, ContextMenuListBoxElement);

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
         *   {text: 'Menu Item 1', children:
         *     [
         *       {text: 'Menu Item 1-1', checked: true},
         *       {text: 'Menu Item 1-2'}
         *     ]
         *   },
         *   {component: 'hr'},
         *   {text: 'Menu Item 2', children:
         *     [
         *       {text: 'Menu Item 2-1'},
         *       {text: 'Menu Item 2-2', disabled: true}
         *     ]
         *   },
         *   {text: 'Menu Item 3', disabled: true}
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
        items: Array
      };
    }

    /** @protected */
    ready() {
      super.ready();

      // Overlay's outside click listener doesn't work with modeless
      // overlays (submenus) so we need additional logic for it
      this.__itemsOutsideClickListener = (e) => {
        if (!e.composedPath().filter((el) => el.localName === 'vaadin-context-menu-overlay')[0]) {
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

    /**
     * @return {boolean}
     * @protected
     */
    get __isRTL() {
      return this.getAttribute('dir') === 'rtl';
    }

    /** @protected */
    __forwardFocus() {
      const overlay = this.$.overlay;
      const child = overlay.getFirstChild();
      // if parent item is not focused, do not focus submenu
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
    __openSubMenu(subMenu, itemElement) {
      subMenu.items = itemElement._item.children;
      subMenu.listenOn = itemElement;

      const itemRect = itemElement.getBoundingClientRect();

      const content = subMenu.$.overlay.$.content;
      const style = getComputedStyle(content);
      const parent = this.$.overlay;
      const y = parent.hasAttribute('bottom-aligned')
        ? itemRect.bottom + parseFloat(style.paddingBottom)
        : itemRect.top - parseFloat(style.paddingTop);

      // Store the reference to align based on parent overlay coordinates
      subMenu.$.overlay._setParentOverlay(parent);

      // Set theme attribute from parent element
      if (parent.theme) {
        subMenu.setAttribute('theme', parent.theme);
      } else {
        subMenu.removeAttribute('theme');
      }

      let x;
      content.style.minWidth = '';
      if (document.documentElement.clientWidth - itemRect.right > itemRect.width) {
        // There's room on the right side
        x = itemRect.right;
      } else {
        // Open on the left side
        x = itemRect.left - itemRect.width;
        // Make sure there's no gaps between the menus
        content.style.minWidth = parent.$.content.clientWidth + 'px';
      }
      x = Math.max(x, 0);

      itemElement.dispatchEvent(
        new CustomEvent('opensubmenu', {
          detail: {
            x,
            y,
            children: itemElement._item.children
          }
        })
      );
    }

    /**
     * @param {!HTMLElement} root
     * @param {!ContextMenuElement} menu
     * @param {!ContextMenuRendererContext} context
     * @protected
     */
    __itemsRenderer(root, menu, context) {
      this.__initMenu(root, menu);

      const subMenu = root.querySelector(this.constructor.is);
      subMenu.closeOn = menu.closeOn;

      const listBox = root.querySelector('vaadin-context-menu-list-box');

      listBox.innerHTML = '';

      const items = Array.from(context.detail.children || menu.items);

      items.forEach((item) => {
        let component;
        if (item.component instanceof HTMLElement) {
          component = item.component;
        } else {
          component = document.createElement(item.component || 'vaadin-context-menu-item');
        }

        if (component instanceof ItemElement) {
          component.setAttribute('role', 'menuitem');
          component.classList.add('vaadin-menu-item');
        } else if (component.localName === 'hr') {
          component.setAttribute('role', 'separator');
        }
        this.theme && component.setAttribute('theme', this.theme);

        component._item = item;

        if (item.text) {
          component.textContent = item.text;
        }

        this.__toggleMenuComponentAttribute(component, 'menu-item-checked', item.checked);
        this.__toggleMenuComponentAttribute(component, 'disabled', item.disabled);

        component.setAttribute('aria-haspopup', 'false');
        component.classList.remove('vaadin-context-menu-parent-item');
        if (item.children && item.children.length) {
          component.classList.add('vaadin-context-menu-parent-item');
          component.setAttribute('aria-haspopup', 'true');
          component.setAttribute('aria-expanded', 'false');
          component.removeAttribute('expanded');
        }

        listBox.appendChild(component);
      });
    }

    /** @private */
    __toggleMenuComponentAttribute(component, attribute, on) {
      if (on) {
        component.setAttribute(attribute, '');
        component['__has-' + attribute] = true;
      } else if (component['__has-' + attribute]) {
        component.removeAttribute(attribute);
        component['__has-' + attribute] = false;
      }
    }

    /** @private */
    __initMenu(root, menu) {
      if (!root.firstElementChild) {
        const is = this.constructor.is;
        root.innerHTML = `
        <vaadin-context-menu-list-box></vaadin-context-menu-list-box>
        <${is} hidden></${is}>
      `;
        flush();
        const listBox = root.querySelector('vaadin-context-menu-list-box');
        this.theme && listBox.setAttribute('theme', this.theme);
        listBox.classList.add('vaadin-menu-list-box');
        requestAnimationFrame(() => listBox.setAttribute('role', 'menu'));

        const subMenu = root.querySelector(is);
        subMenu.$.overlay.modeless = true;
        subMenu.openOn = 'opensubmenu';

        menu.addEventListener('opened-changed', (e) => !e.detail.value && subMenu.close());
        subMenu.addEventListener('opened-changed', (e) => {
          if (!e.detail.value) {
            const expandedItem = listBox.querySelector('[expanded]');
            if (expandedItem) {
              expandedItem.setAttribute('aria-expanded', 'false');
              expandedItem.removeAttribute('expanded');
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
        menu.$.overlay.$.backdrop.addEventListener('click', () => menu.close());

        menu.$.overlay.addEventListener('keydown', (e) => {
          const isRTL = this.__isRTL;
          if ((!isRTL && e.keyCode === 37) || (isRTL && e.keyCode === 39)) {
            menu.close();
            menu.listenOn.focus();
          } else if (e.keyCode === 27) {
            menu.dispatchEvent(new CustomEvent('close-all-menus'));
          }
        });

        requestAnimationFrame(() => (this.__openListenerActive = true));
        const openSubMenu = (
          e,
          itemElement = e.composedPath().filter((e) => e.localName === 'vaadin-context-menu-item')[0]
        ) => {
          // Delay enabling the mouseover listener to avoid it from triggering on parent menu open
          if (!this.__openListenerActive) {
            return;
          }

          // Don't open sub-menus while the menu is still opening
          if (menu.$.overlay.hasAttribute('opening')) {
            requestAnimationFrame(() => openSubMenu(e, itemElement));
            return;
          }

          if (itemElement) {
            if (subMenu.items !== itemElement._item.children) {
              subMenu.close();
            }
            if (!menu.opened) {
              return;
            }
            if (itemElement._item.children && itemElement._item.children.length) {
              itemElement.setAttribute('aria-expanded', 'true');
              itemElement.setAttribute('expanded', '');
              this.__openSubMenu(subMenu, itemElement);
            } else {
              subMenu.listenOn.focus();
            }
          }
        };

        menu.$.overlay.addEventListener('mouseover', openSubMenu);
        menu.$.overlay.addEventListener('keydown', (e) => {
          const isRTL = this.__isRTL;
          const shouldOpenSubMenu =
            (!isRTL && e.keyCode === 39) || (isRTL && e.keyCode === 37) || e.keyCode === 13 || e.keyCode === 32;

          shouldOpenSubMenu && openSubMenu(e);
        });
      } else {
        const listBox = root.querySelector('vaadin-context-menu-list-box');
        if (this.theme) {
          listBox.setAttribute('theme', this.theme);
        } else {
          listBox.removeAttribute('theme');
        }
      }
    }
  };
