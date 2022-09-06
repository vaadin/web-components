/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-message-avatar.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { FocusMixin } from '@vaadin/component-base/src/focus-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

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
 * The following state attributes are available for styling:
 *
 * Attribute    | Description
 * -------------|-------------
 * `focus-ring` | Set when the message is focused using the keyboard.
 * `focused`    | Set when the message is focused.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/custom-theme/styling-components) documentation.
 *
 * ### Internal components
 *
 * In addition to `<vaadin-message>` itself, the following internal
 * components are themable:
 *
 * - `<vaadin-message-avatar>` - has the same API as [`<vaadin-avatar>`](#/elements/vaadin-avatar).
 *
 * @extends HTMLElement
 * @mixes FocusMixin
 * @mixes ThemableMixin
 * @mixes ElementMixin
 */
class Message extends FocusMixin(ElementMixin(ThemableMixin(PolymerElement))) {
  static get properties() {
    return {
      /**
       * Time of sending the message. It is rendered as-is to the part='time' slot,
       * so the formatting is up to you.
       */
      time: {
        type: String,
      },

      /**
       * The name of the user posting the message.
       * It will be placed in the name part to indicate who has sent the message.
       * It is also used as a tooltip for the avatar.
       * Example: `message.userName = "Jessica Jacobs";`
       * @attr {string} user-name
       */
      userName: {
        type: String,
      },

      /**
       * The abbreviation of the user.
       * The abbreviation will be passed on to avatar of the message.
       * If the user does not have an avatar picture set with `userImg`, `userAbbr` will be shown in the avatar.
       * Example: `message.userAbbr = "JJ";`
       * @attr {string} user-abbr
       */
      userAbbr: {
        type: String,
      },

      /**
       * An URL for a user image.
       * The image will be used in the avatar component to show who has sent the message.
       * Example: `message.userImg = "/static/img/avatar.jpg";`
       * @attr {string} user-img
       */
      userImg: {
        type: String,
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
       * @attr {number} user-color-index
       */
      userColorIndex: {
        type: Number,
      },
    };
  }

  static get template() {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: row;
          outline: none;
        }

        :host([hidden]) {
          display: none !important;
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

        [part='name'] {
          font-weight: 500;
        }

        [part='message'] {
          white-space: pre-wrap;
        }
      </style>
      <vaadin-message-avatar
        part="avatar"
        name="[[userName]]"
        abbr="[[userAbbr]]"
        img="[[userImg]]"
        color-index="[[userColorIndex]]"
        tabindex="-1"
        aria-hidden="true"
      ></vaadin-message-avatar>
      <div part="content">
        <div part="header">
          <span part="name">[[userName]]</span>
          <span part="time">[[time]]</span>
        </div>
        <div part="message"><slot></slot></div>
      </div>
    `;
  }

  static get is() {
    return 'vaadin-message';
  }
}

customElements.define(Message.is, Message);

export { Message };
