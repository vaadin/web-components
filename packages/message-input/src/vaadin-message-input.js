/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/button/src/vaadin-button.js';
import '@vaadin/text-area/src/vaadin-text-area.js';
import { css, html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { MessageInputMixin } from './vaadin-message-input-mixin.js';

/**
 * `<vaadin-message-input>` is a Web Component for sending messages.
 * It consists of a text area that grows on along with the content, and a send button to send message.
 *
 * The message can be sent by one of the following actions:
 * - by pressing Enter (use Shift + Enter to add a new line)
 * - by clicking `submit` button.
 *
 * ```html
 * <vaadin-message-input></vaadin-message-input>
 * ```
 *
 * @customElement
 * @extends HTMLElement
 * @mixes MessageInputMixin
 * @mixes ThemableMixin
 * @mixes ElementMixin
 */
class MessageInput extends MessageInputMixin(ElementMixin(ThemableMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-message-input';
  }

  static get styles() {
    return css`
      :host {
        align-items: flex-start;
        box-sizing: border-box;
        display: flex;
        max-height: 50vh;
        overflow: hidden;
        flex-shrink: 0;
      }

      :host([hidden]) {
        display: none !important;
      }

      ::slotted([slot='button']) {
        flex-shrink: 0;
      }

      ::slotted([slot='textarea']) {
        align-self: stretch;
        flex-grow: 1;
      }
    `;
  }

  /** @protected */
  render() {
    return html`
      <slot name="textarea"></slot>

      <slot name="button"></slot>

      <slot name="tooltip"></slot>
    `;
  }
}

defineCustomElement(MessageInput);

export { MessageInput };
