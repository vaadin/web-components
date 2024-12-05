/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { MessageInputMixin } from './vaadin-message-input-mixin.js';

export { MessageInputI18n } from './vaadin-message-input-mixin.js';

/**
 * Fired when a new message is submitted with `<vaadin-message-input>`, either
 * by clicking the "send" button, or pressing the Enter key.
 */
export type MessageInputSubmitEvent = CustomEvent<{ value: string }>;

export interface MessageInputCustomEventMap {
  submit: MessageInputSubmitEvent;
}

export type MessageInputEventMap = HTMLElementEventMap & MessageInputCustomEventMap;

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
 */
declare class MessageInput extends MessageInputMixin(ThemableMixin(ElementMixin(HTMLElement))) {
  addEventListener<K extends keyof MessageInputEventMap>(
    type: K,
    listener: (this: MessageInput, ev: MessageInputEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof MessageInputEventMap>(
    type: K,
    listener: (this: MessageInput, ev: MessageInputEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-message-input': MessageInput;
  }
}

export { MessageInput };
