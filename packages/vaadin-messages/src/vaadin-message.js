/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';
import '@vaadin/vaadin-avatar/src/vaadin-avatar.js';
/**
 * `<vaadin-message>` is a Web Component for showing a single message with an author, message and time.
 *
 * ```html
 * <vaadin-message time="2021-01-28 10:43"
 *     user='{"name":"Bob Ross","abbr":"BR","img":"/static/img/avatar.jpg"}'>There is no real ending. It's
 *     just the place where you stop the story.</vaadin-message>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------|----------------
 * `avatar`  | The author's avatar
 * `name`    | Author's name
 * `time`    | When the message was posted
 * `content` | The message itself as a slotted content
 *
 * See [ThemableMixin – how to apply styles for shadow parts](https://github.com/vaadin/vaadin-themable-mixin/wiki)
 *
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @mixes ElementMixin
 */
class MessageElement extends ElementMixin(ThemableMixin(PolymerElement)) {
  static get properties() {
    return {
      /**
       * Time of sending the message. It is rendered as-is to the part='time' slot,
       * so the formatting is up to you.
       */
      time: {
        type: String,
        reflectToAttribute: true
      },
      /**
       * A user object that can be used to render avatar and name.
       * The user object can consist of the following properties:
       * ```js
       * user: {
       *   name: string,
       *   abbr: string,
       *   img: string,
       *   colorIndex: number
       * }
       * ```
       */
      user: {
        type: Object
      }
    };
  }

  static get template() {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: row;
        }

        :host([hidden]) {
          display: none !important;
        }

        .vaadin-message-wrapper {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .vaadin-message-header {
          display: flex;
          flex-direction: row;
        }

        [part='name'] {
          flex: 1;
        }
      </style>
      <vaadin-avatar
        part="avatar"
        name="[[user.name]]"
        img="[[user.img]]"
        abbr="[[user.abbr]]"
        color-index="[[user.colorIndex]]"
        tabindex="-1"
        aria-hidden="true"
      ></vaadin-avatar>
      <div class="vaadin-message-wrapper">
        <div class="vaadin-message-header">
          <div part="name">[[user.name]]</div>
          <div part="time">[[time]]</div>
        </div>
        <div part="content">
          <slot></slot>
        </div>
      </div>
    `;
  }

  ready() {
    super.ready();
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
