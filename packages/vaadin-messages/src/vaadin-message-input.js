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
import { MessageInput } from '@vaadin/message-input/src/vaadin-message-input.js';

/**
 * @deprecated Import `MessageInput` from `@vaadin/message-input` instead.
 */
export const MessageInputElement = MessageInput;

export * from '@vaadin/message-input/src/vaadin-message-input.js';

console.warn(
  'WARNING: Since Vaadin 23.2, "@vaadin/vaadin-messages" is deprecated. Use "@vaadin/message-input" instead.',
);
