/**
 * @license
 * Copyright (c) 2022 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-badge>` is a Web Component for showing information in the form of colored badges.
 *
 * ```
 *  <vaadin-badge>Success</vaadin-badge>
 * ```
 *
 * ### Styling
 *
 * No shadow DOM parts are exposed for styling.
 *
 * The following `theme` variants are supported: small, success, error, contrast, primary, pill
 *
 * See [Styling Components](hhttps://vaadin.com/docs/latest/components/ds-resources/customization/styling-components) documentation.
 *
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
class Badge extends ElementMixin(ThemableMixin(PolymerElement)) {
  static get template() {
    return html`
      <style>
        span {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          line-height: 1;
          font-weight: 500;
          text-transform: initial;
          letter-spacing: initial;
        }

        /* Ensure proper vertical alignment */
        span::before {
          display: inline-block;
          content: '\\2003';
          width: 0;
        }

        /* Links */

        [href]:hover {
          text-decoration: none;
        }

        /* RTL specific styles */

        [dir='rtl'] iron-icon:first-child {
          margin-right: -0.375em;
          margin-left: 0;
        }

        [dir='rtl'] iron-icon:last-child {
          margin-left: -0.375em;
          margin-right: 0;
        }
      </style>
      <span>
        <slot></slot>
      </span>
    `;
  }

  static get is() {
    return 'vaadin-badge';
  }
}

customElements.define(Badge.is, Badge);

export { Badge };
