/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html as legacyHtml, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { html, render } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { KeyboardDirectionMixin } from '@vaadin/a11y-base/src/keyboard-direction-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { Message } from './vaadin-message.js';

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
 * See [Styling Components](https://vaadin.com/docs/latest/styling/custom-theme/styling-components) documentation.
 *
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @mixes ElementMixin
 * @mixes KeyboardDirectionMixin
 */
class MessageList extends KeyboardDirectionMixin(ElementMixin(ThemableMixin(PolymerElement))) {
  static get is() {
    return 'vaadin-message-list';
  }

  static get properties() {
    return {
      /**
       * An array of objects which will be rendered as messages.
       * The message objects can have the following properties:
       * ```js
       * Array<{
       *   text: string,
       *   time: string,
       *   userName: string,
       *   userAbbr: string,
       *   userImg: string,
       *   userColorIndex: number,
       *   theme: string
       * }>
       * ```
       */
      items: {
        type: Array,
        value: () => [],
        observer: '_itemsChanged',
      },
    };
  }

  static get template() {
    return legacyHtml`
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

  /** @protected */
  get _messages() {
    return [...this.querySelectorAll('vaadin-message')];
  }

  /** @protected */
  ready() {
    super.ready();

    // Make screen readers announce new messages
    this.setAttribute('aria-relevant', 'additions');
    this.setAttribute('role', 'log');
  }

  /**
   * Override method inherited from `KeyboardDirectionMixin`
   * to use the list of message elements as items.
   *
   * @return {Element[]}
   * @protected
   * @override
   */
  _getItems() {
    return this._messages;
  }

  /** @private */
  _itemsChanged(newVal, oldVal) {
    const items = newVal || [];
    const oldItems = oldVal || [];

    if (items.length || oldItems.length) {
      const focusedIndex = this._getIndexOfFocusableElement();
      const closeToBottom = this.scrollHeight < this.clientHeight + this.scrollTop + 50;

      this._renderMessages(items);
      this._setTabIndexesByIndex(focusedIndex);

      requestAnimationFrame(() => {
        if (items.length > oldItems.length && closeToBottom) {
          this._scrollToLastMessage();
        }
      });
    }
  }

  /** @private */
  _renderMessages(items) {
    render(
      html`
        ${items.map(
          (item) =>
            html`
              <vaadin-message
                role="listitem"
                .time="${item.time}"
                .userAbbr="${item.userAbbr}"
                .userName="${item.userName}"
                .userImg="${item.userImg}"
                .userColorIndex="${item.userColorIndex}"
                theme="${ifDefined(item.theme)}"
                @focusin="${this._onMessageFocusIn}"
                >${item.text}</vaadin-message
              >
            `,
        )}
      `,
      this,
      { host: this },
    );
  }

  /** @private */
  _scrollToLastMessage() {
    if (this.items.length > 0) {
      this.scrollTop = this.scrollHeight - this.clientHeight;
    }
  }

  /** @private */
  _onMessageFocusIn(e) {
    const target = e.composedPath().find((node) => node instanceof Message);
    this._setTabIndexesByMessage(target);
  }

  /**
   * @param {number} idx
   * @protected
   */
  _setTabIndexesByIndex(index) {
    const message = this._messages[index] || this._messages[0];
    this._setTabIndexesByMessage(message);
  }

  /** @private */
  _setTabIndexesByMessage(message) {
    this._messages.forEach((e) => {
      e.tabIndex = e === message ? 0 : -1;
    });
  }

  /** @private */
  _getIndexOfFocusableElement() {
    const index = this._messages.findIndex((e) => e.tabIndex === 0);
    return index !== -1 ? index : 0;
  }
}

customElements.define(MessageList.is, MessageList);

export { MessageList };
