import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';

/**
 * `<vaadin-messages>` is a Web Component for showing a list of messages.
 *
 * ```html
 * <vaadin-messages foo="bar">
 * </vaadin-messages>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------|----------------
 * `foo`     | Messages' part
 *
 * See [ThemableMixin – how to apply styles for shadow parts](https://github.com/vaadin/vaadin-themable-mixin/wiki)
 *
 * The following custom properties are available:
 *
 * Custom property           | Description                              | Default
 *---------------------------|------------------------------------------|-------------
 * `--vaadin-messages-value` | value of the component (between 0 and 1) | 0
 *
 * The following state attributes are available for styling:
 *
 * Attribute       | Description      | Part name
 * ----------------|------------------|------------
 * `myattribute`   | Set an attribute | :host
 *
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @mixes ElementMixin
 */
declare class MessagesElement extends ThemableMixin(ElementMixin(HTMLElement)) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-messages': MessagesElement;
  }
}

export { MessagesElement };
