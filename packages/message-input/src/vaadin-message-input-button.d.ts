import { Button } from '@vaadin/button/src/vaadin-button.js';

/**
 * An element used internally by `<vaadin-message-input>`. Not intended to be used separately.
 *
 * @extends Button
 * @protected
 */
declare class MessageInputButtonElement extends Button {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-message-input-button': MessageInputButtonElement;
  }
}
