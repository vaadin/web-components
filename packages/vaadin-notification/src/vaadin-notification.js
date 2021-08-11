/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';
import { processTemplates } from '@vaadin/vaadin-element-mixin/templates.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';
import { isTemplateResult } from 'lit/directive-helpers.js';
import { render } from 'lit';

/**
 * An element used internally by `<vaadin-notification>`. Not intended to be used separately.
 *
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 * @private
 */
class NotificationContainer extends ThemableMixin(ElementMixin(PolymerElement)) {
  static get template() {
    return html`
      <style>
        :host {
          position: fixed;
          z-index: 1000;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          box-sizing: border-box;

          display: flex;
          flex-direction: column;
          align-items: stretch;
          pointer-events: none;
        }

        [region-group] {
          flex: 1 1 0%;
          display: flex;
        }

        [region-group='top'] {
          align-items: flex-start;
        }

        [region-group='bottom'] {
          align-items: flex-end;
        }

        [region-group] > [region] {
          flex: 1 1 0%;
        }

        @media (max-width: 420px) {
          [region-group] {
            flex-direction: column;
            align-items: stretch;
          }

          [region-group='top'] {
            justify-content: flex-start;
          }

          [region-group='bottom'] {
            justify-content: flex-end;
          }

          [region-group] > [region] {
            flex: initial;
          }
        }
      </style>

      <div region="top-stretch"><slot name="top-stretch"></slot></div>
      <div region-group="top">
        <div region="top-start"><slot name="top-start"></slot></div>
        <div region="top-center"><slot name="top-center"></slot></div>
        <div region="top-end"><slot name="top-end"></slot></div>
      </div>
      <div region="middle"><slot name="middle"></slot></div>
      <div region-group="bottom">
        <div region="bottom-start"><slot name="bottom-start"></slot></div>
        <div region="bottom-center"><slot name="bottom-center"></slot></div>
        <div region="bottom-end"><slot name="bottom-end"></slot></div>
      </div>
      <div region="bottom-stretch"><slot name="bottom-stretch"></slot></div>
    `;
  }

  static get is() {
    return 'vaadin-notification-container';
  }

  static get properties() {
    return {
      /**
       * True when the container is opened
       * @type {boolean}
       */
      opened: {
        type: Boolean,
        value: false,
        observer: '_openedChanged'
      }
    };
  }

  /** @private */
  _openedChanged(opened) {
    if (opened) {
      document.body.appendChild(this);
      if (this._boundIosResizeListener) {
        this._detectIosNavbar();
        window.addEventListener('resize', this._boundIosResizeListener);
      }
    } else {
      document.body.removeChild(this);
      if (this._boundIosResizeListener) {
        window.removeEventListener('resize', this._boundIosResizeListener);
      }
    }
  }

  constructor() {
    super();

    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      this._boundIosResizeListener = () => this._detectIosNavbar();
    }
  }

  /** @private */
  _detectIosNavbar() {
    const innerHeight = window.innerHeight;
    const innerWidth = window.innerWidth;
    const landscape = innerWidth > innerHeight;
    const clientHeight = document.documentElement.clientHeight;
    if (landscape && clientHeight > innerHeight) {
      this.style.bottom = clientHeight - innerHeight + 'px';
    } else {
      this.style.bottom = '0';
    }
  }
}

/**
 * An element used internally by `<vaadin-notification>`. Not intended to be used separately.
 *
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @private
 */
class NotificationCard extends ThemableMixin(PolymerElement) {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }

        [part='overlay'] {
          pointer-events: auto;
        }
      </style>

      <div part="overlay">
        <div part="content">
          <slot></slot>
        </div>
      </div>
    `;
  }

  static get is() {
    return 'vaadin-notification-card';
  }

  /** @protected */
  ready() {
    super.ready();
    this.setAttribute('role', 'alert');
    this.setAttribute('aria-live', 'polite');
  }
}

/**
 * `<vaadin-notification>` is a Web Component providing accessible and customizable notifications (toasts).
 *
 * ### Rendering
 *
 * The content of the notification can be populated by using the renderer callback function.
 *
 * The renderer function provides `root`, `notification` arguments.
 * Generate DOM content, append it to the `root` element and control the state
 * of the host element by accessing `notification`. Before generating new content,
 * users are able to check if there is already content in `root` for reusing it.
 *
 * ```html
 * <vaadin-notification id="notification"></vaadin-notification>
 * ```
 * ```js
 * const notification = document.querySelector('#notification');
 * notification.renderer = function(root, notification) {
 *   root.textContent = "Your work has been saved";
 * };
 * ```
 *
 * Renderer is called on the opening of the notification.
 * DOM generated during the renderer call can be reused
 * in the next renderer call and will be provided with the `root` argument.
 * On first call it will be empty.
 *
 * ### Styling
 *
 * `<vaadin-notification>` uses `<vaadin-notification-card>` internal
 * themable component as the actual visible notification cards.
 *
 * The following shadow DOM parts of the `<vaadin-notification-card>` are available for styling:
 *
 * Part name | Description
 * ----------------|----------------
 * `overlay` | The notification container
 * `content` | The content of the notification
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * Note: the `theme` attribute value set on `<vaadin-notification>` is
 * propagated to the internal `<vaadin-notification-card>`.
 *
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 *
 * @extends HTMLElement
 * @mixes ThemePropertyMixin
 * @mixes ElementMixin
 */
class NotificationElement extends ThemePropertyMixin(ElementMixin(PolymerElement)) {
  static get template() {
    return html`
      <style>
        :host {
          display: none;
        }
      </style>
      <vaadin-notification-card theme$="[[theme]]"> </vaadin-notification-card>
    `;
  }

  static get is() {
    return 'vaadin-notification';
  }

  static get version() {
    return '22.0.0-alpha1';
  }

  static get properties() {
    return {
      /**
       * The duration in milliseconds to show the notification.
       * Set to `0` or a negative number to disable the notification auto-closing.
       * @type {number}
       */
      duration: {
        type: Number,
        value: 5000
      },

      /**
       * True if the notification is currently displayed.
       * @type {boolean}
       */
      opened: {
        type: Boolean,
        value: false,
        notify: true,
        observer: '_openedChanged'
      },

      /**
       * Alignment of the notification in the viewport
       * Valid values are `top-stretch|top-start|top-center|top-end|middle|bottom-start|bottom-center|bottom-end|bottom-stretch`
       * @type {!NotificationPosition}
       */
      position: {
        type: String,
        value: 'bottom-start',
        observer: '_positionChanged'
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
      renderer: Function
    };
  }

  static get observers() {
    return ['_durationChanged(duration, opened)', '_rendererChanged(renderer, opened, _card)'];
  }

  /** @protected */
  ready() {
    super.ready();

    this._card = this.shadowRoot.querySelector('vaadin-notification-card');

    processTemplates(this);
  }

  /**
   * Requests an update for the content of the notification.
   * While performing the update, it invokes the renderer passed in the `renderer` property.
   *
   * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
   */
  requestContentUpdate() {
    if (!this.renderer) return;

    this.renderer(this._card, this);
  }

  /**
   * Manually invoke existing renderer.
   *
   * @deprecated Since Vaadin 21, `render()` is deprecated. Please use `requestContentUpdate()` instead.
   */
  render() {
    console.warn('WARNING: Since Vaadin 21, render() is deprecated. Please use requestContentUpdate() instead.');

    this.requestContentUpdate();
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
  get _container() {
    if (!NotificationElement._container) {
      NotificationElement._container = document.createElement('vaadin-notification-container');
      document.body.appendChild(NotificationElement._container);
    }
    return NotificationElement._container;
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
  _animatedAppendNotificationCard() {
    if (this._card) {
      this._card.setAttribute('opening', '');
      this._appendNotificationCard();
      const listener = () => {
        this._card.removeEventListener('animationend', listener);
        this._card.removeAttribute('opening');
      };
      this._card.addEventListener('animationend', listener);
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

    this._card.slot = this.position;
    if (this._container.firstElementChild && /top/.test(this.position)) {
      this._container.insertBefore(this._card, this._container.firstElementChild);
    } else {
      this._container.appendChild(this._card);
    }
  }

  /** @private */
  _removeNotificationCard() {
    this._card.parentNode && this._card.parentNode.removeChild(this._card);
    this._card.removeAttribute('closing');
    this._container.opened = Boolean(this._container.firstElementChild);
  }

  /** @private */
  _closeNotificationCard() {
    this._durationTimeoutId && clearTimeout(this._durationTimeoutId);
    this._animatedRemoveNotificationCard();
  }

  /** @private */
  _animatedRemoveNotificationCard() {
    this._card.setAttribute('closing', '');
    const name = getComputedStyle(this._card).getPropertyValue('animation-name');
    if (name && name != 'none') {
      const listener = () => {
        this._removeNotificationCard();
        this._card.removeEventListener('animationend', listener);
      };
      this._card.addEventListener('animationend', listener);
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

  static show(contents, duration, position) {
    if (isTemplateResult(contents)) {
      return NotificationElement._createAndShowNotification(duration, position, (root) => {
        render(contents, root);
      });
    } else {
      return NotificationElement._createAndShowNotification(duration, position, (root) => {
        root.innerText = contents;
      });
    }
  }

  /** @private */
  static _createAndShowNotification(duration, position, renderer) {
    const notification = document.createElement(NotificationElement.is);
    notification.duration = duration || 5000;
    notification.position = position || 'bottom-start';
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
}

customElements.define(NotificationContainer.is, NotificationContainer);
customElements.define(NotificationCard.is, NotificationCard);
customElements.define(NotificationElement.is, NotificationElement);

export { NotificationElement };
