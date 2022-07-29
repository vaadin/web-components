/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
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
