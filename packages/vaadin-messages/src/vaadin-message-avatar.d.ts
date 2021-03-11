import { AvatarElement } from '@vaadin/vaadin-avatar/src/vaadin-avatar.js';

/**
 * The avatar element for message.
 *
 * ### Styling
 *
 * See [`<vaadin-avatar>` documentation](https://github.com/vaadin/vaadin-avatar/blob/master/src/vaadin-avatar.js)
 * for `<vaadin-message-avatar>` parts and available slots
 *
 * See [ThemableMixin – how to apply styles for shadow parts](https://github.com/vaadin/vaadin-themable-mixin#readme)
 */
declare class MessageAvatarElement extends AvatarElement {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-message-avatar': MessageAvatarElement;
  }
}
