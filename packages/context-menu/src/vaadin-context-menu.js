/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-contextmenu-event.js';
import './vaadin-context-menu-item.js';
import './vaadin-context-menu-list-box.js';
import './vaadin-context-menu-overlay.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { OverlayClassMixin } from '@vaadin/component-base/src/overlay-class-mixin.js';
import { processTemplates } from '@vaadin/component-base/src/templates.js';
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
 * `<vaadin-context-menu>` uses `<vaadin-context-menu-overlay>` internal
 * themable component as the actual visible context menu overlay.
 *
 * See [`<vaadin-overlay>`](#/elements/vaadin-overlay)
 * documentation for `<vaadin-context-menu-overlay>` stylable parts.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * ### Internal components
 *
 * When using `items` API, in addition `<vaadin-context-menu-overlay>`, the following
 * internal components are themable:
 *
 * - `<vaadin-context-menu-item>` - has the same API as [`<vaadin-item>`](#/elements/vaadin-item).
 * - `<vaadin-context-menu-list-box>` - has the same API as [`<vaadin-list-box>`](#/elements/vaadin-list-box).
 *
 * Note: the `theme` attribute value set on `<vaadin-context-menu>` is
 * propagated to the internal components listed above.
 *
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 * @fires {CustomEvent} item-selected - Fired when an item is selected when the context menu is populated using the `items` API.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ContextMenuMixin
 * @mixes ControllerMixin
 * @mixes OverlayClassMixin
 * @mixes ThemePropertyMixin
 */
class ContextMenu extends ContextMenuMixin(
  OverlayClassMixin(ControllerMixin(ElementMixin(ThemePropertyMixin(PolymerElement)))),
) {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }

        :host([hidden]) {
          display: none !important;
        }
      </style>

      <slot id="slot"></slot>
    `;
  }

  static get is() {
    return 'vaadin-context-menu';
  }

  /** @protected */
  ready() {
    super.ready();

    processTemplates(this);
  }

  /**
   * @param {DocumentFragment} dom
   * @return {null}
   * @protected
   * @override
   */
  _attachDom(dom) {
    const root = this.attachShadow({ mode: 'open' });
    root.appendChild(dom);
    root.appendChild(this._overlayElement);
    return root;
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
