/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-message.js';
import { css, html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { SlotStylesMixin } from '@vaadin/component-base/src/slot-styles-mixin.js';
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
 * @mixes SlotStylesMixin
 */
class MessageList extends SlotStylesMixin(MessageListMixin(ElementMixin(ThemableMixin(PolylitMixin(LitElement))))) {
  static get is() {
    return 'vaadin-message-list';
  }

  static get styles() {
    return css`
      :host {
        display: block;
        overflow: auto;
        padding: var(--vaadin-message-list-padding, var(--vaadin-padding-xs) 0);
      }

      :host([hidden]) {
        display: none !important;
      }
    `;
  }

  /** @protected */
  render() {
    return html`
      <div part="list" role="list">
        <slot></slot>
      </div>
    `;
  }

  /** @protected */
  get slotStyles() {
    const tag = this.localName;
    return [
      `
      ${tag} :where(vaadin-markdown > :is(h1, h2, h3, h4, h5, h6, p, ul, ol):first-child) {
        margin-top: 0;
      }

      ${tag} :where(vaadin-markdown > :is(h1, h2, h3, h4, h5, h6, p, ul, ol):last-child) {
        margin-bottom: 0;
      }
      `,
    ];
  }
}

defineCustomElement(MessageList);

export { MessageList };
