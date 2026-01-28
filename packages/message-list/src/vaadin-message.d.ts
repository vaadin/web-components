/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { MessageMixin } from './vaadin-message-mixin.js';

/**
 * `<vaadin-message>` is a Web Component for showing a single message with an author, message and time.
 *
 * ```html
 * <vaadin-message time="2021-01-28 10:43"
 *     user-name = "Bob Ross"
 *     user-abbr = "BR"
 *     user-img = "/static/img/avatar.jpg">There is no real ending. It's just the place where you stop the story.</vaadin-message>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name           | Description
 * --------------------|----------------
 * `name`              | Author's name
 * `time`              | When the message was posted
 * `content`           | The message itself as a slotted content
 * `attachments`       | Container for the attachments
 * `attachment`        | Individual attachment button
 * `attachment-image`  | Image attachment button (in addition to `attachment`)
 * `attachment-file`   | File attachment button (in addition to `attachment`)
 * `attachment-preview`| Image preview inside an image attachment
 * `attachment-icon`   | File icon inside a file attachment
 * `attachment-name`   | File name inside a file attachment
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description
 * -------------|-------------
 * `focus-ring` | Set when the message is focused using the keyboard.
 * `focused`    | Set when the message is focused.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {CustomEvent} attachment-click - Fired when an attachment is clicked.
 */
declare class Message extends MessageMixin(ThemableMixin(ElementMixin(HTMLElement))) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-message': Message;
  }
}

export { Message };
