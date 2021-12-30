/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

/**
 * `<vaadin-a11y-announcer>` is a singleton element for on-demand screen reader announcements.
 * It uses ARIA live region and dynamically updates its content when requested to do so.
 *
 * In order to make use of the announcer, it is best to use `A11yAnnouncerController`,
 * a reactive controller that can be added by the consumer element class:
 *
 * ```js
 * this._a11yController = new A11yAnnouncerController(this)
 * this.addController(this._a11yController);
 * ```
 *
 * After the announcer instance has been made available, you can use the method provided
 * by the controller instance to trigger the screen reader announcement:
 *
 * ```js
 * this._a11yController.announce('Session expired, please reload page.');
 * ```
 *
 * Alternatively, you can make announcements on any component by dispatching bubbling
 * `vaadin-a11y-announce` event with `detail` object containing a `text` property:
 *
 * ```js
 *   this.dispatchEvent(
 *     new CustomEvent('vaadin-a11y-announce', {
 *       bubbles: true,
 *       composed: true,
 *       detail: {
 *         text: 'Session expired, please reload page.'
 *       }
 *     })
 *   );
 * ```
 *
 * **Note:** announcements are only audible if you have a screen reader enabled.
 *
 * @extends HTMLElement
 */
export class A11yAnnouncer extends PolymerElement {
  static get is() {
    return 'vaadin-a11y-announcer';
  }

  static get template() {
    return html`
      <style>
        :host {
          display: inline-block;
          position: fixed;
          clip: rect(0px, 0px, 0px, 0px);
        }
      </style>
      <div aria-live$="[[mode]]">[[_text]]</div>
    `;
  }

  static get properties() {
    return {
      /**
       * The value of mode is used to set the `aria-live` attribute
       * for the element that will be announced. Valid values are: `off`,
       * `polite` and `assertive`.
       */
      mode: {
        type: String,
        value: 'polite'
      },

      /**
       * The timeout on refreshing the announcement text. Larger timeouts are
       * needed for certain screen readers to re-announce the same message.
       */
      timeout: {
        type: Number,
        value: 150
      },

      /** @private */
      _text: {
        type: String,
        value: ''
      }
    };
  }

  constructor() {
    super();

    if (!A11yAnnouncer.instance) {
      A11yAnnouncer.instance = this;
    }

    document.addEventListener('vaadin-a11y-announce', this._onVaadinAnnounce.bind(this));
  }

  /**
   * Cause a text string to be announced by screen readers.
   *
   * @param {string} text The text that should be announced.
   */
  announce(text) {
    this._text = '';

    setTimeout(() => {
      this._text = text;
    }, this.timeout);
  }

  /** @private */
  _onVaadinAnnounce(event) {
    this.announce(event.detail.text);
  }
}

A11yAnnouncer.instance = null;

customElements.define(A11yAnnouncer.is, A11yAnnouncer);

/**
 * A controller for handling on-demand screen reader announcements.
 */
export class A11yAnnouncerController {
  constructor(host) {
    this.host = host;
  }

  hostConnected() {
    if (!A11yAnnouncer.instance) {
      const instance = document.createElement(A11yAnnouncer.is);
      A11yAnnouncer.instance = instance;
      document.body.appendChild(instance);
    }
  }

  /**
   * Cause a text string to be announced by screen readers.
   *
   * @param {string} text The text that should be announced.
   */
  announce(text) {
    this.host.dispatchEvent(
      new CustomEvent('vaadin-a11y-announce', {
        bubbles: true,
        composed: true,
        detail: {
          text
        }
      })
    );
  }
}
