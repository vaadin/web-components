/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';

/**
 * `<vaadin-horizontal-layout>` provides a simple way to horizontally align your HTML elements.
 *
 * ```
 * <vaadin-horizontal-layout>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </vaadin-horizontal-layout>
 * ```
 *
 * ### Built-in Theme Variations
 *
 * `<vaadin-horizontal-layout>` supports the following theme variations:
 *
 * Theme variation | Description
 * ---|---
 * `theme="margin"` | Applies the default amount of CSS margin for the host element (specified by the theme)
 * `theme="padding"` | Applies the default amount of CSS padding for the host element (specified by the theme)
 * `theme="spacing"` | Applies the default amount of CSS margin between items (specified by the theme)
 *
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @mixes ElementMixin
 */
class HorizontalLayoutElement extends ElementMixin(ThemableMixin(PolymerElement)) {
  static get template() {
    return html`
      <style>
        :host {
          display: flex;
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

        :host([theme~='spacing']:not([dir='rtl'])) ::slotted(*) {
          margin-left: 1em;
        }

        :host([theme~='spacing'][dir='rtl']) ::slotted(*) {
          margin-right: 1em;
        }

        /* Compensate for the first item margin, so that there is no gap around the layout itself. */
        :host([theme~='spacing'])::before {
          content: '';
        }

        :host([theme~='spacing']:not([dir='rtl']))::before {
          margin-left: -1em;
        }

        :host([theme~='spacing'][dir='rtl'])::before {
          margin-right: -1em;
        }
      </style>

      <slot></slot>
    `;
  }

  static get is() {
    return 'vaadin-horizontal-layout';
  }

  static get version() {
    return '1.4.0';
  }
}

customElements.define(HorizontalLayoutElement.is, HorizontalLayoutElement);

export { HorizontalLayoutElement };
