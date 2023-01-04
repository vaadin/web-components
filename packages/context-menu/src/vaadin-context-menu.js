/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-contextmenu-event.js';
import './vaadin-context-menu-overlay.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { isTouch } from '@vaadin/component-base/src/browser-utils.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { addListener, gestures, removeListener } from '@vaadin/component-base/src/gestures.js';
import { MediaQueryController } from '@vaadin/component-base/src/media-query-controller.js';
import { processTemplates } from '@vaadin/component-base/src/templates.js';
import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';
import { ItemsMixin } from './vaadin-contextmenu-items-mixin.js';

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
 *
 * ```javascript
 * contextMenu.items = [
 *   {text: 'Menu Item 1', theme: 'primary', children:
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
 * ### “vaadin-contextmenu” Gesture Event
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
 * See [Styling Components](https://vaadin.com/docs/latest/styling/custom-theme/styling-components) documentation.
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
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ControllerMixin
 * @mixes ThemePropertyMixin
 * @mixes ItemsMixin
 */
class ContextMenu extends ControllerMixin(ElementMixin(ThemePropertyMixin(ItemsMixin(PolymerElement)))) {
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

      <vaadin-context-menu-overlay
        id="overlay"
        on-opened-changed="_onOverlayOpened"
        on-vaadin-overlay-open="_onVaadinOverlayOpen"
        with-backdrop="[[_phone]]"
        phone$="[[_phone]]"
        model="[[_context]]"
        theme$="[[_theme]]"
      >
      </vaadin-context-menu-overlay>
    `;
  }

  static get is() {
    return 'vaadin-context-menu';
  }

  static get properties() {
    return {
      /**
       * CSS selector that can be used to target any child element
       * of the context menu to listen for `openOn` events.
       */
      selector: {
        type: String,
      },

      /**
       * True if the overlay is currently displayed.
       * @type {boolean}
       */
      opened: {
        type: Boolean,
        value: false,
        notify: true,
        readOnly: true,
      },

      /**
       * Event name to listen for opening the context menu.
       * @attr {string} open-on
       * @type {string}
       */
      openOn: {
        type: String,
        value: 'vaadin-contextmenu',
      },

      /**
       * The target element that's listened to for context menu opening events.
       * By default the vaadin-context-menu listens to the target's `vaadin-contextmenu`
       * events.
       * @type {!HTMLElement}
       * @default self
       */
      listenOn: {
        type: Object,
        value() {
          return this;
        },
      },

      /**
       * Event name to listen for closing the context menu.
       * @attr {string} close-on
       * @type {string}
       */
      closeOn: {
        type: String,
        value: 'click',
        observer: '_closeOnChanged',
      },

      /**
       * Custom function for rendering the content of the menu overlay.
       * Receives three arguments:
       *
       * - `root` The root container DOM element. Append your content to it.
       * - `contextMenu` The reference to the `<vaadin-context-menu>` element.
       * - `context` The object with the menu context, contains:
       *   - `context.target`  the target of the menu opening event,
       *   - `context.detail` the menu opening event detail.
       * @type {ContextMenuRenderer | undefined}
       */
      renderer: {
        type: Function,
      },

      /** @private */
      _context: Object,

      /** @private */
      _boundClose: Object,

      /** @private */
      _boundOpen: Object,

      /** @private */
      _phone: {
        type: Boolean,
      },

      /** @private */
      _touch: {
        type: Boolean,
        value: isTouch,
      },

      /** @private */
      _wide: {
        type: Boolean,
      },

      /** @private */
      _wideMediaQuery: {
        type: String,
        value: '(min-device-width: 750px)',
      },
    };
  }

  static get observers() {
    return [
      '_openedChanged(opened)',
      '_targetOrOpenOnChanged(listenOn, openOn)',
      '_rendererChanged(renderer, items)',
      '_touchOrWideChanged(_touch, _wide)',
    ];
  }

  constructor() {
    super();
    this._boundOpen = this.open.bind(this);
    this._boundClose = this.close.bind(this);
    this._boundOnGlobalContextMenu = this._onGlobalContextMenu.bind(this);
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();

    this.__boundOnScroll = this.__onScroll.bind(this);
    window.addEventListener('scroll', this.__boundOnScroll, true);
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();

    window.removeEventListener('scroll', this.__boundOnScroll, true);
    this.close();
  }

  /** @protected */
  ready() {
    super.ready();

    this._overlayElement = this.$.overlay;

    this.addController(
      new MediaQueryController(this._wideMediaQuery, (matches) => {
        this._wide = matches;
      }),
    );

    processTemplates(this);
  }

  /**
   * Runs before overlay is fully rendered
   * @private
   */
  _onOverlayOpened(e) {
    this._setOpened(e.detail.value);
    this.__alignOverlayPosition();
  }

  /**
   * Runs after overlay is fully rendered
   * @private
   */
  _onVaadinOverlayOpen() {
    this.__alignOverlayPosition();
    this.$.overlay.style.opacity = '';
    this.__forwardFocus();
  }

  /** @private */
  _targetOrOpenOnChanged(listenOn, openOn) {
    if (this._oldListenOn && this._oldOpenOn) {
      this._unlisten(this._oldListenOn, this._oldOpenOn, this._boundOpen);

      this._oldListenOn.style.webkitTouchCallout = '';
      this._oldListenOn.style.webkitUserSelect = '';
      this._oldListenOn.style.userSelect = '';

      this._oldListenOn = null;
      this._oldOpenOn = null;
    }

    if (listenOn && openOn) {
      this._listen(listenOn, openOn, this._boundOpen);

      this._oldListenOn = listenOn;
      this._oldOpenOn = openOn;
    }
  }

  /** @private */
  _touchOrWideChanged(touch, wide) {
    this._phone = !wide && touch;
  }

  /** @private */
  _setListenOnUserSelect(value) {
    // Note: these styles don't seem to work in Firefox on iOS.
    this.listenOn.style.webkitTouchCallout = value;
    this.listenOn.style.webkitUserSelect = value; // Chrome, Safari, Firefox
    this.listenOn.style.userSelect = value;

    // Note: because user-selection is disabled on the overlay
    // before opening the menu the text could be already selected
    // so we need to clear that selection
    document.getSelection().removeAllRanges();
  }

  /** @private */
  _closeOnChanged(closeOn, oldCloseOn) {
    // Listen on this.$.overlay.root to workaround issue on
    //  ShadyDOM polyfill: https://github.com/webcomponents/shadydom/issues/159

    // Outside click event from overlay
    const evtOverlay = 'vaadin-overlay-outside-click';

    if (oldCloseOn) {
      this._unlisten(this.$.overlay, oldCloseOn, this._boundClose);
      this._unlisten(this.$.overlay.root, oldCloseOn, this._boundClose);
    }
    if (closeOn) {
      this._listen(this.$.overlay, closeOn, this._boundClose);
      this._listen(this.$.overlay.root, closeOn, this._boundClose);
      this._unlisten(this.$.overlay, evtOverlay, this._preventDefault);
    } else {
      this._listen(this.$.overlay, evtOverlay, this._preventDefault);
    }
  }

  /** @private */
  _preventDefault(e) {
    e.preventDefault();
  }

  /** @private */
  _openedChanged(opened) {
    if (opened) {
      document.documentElement.addEventListener('contextmenu', this._boundOnGlobalContextMenu, true);
      this._setListenOnUserSelect('none');
    } else {
      document.documentElement.removeEventListener('contextmenu', this._boundOnGlobalContextMenu, true);
      this._setListenOnUserSelect('');
    }

    // Has to be set after instance has been created
    this.$.overlay.opened = opened;
  }

  /**
   * Requests an update for the content of the menu overlay.
   * While performing the update, it invokes the renderer passed in the `renderer` property.
   *
   * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
   */
  requestContentUpdate() {
    if (!this._overlayElement || !this.renderer) {
      return;
    }

    this._overlayElement.requestContentUpdate();
  }

  /** @private */
  _rendererChanged(renderer, items) {
    if (items) {
      if (renderer) {
        throw new Error('The items API cannot be used together with a renderer');
      }

      if (this.closeOn === 'click') {
        this.closeOn = '';
      }

      renderer = this.__itemsRenderer;
    }

    this.$.overlay.setProperties({ owner: this, renderer });
  }

  /**
   * Closes the overlay.
   */
  close() {
    this._setOpened(false);
  }

  /** @private */
  _contextTarget(e) {
    if (this.selector) {
      const targets = this.listenOn.querySelectorAll(this.selector);

      return Array.prototype.filter.call(targets, (el) => {
        return e.composedPath().indexOf(el) > -1;
      })[0];
    }
    return e.target;
  }

  /**
   * Opens the overlay.
   * @param {!Event | undefined} e used as the context for the menu. Overlay coordinates are taken from this event.
   */
  open(e) {
    if (e && !this.opened) {
      this._context = {
        detail: e.detail,
        target: this._contextTarget(e),
      };

      if (this._context.target) {
        this._preventDefault(e);
        e.stopPropagation();

        // Used in alignment which is delayed until overlay is rendered
        this.__x = this._getEventCoordinate(e, 'x');
        this.__pageXOffset = window.pageXOffset;

        this.__y = this._getEventCoordinate(e, 'y');
        this.__pageYOffset = window.pageYOffset;

        this.$.overlay.style.opacity = '0';
        this._setOpened(true);
      }
    }
  }

  /** @private */
  __onScroll() {
    if (!this.opened) {
      return;
    }

    const yDiff = window.pageYOffset - this.__pageYOffset;
    const xDiff = window.pageXOffset - this.__pageXOffset;

    this.__adjustPosition('left', -xDiff);
    this.__adjustPosition('right', xDiff);

    this.__adjustPosition('top', -yDiff);
    this.__adjustPosition('bottom', yDiff);

    this.__pageYOffset += yDiff;
    this.__pageXOffset += xDiff;
  }

  /** @private */
  __adjustPosition(coord, diff) {
    const overlay = this.$.overlay;
    const style = overlay.style;

    style[coord] = `${(parseInt(style[coord]) || 0) + diff}px`;
  }

  /** @private */
  __alignOverlayPosition() {
    const overlay = this.$.overlay;

    if (overlay.positionTarget) {
      // The overlay is positioned relative to another node, for example, a
      // menu item in a nested submenu structure where this overlay lists
      // the items for another submenu.
      // It means that the overlay positioning is controlled by
      // vaadin-overlay-position-mixin so no manual alignment is needed.
      return;
    }

    const style = overlay.style;

    // Reset all properties before measuring
    ['top', 'right', 'bottom', 'left'].forEach((prop) => style.removeProperty(prop));
    ['right-aligned', 'end-aligned', 'bottom-aligned'].forEach((attr) => overlay.removeAttribute(attr));

    // Maximum x and y values are imposed by content size and overlay limits.
    const { xMax, xMin, yMax } = overlay.getBoundaries();
    // Reuse saved x and y event values, in order to this method be used async
    // in the `vaadin-overlay-change` which guarantees that overlay is ready.
    // The valus represent an anchor position on the page where the contextmenu
    // event took place.
    const x = this.__x;
    const y = this.__y;

    // Select one overlay corner and move to the event x/y position.
    // Then set styling attrs for flex-aligning the content appropriately.
    const wdthVport = document.documentElement.clientWidth;
    const hghtVport = document.documentElement.clientHeight;

    if (!this.__isRTL) {
      if (x < wdthVport / 2 || x < xMax) {
        // Menu is displayed in the right side of the anchor
        style.left = `${x}px`;
      } else {
        // Menu is displayed in the left side of the anchor
        style.right = `${Math.max(0, wdthVport - x)}px`;
        this._setEndAligned(overlay);
      }
    } else if (x > wdthVport / 2 || x > xMin) {
      // Menu is displayed in the right side of the anchor
      style.right = `${Math.max(0, wdthVport - x)}px`;
    } else {
      // Menu is displayed in the left side of the anchor
      style.left = `${x}px`;
      this._setEndAligned(overlay);
    }

    if (y < hghtVport / 2 || y < yMax) {
      style.top = `${y}px`;
    } else {
      style.bottom = `${Math.max(0, hghtVport - y)}px`;
      overlay.setAttribute('bottom-aligned', '');
    }
  }

  /** @private */
  _setEndAligned(element) {
    element.setAttribute('end-aligned', '');
    if (!this.__isRTL) {
      element.setAttribute('right-aligned', '');
    }
  }

  /** @private */
  _getEventCoordinate(event, coord) {
    if (event.detail instanceof Object) {
      if (event.detail[coord]) {
        // Polymer gesture events, get coordinate from detail
        return event.detail[coord];
      } else if (event.detail.sourceEvent) {
        // Unwrap detailed event
        return this._getEventCoordinate(event.detail.sourceEvent, coord);
      }
    } else {
      const prop = `client${coord.toUpperCase()}`;
      const position = event.changedTouches ? event.changedTouches[0][prop] : event[prop];

      if (position === 0) {
        // Native keyboard event
        const rect = event.target.getBoundingClientRect();
        return coord === 'x' ? rect.left : rect.top + rect.height;
      }
      // Native mouse or touch event
      return position;
    }
  }

  /** @private */
  _listen(node, evType, handler) {
    if (gestures[evType]) {
      addListener(node, evType, handler);
    } else {
      node.addEventListener(evType, handler);
    }
  }

  /** @private */
  _unlisten(node, evType, handler) {
    if (gestures[evType]) {
      removeListener(node, evType, handler);
    } else {
      node.removeEventListener(evType, handler);
    }
  }

  /** @private */
  _onGlobalContextMenu(e) {
    if (!e.shiftKey) {
      e.preventDefault();
      this.close();
    }
  }

  /**
   * Fired when an item is selected when the context menu is populated using the `items` API.
   *
   * @event item-selected
   * @param {Object} detail
   * @param {Object} detail.value the selected menu item
   */
}

customElements.define(ContextMenu.is, ContextMenu);
export { ContextMenu };
