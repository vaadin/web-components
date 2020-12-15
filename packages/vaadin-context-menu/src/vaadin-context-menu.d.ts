import { GestureEventListeners } from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';

import { ItemsMixin } from './vaadin-contextmenu-items-mixin.js';

import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';

import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';

import { ContextMenuEventMap, ContextMenuRenderer } from './interfaces';

/**
 * `<vaadin-context-menu>` is a Web Component for creating context menus. The content of the
 * menu can be populated in three ways: imperatively by using the items API or a renderer callback function and
 * declaratively by using Polymer's Templates.
 *
 * ### Items
 *
 * Items is a higher level convenience API for defining a (hierarchical) menu structure for the component.
 * If a menu item has a non-empty `children` set, a sub-menu with the child items is opened
 * next to the parent menu on mouseover, tap or a right arrow keypress.
 *
 * When an item is selected, `<vaadin-context-menu>` dispatches an "item-selected" event
 * with the selected item as `event.detail.value` property.
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
 *
 * contextMenu.addEventListener('item-selected', e => {
 *   const item = e.detail.value;
 *   console.log(`${item.text} selected`);
 * });
 * ```
 *
 * **NOTE:** when the `items` array is defined, the renderer or a template cannot be used.
 *
 * ### Rendering
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
 * **NOTE:** when the `renderer` function is defined, the template content
 * is not in use.
 *
 * ### Polymer Templates
 *
 * Alternatively to using the `renderer`, you can populate
 * the menu content using Polymer's Templates:
 *
 * ```html
 * <vaadin-context-menu>
 *   <template>
 *     <vaadin-list-box>
 *       <vaadin-item>First menu item</vaadin-item>
 *       <vaadin-item>Second menu item</vaadin-item>
 *     </vaadin-list-box>
 *   </template>
 * </vaadin-context-menu>
 * ```
 *
 * ### “vaadin-contextmenu” Gesture Event
 *
 * `vaadin-contextmenu` is a gesture event (a custom event),
 * which is dispatched after either `contextmenu` and long touch events.
 * This enables support for both mouse and touch environments in a uniform way.
 *
 * `<vaadin-context-menu>` opens the menu overlay on the `vaadin-contextmenu`
 * event by default.
 *
 * ### Menu Listener
 *
 * By default, the `<vaadin-context-menu>` element listens for the menu opening
 * event on itself. In order to have a context menu on your content, wrap
 * your content with the `<vaadin-context-menu>` element, and add a template
 * element with a menu. Example:
 *
 * ```html
 * <vaadin-context-menu>
 *   <template>
 *     <vaadin-list-box>
 *       <vaadin-item>First menu item</vaadin-item>
 *       <vaadin-item>Second menu item</vaadin-item>
 *     </vaadin-list-box>
 *   </template>
 *
 *   <p>This paragraph has the context menu provided in the above template.</p>
 *   <p>Another paragraph with the context menu.</p>
 * </vaadin-context-menu>
 * ```
 *
 * In case if you do not want to wrap the page content, you can listen for
 * events on an element outside the `<vaadin-context-menu>` by setting the
 * `listenOn` property:
 *
 * ```html
 * <vaadin-context-menu id="customListener">
 *   <template>
 *     <vaadin-list-box>
 *       ...
 *     </vaadin-list-box>
 *   </template>
 * </vaadin-context-menu>
 *
 * <div id="menuListener">The element that listens for the context menu.</div>
 * ```
 * ```javascript
 *   const contextMenu = document.querySelector('vaadin-context-menu#customListener');
 *   contextMenu.listenOn = document.querySelector('#menuListener');
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
 *   <template>
 *     <vaadin-list-box>
 *       ...
 *     </vaadin-list-box>
 *   </template>
 *
 *   <p class="has-menu">This paragraph opens the context menu</p>
 *   <p>This paragraph does not open the context menu</p>
 * </vaadin-context-menu>
 * ```
 *
 * ### Menu Context
 *
 * You can bind to the following properties in the menu template:
 *
 * - `target` is the menu opening event target, which is the element that
 * the user has called the context menu for
 * - `detail` is the menu opening event detail
 *
 * In the following example, the menu item text is composed with the contents
 * of the element that opened the menu:
 *
 * ```html
 * <vaadin-context-menu selector="li">
 *   <template>
 *     <vaadin-list-box>
 *       <vaadin-item>The menu target: [[target.textContent]]</vaadin-item>
 *     </vaadin-list-box>
 *   </template>
 *
 *   <ul>
 *     <li>Foo</li>
 *     <li>Bar</li>
 *     <li>Baz</li>
 *   </ul>
 * </vaadin-context-menu>
 * ```
 *
 * ### Styling
 *
 * `<vaadin-context-menu>` uses `<vaadin-context-menu-overlay>` internal
 * themable component as the actual visible context menu overlay. See
 * See [`<vaadin-overlay>` documentation](https://github.com/vaadin/vaadin-overlay/blob/master/src/vaadin-overlay.html)
 * for `<vaadin-context-menu-overlay>` parts.
 *
 * See [ThemableMixin – how to apply styles for shadow parts](https://github.com/vaadin/vaadin-themable-mixin/wiki)
 *
 * Note: the `theme` attribute value set on `<vaadin-context-menu>` is
 * propagated to the internal `<vaadin-context-menu-overlay>` component.
 * In case of using nested menu items, the `theme` attribute is also propagated
 * to internal `vaadin-context-menu-list-box` and `vaadin-context-menu-item`'s.
 *
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 * @fires {CustomEvent} item-selected - Fired when an item is selected when the context menu is populated using the `items` API.
 */
declare class ContextMenuElement extends ElementMixin(
  ThemePropertyMixin(ItemsMixin(GestureEventListeners(HTMLElement)))
) {
  /**
   * CSS selector that can be used to target any child element
   * of the context menu to listen for `openOn` events.
   */
  selector: string | null | undefined;

  /**
   * True if the overlay is currently displayed.
   */
  readonly opened: boolean;

  /**
   * Event name to listen for opening the context menu.
   * @attr {string} open-on
   */
  openOn: string;

  /**
   * The target element that's listened to for context menu opening events.
   * By default the vaadin-context-menu listens to the target's `vaadin-contextmenu`
   * events.
   */
  listenOn: HTMLElement;

  /**
   * Event name to listen for closing the context menu.
   * @attr {string} close-on
   */
  closeOn: string;

  /**
   * Custom function for rendering the content of the menu overlay.
   * Receives three arguments:
   *
   * - `root` The root container DOM element. Append your content to it.
   * - `contextMenu` The reference to the `<vaadin-context-menu>` element.
   * - `context` The object with the menu context, contains:
   *   - `context.target`  the target of the menu opening event,
   *   - `context.detail` the menu opening event detail.
   */
  renderer: ContextMenuRenderer | null | undefined;

  /**
   * Manually invoke existing renderer.
   */
  render(): void;

  /**
   * Closes the overlay.
   */
  close(): void;

  /**
   * Opens the overlay.
   *
   * @param e used as the context for the menu. Overlay coordinates are taken from this event.
   */
  open(e: Event | undefined): void;

  addEventListener<K extends keyof ContextMenuEventMap>(
    type: K,
    listener: (this: ContextMenuElement, ev: ContextMenuEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof ContextMenuEventMap>(
    type: K,
    listener: (this: ContextMenuElement, ev: ContextMenuEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-context-menu': ContextMenuElement;
  }
}

export { ContextMenuElement };
