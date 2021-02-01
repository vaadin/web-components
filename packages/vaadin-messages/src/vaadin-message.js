/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';

/**
 * `<vaadin-message>` is a Web Component for showing a single message with an author, message and time.
 *
 * ```html
 * <vaadin-message foo="bar">
 * </vaadin-message>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------|----------------
 * `avatar`  | The author's avatar
 *
 * See [ThemableMixin – how to apply styles for shadow parts](https://github.com/vaadin/vaadin-themable-mixin/wiki)
 *
 * The following custom properties are available:
 *
 * Custom property           | Description                              | Default
 *---------------------------|------------------------------------------|-------------
 * `--vaadin-message-value`  | value of the component (between 0 and 1) | 0
 *
 * The following state attributes are available for styling:
 *
 * Attribute       | Description      | Part name
 * ----------------|------------------|------------
 * `myattribute`   | Set an attribute | :host
 *
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @mixes ElementMixin
 */
class MessageElement extends ElementMixin(ThemableMixin(PolymerElement)) {
  static get properties() {
    return {
      /**
       * Current text value.
       */
      value: {
        type: String,
        reflectToAttribute: true
      }
    };
  }

  static get template() {
    return html`
      <style>
        :host {
          display: block;
          width: 100%; /* prevent collapsing inside non-stretching column flex */
          height: 8px;
        }

        :host([hidden]) {
          display: none !important;
        }

        [part='value'] {
          height: 100%;
        }

        /* RTL specific styles */
        :host([dir='rtl']) [part='value'] {
          transform-origin: 100% 50%;
        }
      </style>

      <div part="bar">
        <div part="value">[[value]]</div>
      </div>
    `;
  }

  ready() {
    super.ready();
    this.setAttribute('value', 'hello world');
  }

  static get is() {
    return 'vaadin-message';
  }

  static get version() {
    return '0.1.0';
  }
}

customElements.define(MessageElement.is, MessageElement);

export { MessageElement };
