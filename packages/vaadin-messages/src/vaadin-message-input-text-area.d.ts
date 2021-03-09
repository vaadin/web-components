import { TextAreaElement } from '@vaadin/vaadin-text-field/src/vaadin-text-area.js';

/**
 * The text area element for a message input.
 *
 * ### Styling
 *
 * See [`<vaadin-text-area>` documentation](https://github.com/vaadin/vaadin-text-field/blob/master/src/vaadin-text-area.js)
 * for `<vaadin-message-input-text-area>` parts and available slots
 *
 * See [ThemableMixin – how to apply styles for shadow parts](https://github.com/vaadin/vaadin-themable-mixin#readme)
 */
declare class MessageInputTextAreaElement extends TextAreaElement {
  ariaLabel: string;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-message-input-text-area': MessageInputTextAreaElement;
  }
}
