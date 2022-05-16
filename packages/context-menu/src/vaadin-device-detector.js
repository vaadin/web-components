/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@polymer/iron-media-query/iron-media-query.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { isTouch } from '@vaadin/component-base/src/browser-utils.js';

/**
 * Element for internal use only.
 *
 * @private
 */
class DeviceDetector extends PolymerElement {
  static get template() {
    return html`<iron-media-query query="min-device-width: 750px" query-matches="{{wide}}"></iron-media-query>`;
  }

  static get is() {
    return 'vaadin-device-detector';
  }

  static get properties() {
    return {
      /**
       * `true`, when running in a phone.
       */
      phone: {
        type: Boolean,
        computed: '_phone(wide, touch)',
        notify: true,
      },

      /**
       * `true`, when running in a touch device.
       * @default false
       */
      touch: {
        type: Boolean,
        notify: true,
        value: isTouch,
      },

      /**
       * `true`, when running in a tablet/desktop device.
       */
      wide: {
        type: Boolean,
        notify: true,
      },
    };
  }

  _phone(wide, touch) {
    return !wide && touch;
  }
}

customElements.define(DeviceDetector.is, DeviceDetector);
