/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, render } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { KeyboardDirectionMixin } from '@vaadin/a11y-base/src/keyboard-direction-mixin.js';

/**
 * @polymerMixin
 * @mixes KeyboardDirectionMixin
 */
export const MessageListMixin = (superClass) =>
  class MessageListMixinClass extends KeyboardDirectionMixin(superClass) {
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
         *   className: string,
         *   theme: string
         * }>
         * ```
         */
        items: {
          type: Array,
          value: () => [],
          observer: '_itemsChanged',
          sync: true,
        },
      };
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
            (item) => html`
              <vaadin-message
                role="listitem"
                .time="${item.time}"
                .userAbbr="${item.userAbbr}"
                .userName="${item.userName}"
                .userImg="${item.userImg}"
                .userColorIndex="${item.userColorIndex}"
                theme="${ifDefined(item.theme)}"
                class="${ifDefined(item.className)}"
                @focusin="${this._onMessageFocusIn}"
                >${item.text}<vaadin-avatar slot="avatar"></vaadin-avatar
              ></vaadin-message>
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
      const target = e.composedPath().find((node) => node instanceof customElements.get('vaadin-message'));
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
  };
