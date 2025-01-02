/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/avatar/src/vaadin-lit-avatar.js';
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { MessageMixin } from './vaadin-message-mixin.js';
import { messageStyles } from './vaadin-message-styles.js';

/**
 * LitElement based version of `<vaadin-message>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
class Message extends MessageMixin(ElementMixin(ThemableMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-message';
  }

  static get styles() {
    return messageStyles;
  }

  /** @protected */
  render() {
    return html`
      <slot name="avatar"></slot>
      <div part="content">
        <div part="header">
          <span part="name">${this.userName}</span>
          <span part="time">${this.time}</span>
        </div>
        <div part="message"><slot></slot></div>
      </div>
    `;
  }
}

defineCustomElement(Message);

export { Message };
