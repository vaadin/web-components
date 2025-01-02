/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-lit-message.js';
import { css, html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { MessageListMixin } from './vaadin-message-list-mixin.js';

/**
 * LitElement based version of `<vaadin-message-list>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
class MessageList extends MessageListMixin(ElementMixin(ThemableMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-message-list';
  }

  static get styles() {
    return css`
      :host {
        display: block;
        overflow: auto;
      }

      :host([hidden]) {
        display: none !important;
      }
    `;
  }

  /** @protected */
  render() {
    return html`
      <div part="list" role="list">
        <slot></slot>
      </div>
    `;
  }
}

defineCustomElement(MessageList);

export { MessageList };
