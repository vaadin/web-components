/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/button/src/vaadin-lit-button.js';
import '@vaadin/text-area/src/vaadin-lit-text-area.js';
import { css, html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { MessageInputMixin } from './vaadin-message-input-mixin.js';

/**
 * LitElement based version of `<vaadin-message-input>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
class MessageInput extends MessageInputMixin(ElementMixin(ThemableMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-message-input';
  }

  static get styles() {
    return css`
      :host {
        align-items: flex-start;
        box-sizing: border-box;
        display: flex;
        max-height: 50vh;
        overflow: hidden;
        flex-shrink: 0;
      }

      :host([hidden]) {
        display: none !important;
      }

      ::slotted([slot='button']) {
        flex-shrink: 0;
      }

      ::slotted([slot='textarea']) {
        align-self: stretch;
        flex-grow: 1;
      }
    `;
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
