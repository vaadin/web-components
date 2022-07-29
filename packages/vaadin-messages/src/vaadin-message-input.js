/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
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
