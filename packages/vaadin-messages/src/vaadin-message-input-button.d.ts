import { ButtonElement } from '@vaadin/vaadin-button/src/vaadin-button.js';

/**
 * The button element for a message input.
 *
 * ### Styling
 *
 * See [`<vaadin-button>` documentation](https://github.com/vaadin/vaadin-button/blob/master/src/vaadin-button.js)
 * for `<vaadin-message-input-button>` parts and available slots
 *
 * See [ThemableMixin – how to apply styles for shadow parts](https://github.com/vaadin/vaadin-themable-mixin#readme)
 */
declare class MessageInputButtonElement extends ButtonElement {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-message-input-button': MessageInputButtonElement;
  }
}
