/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
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
