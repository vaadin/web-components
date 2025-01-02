/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { render } from 'lit';
import { isTemplateResult } from 'lit/directive-helpers.js';
import { isIOS } from '@vaadin/component-base/src/browser-utils.js';
import { OverlayClassMixin } from '@vaadin/component-base/src/overlay-class-mixin.js';
import { processTemplates } from '@vaadin/component-base/src/templates.js';
import { OverlayStackMixin } from '@vaadin/overlay/src/vaadin-overlay-stack-mixin.js';
import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';

/**
 * A mixin providing common notification container functionality.
 *
 * @polymerMixin
 * @mixes OverlayStackMixin
 */
export const NotificationContainerMixin = (superClass) =>
  class extends OverlayStackMixin(superClass) {
    static get properties() {
      return {
        /**
         * True when the container is opened
         * @type {boolean}
         */
        opened: {
          type: Boolean,
          value: false,
          sync: true,
          observer: '_openedChanged',
        },
      };
    }

    constructor() {
      super();

      this._boundVaadinOverlayClose = this._onVaadinOverlayClose.bind(this);
      if (isIOS) {
        this._boundIosResizeListener = () => this._detectIosNavbar();
      }
    }

    /** @private */
    _openedChanged(opened) {
      if (opened) {
        document.body.appendChild(this);
        document.addEventListener('vaadin-overlay-close', this._boundVaadinOverlayClose);
        if (this._boundIosResizeListener) {
          this._detectIosNavbar();
          window.addEventListener('resize', this._boundIosResizeListener);
        }
      } else {
        document.body.removeChild(this);
        document.removeEventListener('vaadin-overlay-close', this._boundVaadinOverlayClose);
        if (this._boundIosResizeListener) {
          window.removeEventListener('resize', this._boundIosResizeListener);
        }
      }
    }

    /** @private */
    _detectIosNavbar() {
      const innerHeight = window.innerHeight;
      const innerWidth = window.innerWidth;
      const landscape = innerWidth > innerHeight;
      const clientHeight = document.documentElement.clientHeight;
      if (landscape && clientHeight > innerHeight) {
        this.style.bottom = `${clientHeight - innerHeight}px`;
      } else {
        this.style.bottom = '0';
      }
    }

    /** @private */
    _onVaadinOverlayClose(event) {
      // Notifications are a separate overlay mechanism from vaadin-overlay, and
      // interacting with them should not close modal overlays
      const sourceEvent = event.detail.sourceEvent;
      const isFromNotification = sourceEvent && sourceEvent.composedPath().indexOf(this) >= 0;
      if (isFromNotification) {
        event.preventDefault();
      }
    }
  };

/**
 * A mixin providing common notification functionality.
 *
 * @polymerMixin
 * @mixes OverlayClassMixin
 * @mixes ThemePropertyMixin
 */
export const NotificationMixin = (superClass) =>
  class extends ThemePropertyMixin(OverlayClassMixin(superClass)) {
    static get properties() {
      return {
        /**
         * When true, the notification card has `aria-live` attribute set to
         * `assertive` instead of `polite`. This makes screen readers announce
         * the notification content immediately when it appears.
         */
        assertive: {
          type: Boolean,
          value: false,
          sync: true,
        },

        /**
         * The duration in milliseconds to show the notification.
         * Set to `0` or a negative number to disable the notification auto-closing.
         * @type {number}
         */
        duration: {
          type: Number,
          value: 5000,
          sync: true,
        },

        /**
         * True if the notification is currently displayed.
         * @type {boolean}
         */
        opened: {
          type: Boolean,
          value: false,
          notify: true,
          sync: true,
          observer: '_openedChanged',
        },

        /**
         * Alignment of the notification in the viewport
         * Valid values are `top-stretch|top-start|top-center|top-end|middle|bottom-start|bottom-center|bottom-end|bottom-stretch`
         * @type {!NotificationPosition}
         */
        position: {
          type: String,
          value: 'bottom-start',
          observer: '_positionChanged',
          sync: true,
        },

        /**
         * Custom function for rendering the content of the notification.
         * Receives two arguments:
         *
         * - `root` The `<vaadin-notification-card>` DOM element. Append
         *   your content to it.
         * - `notification` The reference to the `<vaadin-notification>` element.
         * @type {!NotificationRenderer | undefined}
         */
        renderer: {
          type: Function,
          sync: true,
        },
      };
    }

    static get observers() {
      return ['_durationChanged(duration, opened)', '_rendererChanged(renderer, opened, _overlayElement)'];
    }

    /**
     * Shows a notification with the given content.
     * By default, positions the notification at `bottom-start` and uses a 5 second duration.
     * An options object can be passed to configure the notification.
     * The options object has the following structure:
     *
     * ```
     * {
     *   assertive?: boolean
     *   position?: string
     *   duration?: number
     *   theme?: string
     * }
     * ```
     *
     * See the individual documentation for:
     * - [`assertive`](#/elements/vaadin-notification#property-assertive)
     * - [`position`](#/elements/vaadin-notification#property-position)
     * - [`duration`](#/elements/vaadin-notification#property-duration)
     *
     * @param contents the contents to show, either as a string or a Lit template.
     * @param options optional options for customizing the notification.
     */
    static show(contents, options) {
      const Notification = customElements.get('vaadin-notification');
      if (isTemplateResult(contents)) {
        return Notification._createAndShowNotification((root) => {
          render(contents, root);
        }, options);
      }
      return Notification._createAndShowNotification((root) => {
        root.innerText = contents;
      }, options);
    }

    /** @private */
    static _createAndShowNotification(renderer, options) {
      const notification = document.createElement('vaadin-notification');
      if (options && Number.isFinite(options.duration)) {
        notification.duration = options.duration;
      }
      if (options && options.position) {
        notification.position = options.position;
      }
      if (options && options.assertive) {
        notification.assertive = options.assertive;
      }
      if (options && options.theme) {
        notification.setAttribute('theme', options.theme);
      }
      notification.renderer = renderer;
      document.body.appendChild(notification);
      notification.opened = true;

      notification.addEventListener('opened-changed', (e) => {
        if (!e.detail.value) {
          notification.remove();
        }
      });

      return notification;
    }

    /** @private */
    get _container() {
      const Notification = customElements.get('vaadin-notification');
      if (!Notification._container) {
        Notification._container = document.createElement('vaadin-notification-container');
        document.body.appendChild(Notification._container);
      }
      return Notification._container;
    }

    /** @protected */
    get _card() {
      return this._overlayElement;
    }

    /** @protected */
    ready() {
      super.ready();

      this._overlayElement = this.shadowRoot.querySelector('vaadin-notification-card');

      processTemplates(this);
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();
      queueMicrotask(() => {
        if (!this.isConnected) {
          this.opened = false;
        }
      });
    }

    /**
     * Requests an update for the content of the notification.
     * While performing the update, it invokes the renderer passed in the `renderer` property.
     *
     * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
     */
    requestContentUpdate() {
      if (!this.renderer || !this._card) {
        return;
      }

      this.renderer(this._card, this);
    }

    /** @private */
    __computeAriaLive(assertive) {
      return assertive ? 'assertive' : 'polite';
    }

    /** @private */
    _rendererChanged(renderer, opened, card) {
      if (!card) {
        return;
      }

      const rendererChanged = this._oldRenderer !== renderer;
      this._oldRenderer = renderer;

      if (rendererChanged) {
        card.innerHTML = '';
        // Whenever a Lit-based renderer is used, it assigns a Lit part to the node it was rendered into.
        // When clearing the rendered content, this part needs to be manually disposed of.
        // Otherwise, using a Lit-based renderer on the same node will throw an exception or render nothing afterward.
        delete card._$litPart$;
      }

      if (opened) {
        if (!this._didAnimateNotificationAppend) {
          this._animatedAppendNotificationCard();
        }
        this.requestContentUpdate();
      }
    }

    /**
     * Opens the notification.
     */
    open() {
      this.opened = true;
    }

    /**
     * Closes the notification.
     */
    close() {
      this.opened = false;
    }

    /** @private */
    _openedChanged(opened) {
      if (opened) {
        this._container.opened = true;
        this._animatedAppendNotificationCard();
      } else if (this._card) {
        this._closeNotificationCard();
      }
    }

    /** @private */
    __cleanUpOpeningClosingState() {
      this._card.removeAttribute('opening');
      this._card.removeAttribute('closing');
      this._card.removeEventListener('animationend', this.__animationEndListener);
    }

    /** @private */
    _animatedAppendNotificationCard() {
      if (this._card) {
        this.__cleanUpOpeningClosingState();

        this._card.setAttribute('opening', '');
        this._appendNotificationCard();
        this.__animationEndListener = () => this.__cleanUpOpeningClosingState();
        this._card.addEventListener('animationend', this.__animationEndListener);
        this._didAnimateNotificationAppend = true;
      } else {
        this._didAnimateNotificationAppend = false;
      }
    }

    /** @private */
    _appendNotificationCard() {
      if (!this._card) {
        return;
      }

      if (!this._container.shadowRoot.querySelector(`slot[name="${this.position}"]`)) {
        console.warn(`Invalid alignment parameter provided: position=${this.position}`);
        return;
      }

      this._container.bringToFront();

      this._card.slot = this.position;
      if (this._container.firstElementChild && /top/u.test(this.position)) {
        this._container.insertBefore(this._card, this._container.firstElementChild);
      } else {
        this._container.appendChild(this._card);
      }
    }

    /** @private */
    _removeNotificationCard() {
      if (!this._card) {
        return;
      }

      if (this._card.parentNode) {
        this._card.parentNode.removeChild(this._card);
      }
      this._card.removeAttribute('closing');
      this._container.opened = Boolean(this._container.firstElementChild);
      this.dispatchEvent(new CustomEvent('closed'));
    }

    /** @private */
    _closeNotificationCard() {
      if (this._durationTimeoutId) {
        clearTimeout(this._durationTimeoutId);
      }
      this._animatedRemoveNotificationCard();
    }

    /** @private */
    _animatedRemoveNotificationCard() {
      this.__cleanUpOpeningClosingState();

      this._card.setAttribute('closing', '');
      const name = getComputedStyle(this._card).getPropertyValue('animation-name');
      if (name && name !== 'none') {
        this.__animationEndListener = () => {
          this._removeNotificationCard();
          this.__cleanUpOpeningClosingState();
        };
        this._card.addEventListener('animationend', this.__animationEndListener);
      } else {
        this._removeNotificationCard();
      }
    }

    /** @private */
    _positionChanged() {
      if (this.opened) {
        this._animatedAppendNotificationCard();
      }
    }

    /** @private */
    _durationChanged(duration, opened) {
      if (opened) {
        clearTimeout(this._durationTimeoutId);
        if (duration > 0) {
          this._durationTimeoutId = setTimeout(() => this.close(), duration);
        }
      }
    }

    /**
     * Fired when the notification is closed.
     *
     * @event closed
     */
  };
