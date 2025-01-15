/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * LitElement based version of `<vaadin-vertical-layout>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
class VerticalLayout extends ThemableMixin(ElementMixin(PolylitMixin(LitElement))) {
  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        box-sizing: border-box;
      }

      :host([hidden]) {
        display: none !important;
      }

      /* Theme variations */
      :host([theme~='margin']) {
        margin: 1em;
      }

      :host([theme~='padding']) {
        padding: 1em;
      }

      :host([theme~='spacing']) {
        gap: 1em;
      }

      ::slotted(*) {
        --_vaadin-layout-item-vertical-flex: 0 1 auto;
        min-height: calc(var(--vaadin-layout-improvements) * 0px);
        flex: calc(var(--vaadin-layout-improvements) * var(--_vaadin-layout-item-vertical-flex));
      }
    `;
  }

  static get is() {
    return 'vaadin-vertical-layout';
  }

  render() {
    return html`<slot></slot>`;
  }
}

defineCustomElement(VerticalLayout);

export { VerticalLayout };
