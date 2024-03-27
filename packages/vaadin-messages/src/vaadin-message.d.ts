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
