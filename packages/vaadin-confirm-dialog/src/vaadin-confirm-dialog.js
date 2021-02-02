/**
 * @license
 * Copyright (c) 2018 - 2021 Vaadin Ltd
 * This program is available under Commercial Vaadin Developer License 4.0, available at https://vaadin.com/license/cvdl-4.0.
 */
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';
import '@vaadin/vaadin-license-checker/vaadin-license-checker.js';
import '@vaadin/vaadin-button/src/vaadin-button.js';
import '@vaadin/vaadin-dialog/src/vaadin-dialog.js';

/**
 * `<vaadin-confirm-dialog>` is a Web Component for showing alerts and asking for user confirmation.
 *
 * ```
 * <vaadin-confirm-dialog cancel>
 *   There are unsaved changes. Do you really want to leave?
 * </vaadin-confirm-dialog>
 * ```
 *
 * ### Styling
 *
 * The following Shadow DOM parts are available for styling the dialog parts:
 *
 * Part name  | Description
 * -----------|---------------------------------------------------------|
 * `header`   | Header of the confirmation dialog
 * `message`  | Container for the message of the dialog
 * `footer`   | Container for the buttons
 *
 * See [ThemableMixin – how to apply styles for shadow parts](https://github.com/vaadin/vaadin-themable-mixin/wiki)
 *
 * ### Custom content
 *
 * The following parts are available for replacement:
 *
 * Slot name         | Description
 * ------------------|---------------------------------------------------------|
 * `header`          | Header of the confirmation dialog
 * `message`         | Container for the message of the dialog
 * `cancel-button`   | Container for the Cancel button
 * `reject-button`   | Container for the Reject button
 * `confirm-button`  | Container for the Confirm button
 *
 * @fires {Event} confirm - Fired when Confirm button was pressed.
 * @fires {Event} cancel - Fired when Cancel button or Escape key was pressed.
 * @fires {Event} reject - Fired when Reject button was pressed.
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 *
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
class ConfirmDialogElement extends ElementMixin(ThemableMixin(PolymerElement)) {
  static get template() {
    return html`
      <style>
        :host {
          display: none;
          --_vaadin-confirm-dialog-content-width: auto;
          --_vaadin-confirm-dialog-content-height: auto;
          --_vaadin-confirm-dialog-footer-height: auto;
        }
      </style>
      <vaadin-dialog
        id="dialog"
        opened="{{opened}}"
        aria-label="[[_getAriaLabel(header)]]"
        theme$="_vaadin-confirm-dialog-dialog-overlay-theme [[theme]]"
        no-close-on-outside-click
        no-close-on-esc="[[noCloseOnEsc]]"
      >
        <template>
          <div id="content">
            <div part="header">
              <slot name="header">
                <h3 class="header">[[header]]</h3>
              </slot>
            </div>

            <div part="message" id="message">
              <slot></slot>
              [[message]]
            </div>
          </div>

          <div part="footer">
            <div class="cancel-button">
              <slot name="cancel-button">
                <vaadin-button
                  id="cancel"
                  theme$="[[cancelTheme]]"
                  on-click="_cancel"
                  hidden$="[[!cancel]]"
                  aria-describedby="message"
                >
                  [[cancelText]]
                </vaadin-button>
              </slot>
            </div>
            <div class="reject-button">
              <slot name="reject-button">
                <vaadin-button
                  id="reject"
                  theme$="[[rejectTheme]]"
                  on-click="_reject"
                  hidden$="[[!reject]]"
                  aria-describedby="message"
                >
                  [[rejectText]]
                </vaadin-button>
              </slot>
            </div>
            <div class="confirm-button">
              <slot name="confirm-button">
                <vaadin-button id="confirm" theme$="[[confirmTheme]]" on-click="_confirm" aria-describedby="message">
                  [[confirmText]]
                </vaadin-button>
              </slot>
            </div>
          </div>
        </template>
      </vaadin-dialog>
    `;
  }

  static get is() {
    return 'vaadin-confirm-dialog';
  }

  static get version() {
    return '3.0.0-alpha1';
  }

  static get properties() {
    return {
      /**
       * True if the overlay is currently displayed.
       * @type {boolean}
       */
      opened: {
        type: Boolean,
        value: false,
        notify: true,
        observer: '_openedChanged'
      },

      /**
       * Set the confirmation dialog title.
       * @type {string}
       */
      header: {
        type: String,
        value: ''
      },

      /**
       * Set the message or confirmation question.
       */
      message: {
        type: String
      },

      /**
       * Text displayed on confirm-button.
       * @attr {string} confirm-text
       * @type {string}
       */
      confirmText: {
        type: String,
        value: 'Confirm'
      },

      /**
       * Theme for a confirm-button.
       * @attr {string} confirm-theme
       * @type {string}
       */
      confirmTheme: {
        type: String,
        value: 'primary'
      },

      /**
       * Set to true to disable closing dialog on Escape press
       * @attr {boolean} no-close-on-esc
       * @type {boolean}
       */
      noCloseOnEsc: {
        type: Boolean,
        value: false
      },

      /**
       * Whether to show cancel button or not.
       * @type {boolean}
       */
      reject: {
        type: Boolean,
        reflectToAttribute: true,
        value: false
      },

      /**
       * Text displayed on reject-button.
       * @attr {string} reject-text
       * @type {string}
       */
      rejectText: {
        type: String,
        value: 'Reject'
      },

      /**
       * Theme for a reject-button.
       * @attr {string} reject-theme
       * @type {string}
       */
      rejectTheme: {
        type: String,
        value: 'error tertiary'
      },

      /**
       * Whether to show cancel button or not.
       * @type {boolean}
       */
      cancel: {
        type: Boolean,
        reflectToAttribute: true,
        value: false
      },

      /**
       * Text displayed on cancel-button.
       * @attr {string} cancel-text
       * @type {string}
       */
      cancelText: {
        type: String,
        value: 'Cancel'
      },

      /**
       * Theme for a cancel-button.
       * @attr {string} cancel-theme
       * @type {string}
       */
      cancelTheme: {
        type: String,
        value: 'tertiary'
      },

      /** @private */
      _confirmButton: {
        type: Element
      }
    };
  }

  /** @protected */
  static _finalizeClass() {
    super._finalizeClass();

    const devModeCallback = window.Vaadin.developmentModeCallback;
    const licenseChecker = devModeCallback && devModeCallback['vaadin-license-checker'];
    /* c8 ignore next 3 */
    if (typeof licenseChecker === 'function') {
      licenseChecker(ConfirmDialogElement);
    }
  }

  /** @protected */
  ready() {
    super.ready();
    this.$.dialog.$.overlay.addEventListener('vaadin-overlay-escape-press', this._escPressed.bind(this));
    if (this._dimensions) {
      Object.keys(this._dimensions).forEach((name) => {
        this._setDimension(name, this._dimensions[name]);
      });
    }
  }

  /**
   * @param {string} name
   * @param {?string} oldValue
   * @param {?string} newValue
   * @protected
   */
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === 'dir') {
      const value = newValue === 'rtl';
      this.__isRTL = value;
      this.opened && this.__toggleContentRTL(value);
    }
  }

  /** @private */
  __toggleContentRTL(rtl) {
    const contentBlock = this.$.dialog.$.overlay.content.querySelector('#content');
    const footerBlock = this.$.dialog.$.overlay.content.querySelector('[part=footer]');
    if (rtl) {
      contentBlock.setAttribute('dir', 'rtl');
      footerBlock.setAttribute('dir', 'rtl');
    } else {
      contentBlock.removeAttribute('dir');
      footerBlock.removeAttribute('dir');
    }
  }

  /** @private */
  _openedChanged() {
    if (!this.opened) {
      return;
    }

    const overlay = this.$.dialog.$.overlay;

    Array.from(this.childNodes).forEach((c) => {
      const newChild = overlay.$.content.appendChild(c);
      if (newChild.getAttribute && newChild.getAttribute('slot') == 'confirm-button' && newChild.focus) {
        this._confirmButton = newChild;
      }
    });

    this.__toggleContentRTL(this.__isRTL);

    requestAnimationFrame(() => {
      const confirmButton = this._confirmButton || overlay.content.querySelector('#confirm');
      confirmButton.focus();

      const { height } = getComputedStyle(overlay.content.querySelector('[part=footer]'));
      this.$.dialog.$.overlay.style.setProperty('--_vaadin-confirm-dialog-footer-height', height);
    });
  }

  /** @private */
  _escPressed(event) {
    if (!event.defaultPrevented) {
      this._cancel();
    }
  }

  /** @private */
  _confirm() {
    this.dispatchEvent(new CustomEvent('confirm'));
    this.opened = false;
  }

  /** @private */
  _cancel() {
    this.dispatchEvent(new CustomEvent('cancel'));
    this.opened = false;
  }

  /** @private */
  _reject() {
    this.dispatchEvent(new CustomEvent('reject'));
    this.opened = false;
  }

  /** @private */
  _getAriaLabel(header) {
    return header || 'confirmation';
  }

  /** @private */
  _setWidth(width) {
    this._setDimensionIfAttached('width', width);
  }

  /** @private */
  _setHeight(height) {
    this._setDimensionIfAttached('height', height);
  }

  /** @private */
  _setDimensionIfAttached(name, value) {
    if (this.$ && this.$.dialog) {
      this._setDimension(name, value);
    } else {
      this._dimensions = this._dimensions || {};
      this._dimensions[name] = value;
    }
  }

  /** @private */
  _setDimension(name, value) {
    this.$.dialog.$.overlay.style.setProperty(`--_vaadin-confirm-dialog-content-${name}`, value);
  }

  /**
   * @event confirm
   * fired when Confirm button was pressed.
   */

  /**
   * @event cancel
   * fired when Cancel button or Escape key was pressed.
   */

  /**
   * @event reject
   * fired when Reject button was pressed.
   */
}

customElements.define(ConfirmDialogElement.is, ConfirmDialogElement);

export { ConfirmDialogElement };
