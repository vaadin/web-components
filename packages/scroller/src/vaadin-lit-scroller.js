/**
 * @license
 * Copyright (c) 2020 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { OverflowController } from '@vaadin/component-base/src/overflow-controller.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ScrollerMixin } from './vaadin-scroller-mixin.js';

/**
 * LitElement based version of `<vaadin-scroller>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
class Scroller extends ScrollerMixin(ElementMixin(ThemableMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-scroller';
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

      :host([scroll-direction='vertical']) {
        overflow-x: hidden;
      }

      :host([scroll-direction='horizontal']) {
        overflow-y: hidden;
      }

      :host([scroll-direction='none']) {
        overflow: hidden;
      }
    `;
  }

  /** @protected */
  render() {
    return html`<slot></slot>`;
  }

  /** @protected */
  ready() {
    super.ready();

    this.__overflowController = new OverflowController(this);
    this.addController(this.__overflowController);
  }
}

defineCustomElement(Scroller);

export { Scroller };
