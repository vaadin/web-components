/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { isIOS } from '@vaadin/component-base/src/browser-utils.js';
import { OverlayFocusMixin } from './vaadin-overlay-focus-mixin.js';
import { OverlayStackMixin } from './vaadin-overlay-stack-mixin.js';

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
          sync: true,
        },
      };
    }

    static get observers() {
      return ['_rendererOrDataChanged(renderer, owner, model, opened)'];
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
    ready() {
      super.ready();

      // Need to add dummy click listeners to this and the backdrop or else
      // the document click event listener (_outsideClickListener) may never
      // get invoked on iOS Safari (reproducible in <vaadin-dialog>
      // and <vaadin-context-menu>).
      this.addEventListener('click', () => {});
      this.$.backdrop.addEventListener('click', () => {});

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
        this.renderer.call(this.owner, this, this.owner, this.model);
      }
    }

    /**
     * @param {Event=} sourceEvent
     */
    close(sourceEvent) {
      const evt = new CustomEvent('vaadin-overlay-close', {
        bubbles: true,
        cancelable: true,
        detail: { sourceEvent },
      });
      this.dispatchEvent(evt);
      if (!evt.defaultPrevented) {
        this.opened = false;
      }
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

    /** @private */
    _addGlobalListeners() {
      document.addEventListener('mousedown', this._boundMouseDownListener);
      document.addEventListener('mouseup', this._boundMouseUpListener);
      // Firefox leaks click to document on contextmenu even if prevented
      // https://bugzilla.mozilla.org/show_bug.cgi?id=990614
      document.documentElement.addEventListener('click', this._boundOutsideClickListener, true);
    }

    /** @private */
    _removeGlobalListeners() {
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
        this.innerHTML = '';
        // Whenever a Lit-based renderer is used, it assigns a Lit part to the node it was rendered into.
        // When clearing the rendered content, this part needs to be manually disposed of.
        // Otherwise, using a Lit-based renderer on the same node will throw an exception or render nothing afterward.
        delete this._$litPart$;
      }

      if (opened && renderer && (rendererChanged || openedChanged || ownerOrModelChanged)) {
        this.requestContentUpdate();
      }
    }

    /** @private */
    _modelessChanged(modeless) {
      if (!modeless) {
        if (this.opened) {
          this._addGlobalListeners();
          this._enterModalState();
        }
      } else {
        this._removeGlobalListeners();
        this._exitModalState();
      }
    }

    /** @private */
    _openedChanged(opened, wasOpened) {
      if (opened) {
        this._saveFocus();

        this._animatedOpening();

        afterNextRender(this, () => {
          this._trapFocus();

          const evt = new CustomEvent('vaadin-overlay-open', { bubbles: true });
          this.dispatchEvent(evt);
        });

        document.addEventListener('keydown', this._boundKeydownListener);

        if (!this.modeless) {
          this._addGlobalListeners();
        }
      } else if (wasOpened) {
        this._resetFocus();

        this._animatedClosing();

        document.removeEventListener('keydown', this._boundKeydownListener);

        if (!this.modeless) {
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
      if (this.parentNode === document.body && this.hasAttribute('closing')) {
        this._flushAnimation('closing');
      }
      this._attachOverlay();
      if (!this.modeless) {
        this._enterModalState();
      }
      this.setAttribute('opening', '');

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
      this._placeholder = document.createComment('vaadin-overlay-placeholder');
      this.parentNode.insertBefore(this._placeholder, this);
      document.body.appendChild(this);
      this.bringToFront();
    }

    /** @private */
    _finishOpening() {
      this.removeAttribute('opening');
    }

    /** @private */
    _finishClosing() {
      this._detachOverlay();
      this.$.overlay.style.removeProperty('pointer-events');
      this.removeAttribute('closing');
      this.dispatchEvent(new CustomEvent('vaadin-overlay-closed'));
    }

    /** @private */
    _animatedClosing() {
      if (this.hasAttribute('opening')) {
        this._flushAnimation('opening');
      }
      if (this._placeholder) {
        this._exitModalState();
        this.setAttribute('closing', '');
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
      this._placeholder.parentNode.insertBefore(this, this._placeholder);
      this._placeholder.parentNode.removeChild(this._placeholder);
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
        bubbles: true,
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
      if (!this._last) {
        return;
      }

      // Only close modeless overlay on Esc press when it contains focus
      if (this.modeless && !event.composedPath().includes(this.$.overlay)) {
        return;
      }

      if (event.key === 'Escape') {
        const evt = new CustomEvent('vaadin-overlay-escape-press', {
          bubbles: true,
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
