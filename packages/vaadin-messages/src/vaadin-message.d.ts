/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Message } from '@vaadin/message-list/src/vaadin-message.js';

/**
 * @deprecated Import `Message` from `@vaadin/message-list/vaadin-message` instead.
 */
export type MessageElement = Message;

/**
 * @deprecated Import `Message` from `@vaadin/message-list/vaadin-message` instead.
 */
export const MessageElement: typeof Message;

export * from '@vaadin/message-list/src/vaadin-message.js';
