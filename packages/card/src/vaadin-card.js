/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

function isEnabled() {
  return window.Vaadin && window.Vaadin.featureFlags && !!window.Vaadin.featureFlags.cardComponent;
}

/**
 * <vaadin-card> is a visual content container.
 *
 * ```html
 * <vaadin-card class="flex flex-col overflow-hidden">
 *   <img
 *     src="https://images.unsplash.com/photo-1519681393784-d120267933ba?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80"
 *     alt="">
 *   <div class="flex flex-col items-start p-m">
 *     <h3>Card Title</h3>
 *     <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut.</p>
 *     <span theme="badge">Label</span>
 *   </div>
 * </vaadin-card>
 * ```
 *
 * [<img src="https://raw.githubusercontent.com/vaadin/web-components/main/packages/card/screenshot.png" width="296" alt="Screenshot of vaadin-card">](https://vaadin.com/docs/latest/components/button)
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

  /** @protected */
  render() {
    return html`<slot></slot>`;
  }
}

if (isEnabled()) {
  defineCustomElement(Card);
} else {
  console.warn(
    'WARNING: The card component is currently an experimental feature and needs to be explicitly enabled. To enable the component, `import "@vaadin/card/enable.js"` *before* importing the card module itself.',
  );
}

export { Card };
