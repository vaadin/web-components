import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';
import { MessageInputI18n } from './interfaces';

/**
 * `<vaadin-message-input>` is a Web Component for sending messages.
 * It consists of a text area that grows on along with the content, and a send button to send message.
 *
 * The message can be sent by one of the following actions:
 * - by pressing Enter (use Shift + Enter to add a new line)
 * - by clicking `submit` button.
 *
 * ```html
 * <vaadin-message-input></vaadin-message-input>
 * ```
 *
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @mixes ElementMixin
 */
declare class MessageInputElement extends ThemableMixin(ElementMixin(HTMLElement)) {
  /**
   *
   * The object used to localize this component.
   * For changing the default localization, change the entire
   * `i18n` object.
   *
   * The object has the following JSON structure and default values:
   *
   * ```
   * {
   *   // Used as the button label
   *   send: 'Send',
   *
   *   // Used as the input field's placeholder and aria-label
   *   message: 'Message'
   * }
   * ```
   */
  i18n: MessageInputI18n;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-message-input': MessageInputElement;
  }
}

export { MessageInputElement };
