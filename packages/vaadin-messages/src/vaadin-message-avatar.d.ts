import { AvatarElement } from '@vaadin/vaadin-avatar/src/vaadin-avatar.js';

/**
 * An element used internally by `<vaadin-message>`. Not intended to be used separately.
 */
declare class MessageAvatarElement extends AvatarElement {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-message-avatar': MessageAvatarElement;
  }
}
