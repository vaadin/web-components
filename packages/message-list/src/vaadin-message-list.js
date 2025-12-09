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

      ${tag} .vaadin-message-attachments {
        display: flex;
        flex-wrap: wrap;
        gap: var(--vaadin-message-attachment-gap, var(--vaadin-gap-xs, 6px));
      }

      ${tag} .vaadin-message-attachment {
        display: inline-flex;
        align-items: center;
        text-decoration: none;
        color: inherit;
        border-radius: var(--vaadin-message-attachment-border-radius, var(--vaadin-radius-m, 6px));
        overflow: hidden;
      }

      ${tag} .vaadin-message-attachment:hover {
        opacity: 0.8;
      }

      ${tag} .vaadin-message-attachment-image {
        max-width: var(--vaadin-message-attachment-image-max-width, 200px);
        max-height: var(--vaadin-message-attachment-image-max-height, 150px);
      }

      ${tag} .vaadin-message-attachment-image img {
        display: block;
        max-width: 100%;
        max-height: var(--vaadin-message-attachment-image-max-height, 150px);
        object-fit: contain;
        border-radius: var(--vaadin-message-attachment-border-radius, var(--vaadin-radius-m, 6px));
      }

      ${tag} .vaadin-message-attachment-file {
        gap: var(--vaadin-gap-xs, 6px);
        padding: var(--vaadin-message-attachment-file-padding, var(--vaadin-padding-xs, 6px) var(--vaadin-padding-s, 8px));
        background: var(--vaadin-message-attachment-file-background, var(--vaadin-background-container, #f5f5f5));
        font-size: var(--vaadin-message-attachment-file-font-size, 0.875em);
      }

      ${tag} .vaadin-message-attachment-icon {
        display: inline-block;
        width: var(--vaadin-message-attachment-icon-size, 1em);
        height: var(--vaadin-message-attachment-icon-size, 1em);
        background: currentColor;
        mask-image: var(--vaadin-message-attachment-icon, url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>'));
        mask-size: contain;
        mask-repeat: no-repeat;
        mask-position: center;
        flex-shrink: 0;
      }

      ${tag} .vaadin-message-attachment-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: var(--vaadin-message-attachment-name-max-width, 200px);
      }
      `,
    ];
  }
}

defineCustomElement(MessageList);

export { MessageList };
