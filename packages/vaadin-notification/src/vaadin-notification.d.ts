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
import type { Notification } from '@vaadin/notification/src/vaadin-notification.js';

/**
 * @deprecated Import `Notification` from `@vaadin/notification` instead.
 */
export type NotificationElement = Notification;

/**
 * @deprecated Import `Notification` from `@vaadin/notification` instead.
 */
export const NotificationElement: typeof Notification;

export * from '@vaadin/notification/src/vaadin-notification.js';
