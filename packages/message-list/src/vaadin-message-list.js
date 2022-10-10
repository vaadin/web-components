/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { calculateSplices } from '@polymer/polymer/lib/utils/array-splice.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { KeyboardDirectionMixin } from '@vaadin/component-base/src/keyboard-direction-mixin.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';
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
 * See the [`<vaadin-message>`](#/elements/vaadin-message) documentation for the available
 * state attributes and stylable shadow parts of message elements.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/custom-theme/styling-components) documentation.
 *
 * @extends HTMLElement
 * @mixes ControllerMixin
 * @mixes ThemableMixin
 * @mixes ElementMixin
 * @mixes KeyboardDirectionMixin
 */
class MessageList extends KeyboardDirectionMixin(ElementMixin(ThemableMixin(ControllerMixin(PolymerElement)))) {
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
      },

      /** @protected */
      _listElement: {
        type: Object,
      },
    };
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
      <slot></slot>
    `;
  }

  static get observers() {
    return ['__updateItems(items, _listElement)'];
  }

  /** @protected */
  ready() {
    super.ready();

    this._listController = new SlotController(
      this,
      '',
      () => document.createElement('div'),
      (_, list) => {
        list.setAttribute('role', 'list');
        this._listElement = list;
      },
    );
    this.addController(this._listController);

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

  /** @protected */
  get _messages() {
    return Array.from(this.querySelectorAll('vaadin-message'));
  }

  /** @private */
  __updateItems(items, list) {
    if (list) {
      const newItems = items || [];
      const oldItems = this.__oldItems || [];
      const focusedIndex = this._getIndexOfFocusableElement();
      const closeToBottom = this.scrollHeight < this.clientHeight + this.scrollTop + 50;

      if (newItems.length || oldItems.length) {
        const removed = this.__getRemovedItems(newItems, oldItems);
        const added = [...newItems];

        this._messages.forEach((message) => {
          const item = message._item;
          if (removed.includes(item)) {
            message.remove();
          } else if (added.includes(item)) {
            added.splice(added.indexOf(item), 1);
          }
        });

        this.__addMessages(added, newItems);

        this._setTabIndexesByIndex(focusedIndex);

        requestAnimationFrame(() => {
          if (newItems.length > oldItems.length && closeToBottom) {
            this._scrollToLastMessage();
          }
        });
      }

      this.__oldItems = items;
    }
  }

  /** @private */
  __addMessages(itemsToAdd, allItems) {
    itemsToAdd.forEach((item) => {
      const message = this.__createMessage(item);
      const nextItem = allItems[allItems.indexOf(item) + 1];
      const nextMessage = this._messages.find((msg) => msg._item === nextItem);
      if (nextMessage) {
        this._listElement.insertBefore(message, nextMessage);
      } else {
        this._listElement.appendChild(message);
      }
    });
  }

  /** @private */
  __createMessage(item) {
    const message = document.createElement('vaadin-message');
    message.setAttribute('role', 'listitem');

    message.textContent = item.text;
    message.time = item.time;
    message.userName = item.userName;
    message.userAbbr = item.userAbbr;
    message.userImg = item.userImg;
    message.userColorIndex = item.userColorIndex;

    message._item = item;

    if (item.theme) {
      message.setAttribute('theme', item.theme);
    }

    message.addEventListener('focusin', (e) => {
      this._onMessageFocusIn(e);
    });

    return message;
  }

  /** @private */
  __getRemovedItems(items, oldItems) {
    const result = [];

    const splices = calculateSplices(items, oldItems);
    splices.forEach((splice) => {
      splice.removed.forEach((item) => {
        result.push(item);
      });
    });

    return result;
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
