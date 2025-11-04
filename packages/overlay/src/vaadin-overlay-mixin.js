/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { isIOS } from '@vaadin/component-base/src/browser-utils.js';
import { OverlayFocusMixin } from './vaadin-overlay-focus-mixin.js';
import { OverlayStackMixin } from './vaadin-overlay-stack-mixin.js';
import { setOverlayStateAttribute } from './vaadin-overlay-utils.js';

/**
 * @polymerMixin
 * @mixes OverlayFocusMixin
 * @mixes OverlayStackMixin
 */
export const OverlayMixin = (superClass) =>
  class OverlayMixin extends OverlayFocusMixin(OverlayStackMixin(superClass)) {
    static get properties() {
      return {
        /**
         * When true, the overlay is visible and attached to body.
         */
        opened: {
          type: Boolean,
          notify: true,
          observer: '_openedChanged',
          reflectToAttribute: true,
          sync: true,
        },

        /**
         * Owner element passed with renderer function
         * @type {HTMLElement}
         */
        owner: {
          type: Object,
          sync: true,
        },

        /**
         * Object with properties that is passed to `renderer` function
         */
        model: {
          type: Object,
          sync: true,
        },

        /**
         * Custom function for rendering the content of the overlay.
         * Receives three arguments:
         *
         * - `root` The root container DOM element. Append your content to it.
         * - `owner` The host element of the renderer function.
         * - `model` The object with the properties related with rendering.
         * @type {OverlayRenderer | null | undefined}
         */
        renderer: {
          type: Object,
          sync: true,
        },

        /**
         * When true the overlay won't disable the main content, showing
         * it doesn't change the functionality of the user interface.
         * @type {boolean}
         */
        modeless: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
          observer: '_modelessChanged',
          sync: true,
        },

        /**
         * When set to true, the overlay is hidden. This also closes the overlay
         * immediately in case there is a closing animation in progress.
         * @type {boolean}
         */
        hidden: {
          type: Boolean,
          reflectToAttribute: true,
          observer: '_hiddenChanged',
          sync: true,
        },

        /**
         * When true the overlay has backdrop on top of content when opened.
         * @type {boolean}
         */
        withBackdrop: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
          observer: '_withBackdropChanged',
          sync: true,
        },
      };
    }

    static get observers() {
      return ['_rendererOrDataChanged(renderer, owner, model, opened)'];
    }

    /**
     * Override to specify another element used as a renderer root,
     * e.g. slotted into the overlay, rather than overlay itself.
     * @protected
     */
    get _rendererRoot() {
      return this;
    }

    constructor() {
      super();

      this._boundMouseDownListener = this._mouseDownListener.bind(this);
      this._boundMouseUpListener = this._mouseUpListener.bind(this);
      this._boundOutsideClickListener = this._outsideClickListener.bind(this);
      this._boundKeydownListener = this._keydownListener.bind(this);

      /* c8 ignore next 3 */
      if (isIOS) {
        this._boundIosResizeListener = () => this._detectIosNavbar();
      }
    }

    /** @protected */
    firstUpdated() {
      super.firstUpdated();

      // Set popover in firstUpdated before opened observers are called
      this.popover = 'manual';

      // Need to add dummy click listeners to this and the backdrop or else
      // the document click event listener (_outsideClickListener) may never
      // get invoked on iOS Safari (reproducible in <vaadin-dialog>
      // and <vaadin-context-menu>).
      this.addEventListener('click', () => {});
      if (this.$.backdrop) {
        this.$.backdrop.addEventListener('click', () => {});
      }

      this.addEventListener('mouseup', () => {
        // In Chrome, focus moves to body on overlay content mousedown
        // See https://github.com/vaadin/flow-components/issues/5507
        if (document.activeElement === document.body && this.$.overlay.getAttribute('tabindex') === '0') {
          this.$.overlay.focus();
        }
      });
    }

    /** @protected */
    connectedCallback() {
      super.connectedCallback();

      /* c8 ignore next 3 */
      if (this._boundIosResizeListener) {
        this._detectIosNavbar();
        window.addEventListener('resize', this._boundIosResizeListener);
      }
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();

      if (this.__scheduledOpen) {
        cancelAnimationFrame(this.__scheduledOpen);
        this.__scheduledOpen = null;
      }

      /* c8 ignore next 3 */
      if (this._boundIosResizeListener) {
        window.removeEventListener('resize', this._boundIosResizeListener);
      }
    }

    /**
     * Requests an update for the content of the overlay.
     * While performing the update, it invokes the renderer passed in the `renderer` property.
     *
     * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
     */
    requestContentUpdate() {
      if (this.renderer) {
        this.renderer.call(this.owner, this._rendererRoot, this.owner, this.model);
      }
    }

    /**
     * @param {Event=} sourceEvent
     */
    close(sourceEvent) {
      // Dispatch the event on the overlay. Not using composed, as propagating the event through shadow roots could have
      // side effects when nesting overlays
      const event = new CustomEvent('vaadin-overlay-close', {
        bubbles: true,
        cancelable: true,
        detail: { overlay: this, sourceEvent },
      });
      this.dispatchEvent(event);
      // To allow listening for the event globally, also dispatch it on the document body
      document.body.dispatchEvent(event);
      if (!event.defaultPrevented) {
        this.opened = false;
      }
    }

    /**
     * Updates the coordinates of the overlay.
     * @param {!OverlayBoundsParam} bounds
     * @param {boolean} absolute
     */
    setBounds(bounds, absolute = true) {
      const overlay = this.$.overlay;
      const parsedBounds = { ...bounds };

      if (absolute && overlay.style.position !== 'absolute') {
        overlay.style.position = 'absolute';
      }

      Object.keys(parsedBounds).forEach((arg) => {
        // Allow setting width or height to `null`
        if (parsedBounds[arg] !== null && !isNaN(parsedBounds[arg])) {
          parsedBounds[arg] = `${parsedBounds[arg]}px`;
        }
      });

      Object.assign(overlay.style, parsedBounds);
    }

    /** @private */
    _detectIosNavbar() {
      /* c8 ignore next 15 */
      if (!this.opened) {
        return;
      }

      const innerHeight = window.innerHeight;
      const innerWidth = window.innerWidth;

      const landscape = innerWidth > innerHeight;

      const clientHeight = document.documentElement.clientHeight;

      if (landscape && clientHeight > innerHeight) {
        this.style.setProperty('--vaadin-overlay-viewport-bottom', `${clientHeight - innerHeight}px`);
      } else {
        this.style.setProperty('--vaadin-overlay-viewport-bottom', '0');
      }
    }

    /**
     * Whether to add global listeners for closing on outside click.
     * By default, listeners are not added for a modeless overlay.
     *
     * @return {boolean}
     * @protected
     */
    _shouldAddGlobalListeners() {
      return !this.modeless;
    }

    /** @private */
    _addGlobalListeners() {
      if (this.__hasGlobalListeners) {
        return;
      }

      this.__hasGlobalListeners = true;

      document.addEventListener('mousedown', this._boundMouseDownListener);
      document.addEventListener('mouseup', this._boundMouseUpListener);
      // Firefox leaks click to document on contextmenu even if prevented
      // https://bugzilla.mozilla.org/show_bug.cgi?id=990614
      document.documentElement.addEventListener('click', this._boundOutsideClickListener, true);
    }

    /** @private */
    _removeGlobalListeners() {
      if (!this.__hasGlobalListeners) {
        return;
      }

      this.__hasGlobalListeners = false;

      document.removeEventListener('mousedown', this._boundMouseDownListener);
      document.removeEventListener('mouseup', this._boundMouseUpListener);
      document.documentElement.removeEventListener('click', this._boundOutsideClickListener, true);
    }

    /** @private */
    _rendererOrDataChanged(renderer, owner, model, opened) {
      const ownerOrModelChanged = this._oldOwner !== owner || this._oldModel !== model;
      this._oldModel = model;
      this._oldOwner = owner;

      const rendererChanged = this._oldRenderer !== renderer;
      const hasOldRenderer = this._oldRenderer !== undefined;
      this._oldRenderer = renderer;

      const openedChanged = this._oldOpened !== opened;
      this._oldOpened = opened;

      if (rendererChanged && hasOldRenderer) {
        this._rendererRoot.innerHTML = '';
        // Whenever a Lit-based renderer is used, it assigns a Lit part to the node it was rendered into.
        // When clearing the rendered content, this part needs to be manually disposed of.
        // Otherwise, using a Lit-based renderer on the same node will throw an exception or render nothing afterward.
        delete this._rendererRoot._$litPart$;
      }

      if (opened && renderer && (rendererChanged || openedChanged || ownerOrModelChanged)) {
        this.requestContentUpdate();
      }
    }

    /** @private */
    _modelessChanged(modeless) {
      if (this.opened) {
        // Add / remove listeners if modeless is changed while opened
        if (this._shouldAddGlobalListeners()) {
          this._addGlobalListeners();
        } else {
          this._removeGlobalListeners();
        }
      }

      if (!modeless) {
        if (this.opened) {
          this._enterModalState();
        }
      } else {
        this._exitModalState();
      }
      setOverlayStateAttribute(this, 'modeless', modeless);
    }

    /** @private */
    _withBackdropChanged(withBackdrop) {
      setOverlayStateAttribute(this, 'with-backdrop', withBackdrop);
    }

    /** @private */
    _openedChanged(opened, wasOpened) {
      if (opened) {
        // Prevent possible errors on setting `opened` to `true` while disconnected
        if (!this.isConnected) {
          this.opened = false;
          return;
        }

        this._saveFocus();

        this._animatedOpening();

        this.__scheduledOpen = requestAnimationFrame(() => {
          setTimeout(() => {
            this._trapFocus();

            // Dispatch the event on the overlay. Not using composed, as propagating the event through shadow roots
            // could have side effects when nesting overlays
            const event = new CustomEvent('vaadin-overlay-open', { detail: { overlay: this }, bubbles: true });
            this.dispatchEvent(event);
            // To allow listening for the event globally, also dispatch it on the document body
            document.body.dispatchEvent(event);
          });
        });

        document.addEventListener('keydown', this._boundKeydownListener);

        if (this._shouldAddGlobalListeners()) {
          this._addGlobalListeners();
        }
      } else if (wasOpened) {
        if (this.__scheduledOpen) {
          cancelAnimationFrame(this.__scheduledOpen);
          this.__scheduledOpen = null;
        }

        this._resetFocus();

        this._animatedClosing();

        document.removeEventListener('keydown', this._boundKeydownListener);

        if (this._shouldAddGlobalListeners()) {
          this._removeGlobalListeners();
        }
      }
    }

    /** @private */
    _hiddenChanged(hidden) {
      if (hidden && this.hasAttribute('closing')) {
        this._flushAnimation('closing');
      }
    }

    /**
     * @return {boolean}
     * @private
     */
    _shouldAnimate() {
      const style = getComputedStyle(this);
      const name = style.getPropertyValue('animation-name');
      const hidden = style.getPropertyValue('display') === 'none';
      return !hidden && name && name !== 'none';
    }

    /**
     * @param {string} type
     * @param {Function} callback
     * @private
     */
    _enqueueAnimation(type, callback) {
      const handler = `__${type}Handler`;
      const listener = (event) => {
        if (event && event.target !== this) {
          return;
        }
        callback();
        this.removeEventListener('animationend', listener);
        delete this[handler];
      };
      this[handler] = listener;
      this.addEventListener('animationend', listener);
    }

    /**
     * @param {string} type
     * @protected
     */
    _flushAnimation(type) {
      const handler = `__${type}Handler`;
      if (typeof this[handler] === 'function') {
        this[handler]();
      }
    }

    /** @private */
    _animatedOpening() {
      if (this._isAttached && this.hasAttribute('closing')) {
        this._flushAnimation('closing');
      }
      this._attachOverlay();
      this._appendAttachedInstance();
      this.bringToFront();
      if (!this.modeless) {
        this._enterModalState();
      }
      setOverlayStateAttribute(this, 'opening', true);

      if (this._shouldAnimate()) {
        this._enqueueAnimation('opening', () => {
          this._finishOpening();
        });
      } else {
        this._finishOpening();
      }
    }

    /** @private */
    _attachOverlay() {
      this.showPopover();
    }

    /** @private */
    _finishOpening() {
      setOverlayStateAttribute(this, 'opening', false);
    }

    /** @private */
    _finishClosing() {
      this._detachOverlay();
      this._removeAttachedInstance();
      this.$.overlay.style.removeProperty('pointer-events');
      setOverlayStateAttribute(this, 'closing', false);
      this.dispatchEvent(new CustomEvent('vaadin-overlay-closed'));
    }

    /** @private */
    _animatedClosing() {
      if (this.hasAttribute('opening')) {
        this._flushAnimation('opening');
      }
      if (this._isAttached) {
        this._exitModalState();
        setOverlayStateAttribute(this, 'closing', true);
        this.dispatchEvent(new CustomEvent('vaadin-overlay-closing'));

        if (this._shouldAnimate()) {
          this._enqueueAnimation('closing', () => {
            this._finishClosing();
          });
        } else {
          this._finishClosing();
        }
      }
    }

    /** @private */
    _detachOverlay() {
      this.hidePopover();
    }

    /** @private */
    _mouseDownListener(event) {
      this._mouseDownInside = event.composedPath().indexOf(this.$.overlay) >= 0;
    }

    /** @private */
    _mouseUpListener(event) {
      this._mouseUpInside = event.composedPath().indexOf(this.$.overlay) >= 0;
    }

    /**
     * Whether to close the overlay on outside click or not.
     * Override this method to customize the closing logic.
     *
     * @param {Event} _event
     * @return {boolean}
     * @protected
     */
    _shouldCloseOnOutsideClick(_event) {
      return this._last;
    }

    /**
     * Outside click listener used in capture phase to close the overlay before
     * propagating the event to the listener on the element that triggered it.
     * Otherwise, calling `open()` would result in closing and re-opening.
     *
     * @private
     */
    _outsideClickListener(event) {
      if (event.composedPath().includes(this.$.overlay) || this._mouseDownInside || this._mouseUpInside) {
        this._mouseDownInside = false;
        this._mouseUpInside = false;
        return;
      }

      if (!this._shouldCloseOnOutsideClick(event)) {
        return;
      }

      const evt = new CustomEvent('vaadin-overlay-outside-click', {
        cancelable: true,
        detail: { sourceEvent: event },
      });
      this.dispatchEvent(evt);

      if (this.opened && !evt.defaultPrevented) {
        this.close(event);
      }
    }

    /**
     * Listener used to close whe overlay on Escape press, if it is the last one.
     * @private
     */
    _keydownListener(event) {
      if (!this._last || event.defaultPrevented) {
        return;
      }

      // Only close modeless overlay on Esc press when it contains focus
      if (!this._shouldAddGlobalListeners() && !event.composedPath().includes(this._focusTrapRoot)) {
        return;
      }

      if (event.key === 'Escape') {
        const evt = new CustomEvent('vaadin-overlay-escape-press', {
          cancelable: true,
          detail: { sourceEvent: event },
        });
        this.dispatchEvent(evt);

        if (this.opened && !evt.defaultPrevented) {
          this.close(event);
        }
      }
    }
  };
