/**
 * @license
 * Copyright (c) 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-card>` is a visual content container.
 *
 * ```html
 * <vaadin-card>
 *   <div>Card content</div>
 * </vaadin-card>
 * ```
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
class Card extends ElementMixin(ThemableMixin(PolylitMixin(LitElement))) {
  static get is() {
    return 'vaadin-card';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      :host([hidden]) {
        display: none !important;
      }
    `;
  }

  // This indicates the component is "experimental" and needs to be
  // enabled explicitly in order to define a working custom element:
  // window.Vaadin.featureFlags.cardComponent = true;
  static get experimental() {
    return true;
  }

  /** @protected */
  render() {
    return html`<slot></slot>`;
  }
}

defineCustomElement(Card);

export { Card };
