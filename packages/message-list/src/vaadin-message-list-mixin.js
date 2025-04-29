/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
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

        /**
         * Custom function for rendering the content of every item.
         * Receives three arguments:
         *
         * - `root` The render target element representing one item at a time.
         * - `messageList` The reference to the `<vaadin-message-list>` element.
         * - `model` The object with the properties related with the rendered
         *   item, contains:
         *   - `model.index` The index of the rendered item.
         *   - `model.item` The item.
         * @type {MessageListRenderer | undefined}
         */
        renderer: {
          type: Function,
          observer: '__rendererChanged',
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

    __rendererChanged(_renderer) {
      this._renderMessages(this.items);
    }

    /** @private */
    _renderMessages(items) {
      render(
        html`
          ${items.map(
            (item, index) => html`
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
                >${this.renderer
                  ? html`<div class="render-root" .__item=${item} .__index=${index}></div>`
                  : item.text}<vaadin-avatar slot="avatar"></vaadin-avatar
              ></vaadin-message>
            `,
          )}
        `,
        this,
        { host: this },
      );

      if (this.renderer) {
        this.querySelectorAll(':scope > vaadin-message > .render-root').forEach((root) => {
          this.renderer(root, this, { item: root.__item, index: root.__index });
        });
      }
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
