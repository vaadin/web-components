import { TextAreaElement } from '@vaadin/vaadin-text-field/src/vaadin-text-area.js';

/**
 * An element used internally by `<vaadin-message-input>`. Not intended to be used separately.
 *
 * @protected
 */
declare class MessageInputTextAreaElement extends TextAreaElement {
  ariaLabel: string;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-message-input-text-area': MessageInputTextAreaElement;
  }
}
