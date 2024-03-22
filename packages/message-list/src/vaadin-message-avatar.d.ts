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
import { Avatar } from '@vaadin/avatar/src/vaadin-avatar.js';

/**
 * An element used internally by `<vaadin-message>`. Not intended to be used separately.
 */
declare class MessageAvatar extends Avatar {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-message-avatar': MessageAvatar;
  }
}
