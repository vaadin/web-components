/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { isElementFocusable } from '@vaadin/a11y-base/src/focus-utils.js';
import { isAndroid, isIOS } from '@vaadin/component-base/src/browser-utils.js';
import { addListener, deepTargetFind, gestures, removeListener } from '@vaadin/component-base/src/gestures.js';
import { MediaQueryController } from '@vaadin/component-base/src/media-query-controller.js';
import { ItemsMixin } from './vaadin-contextmenu-items-mixin.js';

/**
 * @polymerMixin
 * @mixes ItemsMixin
 */
export const ContextMenuMixin = (superClass) =>
  class ContextMenuMixinClass extends ItemsMixin(superClass) {
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
          sync: true,
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
          sync: true,
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
          sync: true,
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
          sync: true,
        },

        /**
         * When true, the menu overlay is modeless.
         * @protected
         */
        _modeless: {
          type: Boolean,
          sync: true,
        },

        /** @private */
        _context: {
          type: Object,
          sync: true,
        },

        /** @private */
        _phone: {
          type: Boolean,
        },

        _fullscreen: {
          type: Boolean,
        },

        _fullscreenMediaQuery: {
          type: String,
          value: '(max-width: 450px), (max-height: 450px)',
        },
      };
    }

    static get observers() {
      return [
        '_openedChanged(opened)',
        '_targetOrOpenOnChanged(listenOn, openOn)',
        '_rendererChanged(renderer, items)',
        '_fullscreenChanged(_fullscreen)',
        '_overlayContextChanged(_overlayElement, _context)',
        '_overlayModelessChanged(_overlayElement, _modeless)',
        '_overlayPhoneChanged(_overlayElement, _phone)',
        '_overlayThemeChanged(_overlayElement, _theme)',
      ];
    }

    constructor() {
      super();

      this._createOverlay();

      this._boundOpen = this.open.bind(this);
      this._boundClose = this.close.bind(this);
      this._boundPreventDefault = this._preventDefault.bind(this);
      this._boundOnGlobalContextMenu = this._onGlobalContextMenu.bind(this);
    }

    /** @protected */
    connectedCallback() {
      super.connectedCallback();

      this.__boundOnScroll = this.__onScroll.bind(this);
      window.addEventListener('scroll', this.__boundOnScroll, true);

      // Restore opened state if overlay was opened when disconnecting
      if (this.__restoreOpened) {
        this._setOpened(true);
      }
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();

      window.removeEventListener('scroll', this.__boundOnScroll, true);

      // Close overlay and memorize opened state
      this.__restoreOpened = this.opened;
      this.close();
    }

    /** @protected */
    ready() {
      super.ready();

      this.addController(
        new MediaQueryController(this._fullscreenMediaQuery, (matches) => {
          this._fullscreen = matches;
        }),
      );
    }

    /** @private */
    _createOverlay() {
      // Create an overlay in the constructor to use in observers before `ready()`
      const overlay = document.createElement(`${this._tagNamePrefix}-overlay`);
      overlay.owner = this;

      overlay.addEventListener('opened-changed', (e) => {
        this._onOverlayOpened(e);
      });

      overlay.addEventListener('vaadin-overlay-open', (e) => {
        this._onVaadinOverlayOpen(e);
      });

      this._overlayElement = overlay;
    }

    /**
     * Runs before overlay is fully rendered
     * @private
     */
    _onOverlayOpened(e) {
      const opened = e.detail.value;
      this._setOpened(opened);
      if (opened) {
        this.__alignOverlayPosition();
      }
    }

    /**
     * Runs after overlay is fully rendered
     * @private
     */
    _onVaadinOverlayOpen() {
      this.__alignOverlayPosition();
      this._overlayElement.style.opacity = '';
      this.__forwardFocus();
    }

    /** @private */
    _overlayContextChanged(overlay, context) {
      if (overlay) {
        overlay.model = context;
      }
    }

    /** @private */
    _overlayModelessChanged(overlay, modeless) {
      if (overlay) {
        overlay.modeless = modeless;
      }
    }

    /** @private */
    _overlayPhoneChanged(overlay, phone) {
      if (overlay) {
        overlay.toggleAttribute('phone', phone);
        overlay.withBackdrop = phone;
      }
    }

    /** @private */
    _overlayThemeChanged(overlay, theme) {
      if (overlay) {
        if (theme) {
          overlay.setAttribute('theme', theme);
        } else {
          overlay.removeAttribute('theme');
        }
      }
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
    _fullscreenChanged(fullScreen) {
      this._phone = fullScreen;
    }

    /** @private */
    __setListenOnUserSelect(opened) {
      const value = opened ? 'none' : '';
      // Note: these styles don't seem to work in Firefox on iOS.
      this.listenOn.style.webkitTouchCallout = value;
      this.listenOn.style.webkitUserSelect = value; // Chrome, Safari, Firefox
      this.listenOn.style.userSelect = value;

      // Note: because user-selection is disabled on the overlay
      // before opening the menu the text could be already selected
      // so we need to clear that selection
      if (opened) {
        document.getSelection().removeAllRanges();
      }
    }

    /** @private */
    _closeOnChanged(closeOn, oldCloseOn) {
      // Outside click event from overlay
      const evtOverlay = 'vaadin-overlay-outside-click';

      const overlay = this._overlayElement;

      if (oldCloseOn) {
        this._unlisten(overlay, oldCloseOn, this._boundClose);
      }
      if (closeOn) {
        this._listen(overlay, closeOn, this._boundClose);
        overlay.removeEventListener(evtOverlay, this._boundPreventDefault);
      } else {
        overlay.addEventListener(evtOverlay, this._boundPreventDefault);
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
      } else {
        document.documentElement.removeEventListener('contextmenu', this._boundOnGlobalContextMenu, true);
      }

      this.__setListenOnUserSelect(opened);

      // Has to be set after instance has been created
      this._overlayElement.opened = opened;
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

      this._overlayElement.renderer = renderer;
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
          e.preventDefault();
          e.stopPropagation();

          // Used in alignment which is delayed until overlay is rendered
          this.__x = this._getEventCoordinate(e, 'x');
          this.__pageXOffset = window.pageXOffset;

          this.__y = this._getEventCoordinate(e, 'y');
          this.__pageYOffset = window.pageYOffset;

          this._overlayElement.style.opacity = '0';
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
      const overlay = this._overlayElement;
      const style = overlay.style;

      style[coord] = `${(parseInt(style[coord]) || 0) + diff}px`;
    }

    /** @private */
    __alignOverlayPosition() {
      const overlay = this._overlayElement;

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
    __createMouseEvent(name, clientX, clientY) {
      return new MouseEvent(name, {
        bubbles: true,
        composed: true,
        cancelable: true,
        clientX,
        clientY,
      });
    }

    /** @private */
    __focusClosestFocusable(target) {
      let currentElement = target;
      while (currentElement) {
        if (currentElement instanceof HTMLElement && isElementFocusable(currentElement)) {
          currentElement.focus();
          return;
        }
        currentElement = currentElement.parentNode || currentElement.host;
      }
    }

    /**
     * Executes a synthetic contextmenu event on the target under the coordinates.
     * @private
     */
    __contextMenuAt(x, y) {
      // Get the deepest element under the coordinates
      const target = deepTargetFind(x, y);
      if (target) {
        // Need to run asynchronously to avoid timing issues with the Lit-based context menu
        queueMicrotask(() => {
          // Dispatch mousedown and mouseup to the target (grid cell focus depends on it)
          target.dispatchEvent(this.__createMouseEvent('mousedown', x, y));
          target.dispatchEvent(this.__createMouseEvent('mouseup', x, y));
          // Manually try to focus the closest focusable of the target
          this.__focusClosestFocusable(target);
          // Dispatch a contextmenu event to the target
          target.dispatchEvent(this.__createMouseEvent('contextmenu', x, y));
        });
      }
    }

    /** @private */
    _onGlobalContextMenu(e) {
      if (!e.shiftKey) {
        const isTouchDevice = isAndroid || isIOS;
        if (!isTouchDevice) {
          e.stopPropagation();
          // Prevent having the previously focused node auto-focus after closing the overlay
          this._overlayElement.__focusRestorationController.focusNode = null;
          // Dispatch another contextmenu at the same coordinates after the overlay is closed
          this._overlayElement.addEventListener(
            'vaadin-overlay-closed',
            () => this.__contextMenuAt(e.clientX, e.clientY),
            {
              once: true,
            },
          );
        }

        e.preventDefault();
        this.close();
      }
    }
  };
