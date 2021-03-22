import { ButtonElement } from '@vaadin/vaadin-button/src/vaadin-button.js';

/**
 * An element used internally by `<vaadin-message-input>`. Not intended to be used separately.
 *
 * @protected
 */
declare class MessageInputButtonElement extends ButtonElement {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-message-input-button': MessageInputButtonElement;
  }
}
