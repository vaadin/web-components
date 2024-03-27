/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { MessageList } from '@vaadin/message-list/src/vaadin-message-list.js';

/**
 * @deprecated Import `MessageList` from `@vaadin/message-list` instead.
 */
export const MessageListElement = MessageList;

export * from '@vaadin/message-list/src/vaadin-message-list.js';

console.warn(
  'WARNING: Since Vaadin 23.2, "@vaadin/vaadin-messages" is deprecated. Use "@vaadin/message-list" instead.',
);
