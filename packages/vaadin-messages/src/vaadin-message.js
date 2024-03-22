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
import { Message } from '@vaadin/message-list/src/vaadin-message.js';

/**
 * @deprecated Import `Message` from `@vaadin/message-list/vaadin-message` instead.
 */
export const MessageElement = Message;

export * from '@vaadin/message-list/src/vaadin-message.js';

console.warn(
  'WARNING: Since Vaadin 23.2, "@vaadin/vaadin-messages" is deprecated. Use "@vaadin/message-list" instead.',
);
