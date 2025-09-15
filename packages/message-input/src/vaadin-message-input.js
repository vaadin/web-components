/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/text-area/src/vaadin-text-area.js';
import './vaadin-message-input-button.js';
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { messageInputStyles } from './styles/vaadin-message-input-base-styles.js';
import { MessageInputMixin } from './vaadin-message-input-mixin.js';

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
 * ### Styling
 *
 * The following state attributes are available for styling:
 *
 * Attribute      | Description
 * ---------------|---------------------------------
 * `disabled`     | Set when the element is disabled
 * `has-tooltip`  | Set when the element has a slotted tooltip
 *
 * ### Internal components
 *
 * In addition to `<vaadin-message-input>` itself, the following internal
 * components are themable:
 *
 * - `<vaadin-message-input-button>` - has the same API as `<vaadin-button>`
 * - `<vaadin-text-area>`
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes MessageInputMixin
 * @mixes ThemableMixin
 * @mixes ElementMixin
 */
class MessageInput extends MessageInputMixin(
  ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement)))),
) {
  static get is() {
    return 'vaadin-message-input';
  }

  static get styles() {
    return messageInputStyles;
  }

  /** @protected */
  render() {
    return html`
      <slot name="textarea"></slot>

      <slot name="button"></slot>

      <slot name="tooltip"></slot>
    `;
  }
}

defineCustomElement(MessageInput);

export { MessageInput };
