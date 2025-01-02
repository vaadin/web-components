/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/avatar/src/vaadin-avatar.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { MessageMixin } from './vaadin-message-mixin.js';
import { messageStyles } from './vaadin-message-styles.js';

registerStyles('vaadin-message', messageStyles, { moduleId: 'vaadin-message-styles' });

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
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes MessageMixin
 * @mixes ThemableMixin
 * @mixes ElementMixin
 */
class Message extends MessageMixin(ElementMixin(ThemableMixin(PolymerElement))) {
  static get template() {
    return html`
      <slot name="avatar"></slot>
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

defineCustomElement(Message);

export { Message };
