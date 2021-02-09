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
 *     user-name = "Bob Ross"
 *     user-abbr = "BR"
 *     user-img = "/static/img/avatar.jpg">There is no real ending. It's just the place where you stop the story.</vaadin-message>
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
        type: String
      },

      /**
       * The name of the user posting the message.
       * It will be placed in the name part to indicate who has sent the message.
       * It is also used as a tooltip for the avatar.
       * Example: `message.userName = "Jessica Jacobs";`
       */
      userName: {
        type: String
      },

      /**
       * The abbreviation of the user.
       * The abbreviation will be passed on to avatar of the message.
       * If the user does not have an avatar picture set with `userImg`, `userAbbr` will be shown in the avatar.
       * Example: `message.userAbbr = "JJ";`
       */
      userAbbr: {
        type: String
      },

      /**
       * An URL for a user image.
       * The image will be used in the avatar component to show who has sent the message.
       * Example: `message.userImg = "/static/img/avatar.jpg";`
       */
      userImg: {
        type: String
      },

      /**
       * A color index to be used to render the color of the avatar.
       * With no `userColorIndex` set, the basic avatar color will be used.
       * By setting a userColorIndex, the component will check if there exists a CSS variable defining the color, and uses it if there is one.
       * If now CSS variable is found for the color index, the property for the color will not be set.
       *
       * Example:
       * CSS:
       * ```css
       * html {
       *   --vaadin-user-color-1: red;
       * }
       * ```
       *
       * JavaScript:
       * ```js
       * message.userColorIndex = 1;
       * ```
       */
      userColorIndex: {
        type: Number
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

        vaadin-avatar {
          border: none;
          flex-shrink: 0;
          margin: 0;
        }

        [part='content'] {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        [part='header'] {
          align-items: baseline;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
        }
      </style>
      <vaadin-avatar
        part="avatar"
        name="[[userName]]"
        abbr="[[userAbbr]]"
        img="[[userImg]]"
        color-index="[[userColorIndex]]"
        tabindex="-1"
        aria-hidden="true"
      ></vaadin-avatar>
      <div part="content">
        <div part="header">
          <span part="name">[[userName]]</span>
          <span part="time">[[time]]</span>
        </div>
        <div part="message">
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
