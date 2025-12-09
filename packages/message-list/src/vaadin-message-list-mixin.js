/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, render } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ref } from 'lit/directives/ref.js';
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
         *   theme: string,
         *   attachments: Array<{
         *     name: string,
         *     url: string,
         *     type: string
         *   }>
         * }>
         * ```
         *
         * When a message has attachments, they are rendered in the prefix slot by default.
         * Image attachments (type starting with "image/") show a thumbnail preview,
         * while other attachments show a document icon with the file name.
         */
        items: {
          type: Array,
          value: () => [],
          observer: '_itemsChanged',
          sync: true,
        },

        /**
         * When set to `true`, the message text is parsed as Markdown.
         * @type {boolean}
         */
        markdown: {
          type: Boolean,
          observer: '__markdownChanged',
          reflectToAttribute: true,
        },

        /**
         * When set to `true`, new messages are announced to assistive technologies using ARIA live regions.
         * @attr {boolean} announce-messages
         * @type {boolean}
         */
        announceMessages: {
          type: Boolean,
          value: false,
          observer: '__announceChanged',
          sync: true,
        },

        /**
         * A function that is called for each message item to render custom content
         * into the prefix slot of the message. This is useful for adding attachments,
         * charts, or other rich content above the message text.
         *
         * @type {function(HTMLElement, Object, Object): void}
         */
        prefixRenderer: {
          type: Function,
          observer: '__prefixRendererChanged',
        },

        /**
         * A function that is called for each message item to render custom content
         * into the suffix slot of the message. This is useful for adding feedback buttons,
         * actions, or other interactive content below the message text.
         *
         * @type {function(HTMLElement, Object, Object): void}
         */
        suffixRenderer: {
          type: Function,
          observer: '__suffixRendererChanged',
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
      this.setAttribute('role', 'region');
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
    __markdownChanged(markdown) {
      if (markdown && !customElements.get('vaadin-markdown')) {
        // Dynamically import the markdown component
        import('@vaadin/markdown/src/vaadin-markdown.js')
          // Wait until the component is defined
          .then(() => customElements.whenDefined('vaadin-markdown'))
          // Render the messages again
          .then(() => this._renderMessages(this.items));
      }
      this._renderMessages(this.items);
    }

    /** @private */
    __prefixRendererChanged() {
      this._renderMessages(this.items);
    }

    /** @private */
    __suffixRendererChanged() {
      this._renderMessages(this.items);
    }

    /** @private */
    _renderMessages(items) {
      // Check if markdown component is still loading
      const loadingMarkdown = this.markdown && !customElements.get('vaadin-markdown');

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
                style="${ifDefined(loadingMarkdown ? 'visibility: hidden' : undefined)}"
                >${this.prefixRenderer
                  ? html`<div slot="prefix" ${ref((el) => this._renderPrefix(el, item, index))}></div>`
                  : this.__renderDefaultAttachments(item)}${this.markdown
                  ? html`<vaadin-markdown .content=${item.text}></vaadin-markdown>`
                  : item.text}${this.suffixRenderer
                  ? html`<div slot="suffix" ${ref((el) => this._renderSuffix(el, item, index))}></div>`
                  : ''}<vaadin-avatar slot="avatar"></vaadin-avatar
              ></vaadin-message>
            `,
          )}
        `,
        this,
        { host: this },
      );
    }

    /** @private */
    _renderPrefix(root, item, index) {
      if (root && this.prefixRenderer) {
        this.prefixRenderer(root, item, { index });
      }
    }

    /** @private */
    _renderSuffix(root, item, index) {
      if (root && this.suffixRenderer) {
        this.suffixRenderer(root, item, { index });
      }
    }

    /**
     * Renders default attachment display when no custom prefixRenderer is set.
     * @param {Object} item - The message item
     * @return {import('lit').TemplateResult | string}
     * @private
     */
    __renderDefaultAttachments(item) {
      const attachments = item.attachments;
      if (!attachments || attachments.length === 0) {
        return '';
      }

      return html`
        <div slot="prefix" class="vaadin-message-attachments">
          ${attachments.map((attachment) => this.__renderAttachment(attachment))}
        </div>
      `;
    }

    /**
     * Renders a single attachment.
     * @param {Object} attachment - The attachment object with name, url, and type properties
     * @return {import('lit').TemplateResult}
     * @private
     */
    __renderAttachment(attachment) {
      const isImage = attachment.type && attachment.type.startsWith('image/');

      if (isImage) {
        return html`
          <a
            class="vaadin-message-attachment vaadin-message-attachment-image"
            href="${attachment.url}"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="${attachment.url}" alt="${attachment.name || ''}" />
          </a>
        `;
      }

      return html`
        <a
          class="vaadin-message-attachment vaadin-message-attachment-file"
          href="${attachment.url}"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="vaadin-message-attachment-icon"></span>
          <span class="vaadin-message-attachment-name">${attachment.name || attachment.url}</span>
        </a>
      `;
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
     * @param {number} index
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

    /** @private */
    __announceChanged(announceMessages) {
      this.ariaLive = announceMessages ? 'polite' : null;
    }
  };
