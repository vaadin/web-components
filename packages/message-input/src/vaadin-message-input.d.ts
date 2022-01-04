/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export interface MessageInputI18n {
  send: string;
  message: string;
}

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
declare class MessageInput extends ThemableMixin(ElementMixin(HTMLElement)) {
  /**
   * Current content of the text input field
   */
  value: string | null | undefined;

  /**
   * The object used to localize this component.
   * For changing the default localization, change the entire
   * `i18n` object.
   *
   * The object has the following JSON structure and default values:
   *
   * ```
   * {
   *   // Used as the button label
   *   send: 'Send',
   *
   *   // Used as the input field's placeholder and aria-label
   *   message: 'Message'
   * }
   * ```
   */
  i18n: MessageInputI18n;

  /**
   * Set to true to disable this element.
   */
  disabled: boolean;

  addEventListener<K extends keyof MessageInputEventMap>(
    type: K,
    listener: (this: MessageInput, ev: MessageInputEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof MessageInputEventMap>(
    type: K,
    listener: (this: MessageInput, ev: MessageInputEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-message-input': MessageInput;
  }
}

export { MessageInput };
