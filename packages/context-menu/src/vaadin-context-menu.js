/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-contextmenu-event.js';
import './vaadin-context-menu-item.js';
import './vaadin-context-menu-list-box.js';
import './vaadin-context-menu-overlay.js';
import { css, html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';
import { ContextMenuMixin } from './vaadin-context-menu-mixin.js';

/**
 * `<vaadin-context-menu>` is a Web Component for creating context menus.
 *
 * ### Items
 *
 * Items is a higher level convenience API for defining a (hierarchical) menu structure for the component.
 * If a menu item has a non-empty `children` set, a sub-menu with the child items is opened
 * next to the parent menu on mouseover, tap or a right arrow keypress.
 *
 * When an item is selected, `<vaadin-context-menu>` dispatches an "item-selected" event
 * with the selected item as `event.detail.value` property.
 * If item does not have `keepOpen` property the menu will be closed.
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
 *
 * contextMenu.addEventListener('item-selected', e => {
 *   const item = e.detail.value;
 *   console.log(`${item.text} selected`);
 * });
 * ```
 *
 * **NOTE:** when the `items` array is defined, the renderer cannot be used.
 *
 * ### Rendering
 *
 * The content of the menu can be populated by using the renderer callback function.
 *
 * The renderer function provides `root`, `contextMenu`, `model` arguments when applicable.
 * Generate DOM content by using `model` object properties if needed, append it to the `root`
 * element and control the state of the host element by accessing `contextMenu`. Before generating
 * new content, the renderer function should check if there is already content in `root` for reusing it.
 *
 * ```html
 * <vaadin-context-menu id="contextMenu">
 *  <p>This paragraph has a context menu.</p>
 * </vaadin-context-menu>
 * ```
 * ```js
 * const contextMenu = document.querySelector('#contextMenu');
 * contextMenu.renderer = (root, contextMenu, context) => {
 *   let listBox = root.firstElementChild;
 *   if (!listBox) {
 *     listBox = document.createElement('vaadin-list-box');
 *     root.appendChild(listBox);
 *   }
 *
 *   let item = listBox.querySelector('vaadin-item');
 *   if (!item) {
 *     item = document.createElement('vaadin-item');
 *     listBox.appendChild(item);
 *   }
 *   item.textContent = 'Content of the selector: ' + context.target.textContent;
 * };
 * ```
 *
 * You can access the menu context inside the renderer using
 * `context.target` and `context.detail`.
 *
 * Renderer is called on the opening of the context-menu and each time the related context is updated.
 * DOM generated during the renderer call can be reused
 * in the next renderer call and will be provided with the `root` argument.
 * On first call it will be empty.
 *
 * ### `vaadin-contextmenu` Gesture Event
 *
 * `vaadin-contextmenu` is a gesture event (a custom event),
 * which is dispatched after either `contextmenu` or long touch events.
 * This enables support for both mouse and touch environments in a uniform way.
 *
 * `<vaadin-context-menu>` opens the menu overlay on the `vaadin-contextmenu`
 * event by default.
 *
 * ### Menu Listener
 *
 * By default, the `<vaadin-context-menu>` element listens for the menu opening
 * event on itself. In case if you do not want to wrap the target, you can listen for
 * events on an element outside the `<vaadin-context-menu>` by setting the
 * `listenOn` property:
 *
 * ```html
 * <vaadin-context-menu id="contextMenu"></vaadin-context-menu>
 *
 * <div id="menuListener">The element that listens for the contextmenu event.</div>
 * ```
 * ```javascript
 * const contextMenu = document.querySelector('#contextMenu');
 * contextMenu.listenOn = document.querySelector('#menuListener');
 * ```
 *
 * ### Filtering Menu Targets
 *
 * By default, the listener element and all its descendants open the context
 * menu. You can filter the menu targets to a smaller set of elements inside
 * the listener element by setting the `selector` property.
 *
 * In the following example, only the elements matching `.has-menu` will open the context menu:
 *
 * ```html
 * <vaadin-context-menu selector=".has-menu">
 *   <p class="has-menu">This paragraph opens the context menu</p>
 *   <p>This paragraph does not open the context menu</p>
 * </vaadin-context-menu>
 * ```
 *
 * ### Menu Context
 *
 * The following properties are available in the `context` argument:
 *
 * - `target` is the menu opening event target, which is the element that
 * the user has called the context menu for
 * - `detail` is the menu opening event detail
 *
 * In the following example, the menu item text is composed with the contents
 * of the element that opened the menu:
 *
 * ```html
 * <vaadin-context-menu selector="li" id="contextMenu">
 *   <ul>
 *     <li>Foo</li>
 *     <li>Bar</li>
 *     <li>Baz</li>
 *   </ul>
 * </vaadin-context-menu>
 * ```
 * ```js
 * const contextMenu = document.querySelector('#contextMenu');
 * contextMenu.renderer = (root, contextMenu, context) => {
 *   let listBox = root.firstElementChild;
 *   if (!listBox) {
 *     listBox = document.createElement('vaadin-list-box');
 *     root.appendChild(listBox);
 *   }
 *
 *   let item = listBox.querySelector('vaadin-item');
 *   if (!item) {
 *     item = document.createElement('vaadin-item');
 *     listBox.appendChild(item);
 *   }
 *   item.textContent = 'The menu target: ' + context.target.textContent;
 * };
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name        | Description
 * -----------------|-------------------------------------------
 * `backdrop`       | Backdrop of the overlay
 * `overlay`        | The overlay container
 * `content`        | The overlay content
 *
 * ### Custom CSS Properties
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                   | Description
 * --------------------------------------|-------------
 * `--vaadin-context-menu-offset-top`    | Used as an offset when using `position` and the context menu is aligned vertically below the target
 * `--vaadin-context-menu-offset-bottom` | Used as an offset when using `position` and the context menu is aligned vertically above the target
 * `--vaadin-context-menu-offset-start`  | Used as an offset when using `position` and the context menu is aligned horizontally after the target
 * `--vaadin-context-menu-offset-end`    | Used as an offset when using `position` and the context menu is aligned horizontally before the target
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * ### Internal components
 *
 * When using `items` API the following internal components are themable:
 *
 * - `<vaadin-context-menu-item>` - has the same API as [`<vaadin-item>`](#/elements/vaadin-item).
 * - `<vaadin-context-menu-list-box>` - has the same API as [`<vaadin-list-box>`](#/elements/vaadin-list-box).
 *
 * The `<vaadin-context-menu-item>` sub-menu elements have the following additional state attributes
 * on top of the built-in `<vaadin-item>` state attributes:
 *
 * Attribute  | Description
 * ---------- |-------------
 * `expanded` | Expanded parent item.
 *
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 * @fires {CustomEvent} item-selected - Fired when an item is selected when the context menu is populated using the `items` API.
 * @fires {CustomEvent} closed - Fired when the context menu is closed.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ContextMenuMixin
 * @mixes ThemePropertyMixin
 */
class ContextMenu extends ContextMenuMixin(ElementMixin(ThemePropertyMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-context-menu';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      :host([hidden]) {
        display: none !important;
      }
    `;
  }

  static get properties() {
    return {
      /**
       * Position of the overlay with respect to the target.
       * Supported values: null, `top-start`, `top`, `top-end`,
       * `bottom-start`, `bottom`, `bottom-end`, `start-top`,
       * `start`, `start-bottom`, `end-top`, `end`, `end-bottom`.
       */
      position: {
        type: String,
      },
    };
  }

  /** @protected */
  render() {
    const { _context: context, position } = this;

    return html`
      <slot id="slot"></slot>
      <vaadin-context-menu-overlay
        id="overlay"
        .owner="${this}"
        .opened="${this.opened}"
        .model="${context}"
        .modeless="${this._modeless}"
        .renderer="${this.items ? this.__itemsRenderer : this.renderer}"
        .position="${position}"
        .positionTarget="${position ? context && context.target : this._positionTarget}"
        .horizontalAlign="${this.__computeHorizontalAlign(position)}"
        .verticalAlign="${this.__computeVerticalAlign(position)}"
        ?no-horizontal-overlap="${this.__computeNoHorizontalOverlap(position)}"
        ?no-vertical-overlap="${this.__computeNoVerticalOverlap(position)}"
        .withBackdrop="${this._phone}"
        ?phone="${this._phone}"
        theme="${ifDefined(this._theme)}"
        exportparts="backdrop, overlay, content"
        @opened-changed="${this._onOverlayOpened}"
        @vaadin-overlay-open="${this._onVaadinOverlayOpen}"
        @vaadin-overlay-closed="${this._onVaadinOverlayClosed}"
      >
        <slot name="overlay"></slot>
        <slot name="submenu" slot="submenu"></slot>
      </vaadin-context-menu-overlay>
    `;
  }

  /** @private */
  __computeHorizontalAlign(position) {
    if (!position) {
      return 'start';
    }

    return ['top-end', 'bottom-end', 'start-top', 'start', 'start-bottom'].includes(position) ? 'end' : 'start';
  }

  /** @private */
  __computeNoHorizontalOverlap(position) {
    if (!position) {
      return !!this._positionTarget;
    }

    return ['start-top', 'start', 'start-bottom', 'end-top', 'end', 'end-bottom'].includes(position);
  }

  /** @private */
  __computeNoVerticalOverlap(position) {
    if (!position) {
      return false;
    }

    return ['top-start', 'top-end', 'top', 'bottom-start', 'bottom', 'bottom-end'].includes(position);
  }

  /** @private */
  __computeVerticalAlign(position) {
    if (!position) {
      return 'top';
    }

    return ['top-start', 'top-end', 'top', 'start-bottom', 'end-bottom'].includes(position) ? 'bottom' : 'top';
  }

  /**
   * Fired when an item is selected when the context menu is populated using the `items` API.
   *
   * @event item-selected
   * @param {Object} detail
   * @param {Object} detail.value the selected menu item
   */
}

defineCustomElement(ContextMenu);
export { ContextMenu };
