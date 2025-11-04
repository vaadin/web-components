/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-iconset.js';
import { html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { iconStyles } from './styles/vaadin-icon-base-styles.js';
import { IconMixin } from './vaadin-icon-mixin.js';
import { ensureSvgLiteral } from './vaadin-icon-svg.js';

/**
 * `<vaadin-icon>` is a Web Component for displaying SVG icons.
 *
 * ### Icon property
 *
 * The `<vaadin-icon>` component is designed to be used as a drop-in replacement for `<iron-icon>`.
 * For example, you can use it with `vaadin-icons` like this:
 *
 * ```html
 * <vaadin-icon icon="vaadin:angle-down"></vaadin-icon>
 * ```
 *
 * Alternatively, you can also pick one of the Lumo icons:
 *
 * ```html
 * <vaadin-icon icon="lumo:user"></vaadin-icon>
 * ```
 *
 * ### Custom SVG icon
 *
 * Alternatively, instead of selecting an icon from an iconset by name, you can pass any custom `svg`
 * literal using the [`svg`](#/elements/vaadin-icon#property-svg) property. In this case you can also
 * define the size of the SVG `viewBox` using the [`size`](#/elements/vaadin-icon#property-size) property:
 *
 * ```js
 * import { html, svg } from 'lit';
 *
 * // in your component
 * render() {
 *   const svgIcon = svg`<path d="M13 4v2l-5 5-5-5v-2l5 5z"></path>`;
 *   return html`
 *     <vaadin-icon
 *       .svg="${svgIcon}"
 *       size="16"
 *     ></vaadin-icon>
 *   `;
 * }
 * ```
 *
 * ### Styling
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property          | Description
 * -----------------------------|-------------
 * `--vaadin-icon-size`         | Size (width and height) of the icon
 * `--vaadin-icon-stroke-width` | Stroke width of the SVG icon
 * `--vaadin-icon-visual-size`  | Visual size of the icon
 *
 * The following state attributes are available for styling:
 *
 * Attribute      | Description
 * ---------------|-------------
 * `has-tooltip`  | Set when the icon has a slotted tooltip
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes IconMixin
 * @mixes ThemableMixin
 * @mixes ElementMixin
 */
class Icon extends IconMixin(ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))))) {
  static get is() {
    return 'vaadin-icon';
  }

  static get styles() {
    // Apply `super.styles` only if the fallback is used
    return [iconStyles, super.styles].filter(Boolean);
  }

  static get lumoInjector() {
    return { ...super.lumoInjector, includeBaseStyles: true };
  }

  /** @protected */
  render() {
    return html`
      <span class="baseline"></span>
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="${this.__viewBox || `0 0 ${this.size} ${this.size}`}"
        preserveAspectRatio="${this.__preserveAspectRatio || 'xMidYMid meet'}"
        fill="${ifDefined(this.__fill)}"
        stroke="${ifDefined(this.__stroke)}"
        stroke-width="${ifDefined(this.__strokeWidth)}"
        stroke-linecap="${ifDefined(this.__strokeLinecap)}"
        stroke-linejoin="${ifDefined(this.__strokeLinejoin)}"
        aria-hidden="true"
      >
        <g id="svg-group">${ensureSvgLiteral(this.svg)}</g>
        <g id="use-group" visibility="${this.__useRef ? 'visible' : 'hidden'}">
          <use href="${ifDefined(this.__useRef)}" />
        </g>
      </svg>

      <slot name="tooltip"></slot>
    `;
  }
}

defineCustomElement(Icon);

export { Icon };
