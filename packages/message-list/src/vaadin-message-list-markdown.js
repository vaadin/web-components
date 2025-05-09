/**
 * @license
 * Copyright (c) 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { renderMarkdownToElement } from '@vaadin/markdown/src/markdown-helpers.js';

/**
 * An element used internally by `<vaadin-message-list>`. Not intended to be used separately.
 *
 * @extends HTMLElement
 * @private
 */
class MessageListMarkdown extends LitElement {
  static get is() {
    return 'vaadin-message-list-markdown';
  }

  static get styles() {
    return css`
      :host {
        display: contents;
        white-space: normal;
      }
    `;
  }

  static get properties() {
    return {
      /**
       * The Markdown content.
       *
       * @type {string}
       */
      content: {
        type: String,
      },
    };
  }

  /** @protected */
  render() {
    return html`<slot></slot>`;
  }

  /**
   * @protected
   * @override
   */
  updated(props) {
    super.updated(props);

    if (props.has('content')) {
      renderMarkdownToElement(this, this.content);
    }
  }
}

defineCustomElement(MessageListMarkdown);
