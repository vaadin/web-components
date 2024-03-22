/**
 * @license
 * Copyright (c) 2021 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-lit-iconset.js';
import { html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { IconMixin } from './vaadin-icon-mixin.js';

/**
 * LitElement based version of `<vaadin-icon>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment not intended for publishing to npm.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
class Icon extends IconMixin(ControllerMixin(ElementMixin(ThemableMixin(PolylitMixin(LitElement))))) {
  render() {
    return html`
      <style>
        :host {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          box-sizing: border-box;
          vertical-align: middle;
          width: 24px;
          height: 24px;
          fill: currentColor;
          container-type: size;
        }

        :host::after,
        :host::before {
          line-height: 1;
          font-size: 100cqh;
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
          -moz-osx-font-smoothing: grayscale;
        }

        :host([hidden]) {
          display: none !important;
        }

        svg {
          display: block;
          width: 100%;
          height: 100%;
          /* prevent overflowing icon from clipping, see https://github.com/vaadin/flow-components/issues/5872 */
          overflow: visible;
        }

        :host(:is([icon-class], [font-icon-content])) svg {
          display: none;
        }

        :host([font-icon-content])::before {
          content: attr(font-icon-content);
        }
      </style>
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="${this.__computeViewBox(this.size, this.__viewBox)}"
        preserveAspectRatio="${this.__computePAR(this.__defaultPAR, this.__preserveAspectRatio)}"
        fill="${ifDefined(this.__fill)}"
        stroke="${ifDefined(this.__stroke)}"
        stroke-width="${ifDefined(this.__strokeWidth)}"
        stroke-linecap="${ifDefined(this.__strokeLinecap)}"
        stroke-linejoin="${ifDefined(this.__strokeLinejoin)}"
        aria-hidden="true"
      >
        <g id="svg-group"></g>
        <g id="use-group" visibility="${this.__computeVisibility(this.__useRef, this.svg)}">
          <use href="${this.__useRef}" />
        </g>
      </svg>

      <slot name="tooltip"></slot>
    `;
  }

  static get is() {
    return 'vaadin-icon';
  }
}

defineCustomElement(Icon);

export { Icon };
