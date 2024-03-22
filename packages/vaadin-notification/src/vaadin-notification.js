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
import { Notification } from '@vaadin/notification/src/vaadin-notification.js';

/**
 * @deprecated Import `Notification` from `@vaadin/notification` instead.
 */
export const NotificationElement = Notification;

export * from '@vaadin/notification/src/vaadin-notification.js';

console.warn(
  'WARNING: Since Vaadin 23.2, "@vaadin/vaadin-notification" is deprecated. Use "@vaadin/notification" instead.',
);
