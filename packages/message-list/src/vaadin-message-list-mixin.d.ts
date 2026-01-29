/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { KeyboardDirectionMixinClass } from '@vaadin/a11y-base/src/keyboard-direction-mixin.js';
import type { MessageAttachment, MessageAttachmentClickEvent } from './vaadin-message-mixin.js';

export { MessageAttachment, MessageAttachmentClickEvent };

/**
 * Fired when an attachment is clicked in a message list item.
 */
export type MessageListAttachmentClickEvent = CustomEvent<{ attachment: MessageAttachment; item: MessageListItem }>;

export interface MessageListItem {
  text?: string;
  time?: string;
  userName?: string;
  userAbbr?: string;
  userImg?: string;
  userColorIndex?: number;
  theme?: string;
  className?: string;
  attachments?: MessageAttachment[];
}

export declare function MessageListMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<KeyboardDirectionMixinClass> & Constructor<MessageListMixinClass> & T;

export declare class MessageListMixinClass {
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
   * When a message has attachments, they are rendered in the message's shadow DOM.
   * Image attachments (type starting with "image/") show a thumbnail preview,
   * while other attachments show a document icon with the file name.
   * Clicking an attachment dispatches an `attachment-click` event.
   */
  items: MessageListItem[] | null | undefined;

  /**
   * When set to `true`, the message text is parsed as Markdown.
   */
  markdown: boolean | undefined;

  /**
   * When set to `true`, new messages are announced to assistive technologies using ARIA live regions.
   * @attr {boolean} announce-messages
   */
  announceMessages: boolean | undefined;
}
