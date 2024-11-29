/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-message.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { MessageListMixin } from './vaadin-message-list-mixin.js';

/**
 * `<vaadin-message-list>` is a Web Component for showing an ordered list of messages. The messages are rendered as <vaadin-message>
 *
 * ### Example
 *
 * To create a new message list, add the component to the page:
 *
 * ```html
 * <vaadin-message-list></vaadin-message-list>
 * ```
 *
 * Provide the messages to the message list with the [`items`](#/elements/vaadin-message-list#property-items) property.
 *
 * ```js
 * document.querySelector('vaadin-message-list').items = [
 *   { text: 'Hello list', time: 'yesterday', userName: 'Matt Mambo', userAbbr: 'MM', userColorIndex: 1 },
 *   { text: 'Another message', time: 'right now', userName: 'Linsey Listy', userAbbr: 'LL', userColorIndex: 2, userImg: '/static/img/avatar.jpg' }
 * ];
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------|----------------
 * `list`    | The container wrapping messages.
 *
 * See the [`<vaadin-message>`](#/elements/vaadin-message) documentation for the available
 * state attributes and stylable shadow parts of message elements.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @mixes ElementMixin
 * @mixes MessageListMixin
 */
class MessageList extends MessageListMixin(ElementMixin(ThemableMixin(PolymerElement))) {
  static get is() {
    return 'vaadin-message-list';
  }

  static get template() {
    return html`
      <style>
        :host {
          display: block;
          overflow: auto;
        }

        :host([hidden]) {
          display: none !important;
        }
      </style>
      <div part="list" role="list">
        <slot></slot>
      </div>
    `;
  }
}

defineCustomElement(MessageList);

export { MessageList };
