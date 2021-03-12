import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';

import { MessageListItem } from './interfaces';

/**
 * `<vaadin-message-list>` is a Web Component for showing an ordered list of messages. The messages are rendered as <vaadin-message>
 *
 * ### Example
 * To create a new message list, add the component to the page:
 * ```html
 * <vaadin-message-list></vaadin-message-list>
 * ```
 *
 * Provide the messages to the message list with the `items` property.
 * ```js
 * document.querySelector('vaadin-message-list').items = [
 *   { text: 'Hello list', time: 'yesterday', userName: 'Matt Mambo', userAbbr: 'MM', userColorIndex: 1 },
 *   { text: 'Another message', time: 'right now', userName: 'Linsey Listy', userAbbr: 'LL', userColorIndex: 2, userImg: '/static/img/avatar.jpg' }
 * ];
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------|----------------
 *
 * See [ThemableMixin – how to apply styles for shadow parts](https://github.com/vaadin/vaadin-themable-mixin/wiki)
 */
declare class MessageListElement extends ThemableMixin(ElementMixin(HTMLElement)) {
  /**
   * A user object that can be used to render avatar and name.
   * The user object can consist of the folowing properties:
   * ```js
   * Array<{
   *   text: string,
   *   time: string,
   *   userName: string,
   *   userAbbr: string,
   *   userImg: string,
   *   userColorIndex: number
   * }>
   * ```
   *
   * @type {!Array<!MessageListItem>}
   */
  items: MessageListItem[] | null | undefined;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-message-list': MessageListElement;
  }
}

export { MessageListElement };
