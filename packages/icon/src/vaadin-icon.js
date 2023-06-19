/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ensureSvgLiteral, renderSvg } from './vaadin-icon-svg.js';
import { Iconset } from './vaadin-iconset.js';

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
 * @extends HTMLElement
 * @mixes ControllerMixin
 * @mixes ThemableMixin
 * @mixes ElementMixin
 */
class Icon extends ThemableMixin(ElementMixin(ControllerMixin(PolymerElement))) {
  static get template() {
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
        }

        :host([hidden]) {
          display: none !important;
        }

        svg {
          display: block;
          width: 100%;
          height: 100%;
        }
      </style>
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="[[__computeViewBox(size, __viewBox)]]"
        preserveAspectRatio="[[__computePAR(__defaultPAR, __preserveAspectRatio)]]"
        aria-hidden="true"
      ></svg>

      <slot name="tooltip"></slot>
    `;
  }

  static get is() {
    return 'vaadin-icon';
  }

  static get properties() {
    return {
      /**
       * The name of the icon to use. The name should be of the form:
       * `iconset_name:icon_name`. When using `vaadin-icons` it is possible
       * to omit the first part and only use `icon_name` as a value.
       *
       * Setting the `icon` property updates the `svg` and `size` based on the
       * values provided by the corresponding `vaadin-iconset` element.
       *
       * See also [`name`](#/elements/vaadin-iconset#property-name) property of `vaadin-iconset`.
       */
      icon: {
        type: String,
        observer: '__iconChanged',
      },

      /**
       * The SVG icon wrapped in a Lit template literal.
       */
      svg: {
        type: Object,
      },

      /**
       * The size of an icon, used to set the `viewBox` attribute.
       */
      size: {
        type: Number,
        value: 24,
      },

      /** @private */
      __defaultPAR: {
        type: String,
        value: 'xMidYMid meet',
      },

      /** @private */
      __preserveAspectRatio: String,

      /** @private */
      __svgElement: Object,

      /** @private */
      __viewBox: String,
    };
  }

  static get observers() {
    return ['__svgChanged(svg, __svgElement)'];
  }

  /** @protected */
  ready() {
    super.ready();
    this.__svgElement = this.shadowRoot.querySelector('svg');

    this._tooltipController = new TooltipController(this);
    this.addController(this._tooltipController);
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();

    Iconset.attachedIcons.add(this);
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();

    Iconset.attachedIcons.delete(this);
  }

  /** @protected */
  _applyIcon() {
    const { preserveAspectRatio, svg, size, viewBox } = Iconset.getIconSvg(this.icon);

    if (viewBox) {
      this.__viewBox = viewBox;
    }

    if (preserveAspectRatio) {
      this.__preserveAspectRatio = preserveAspectRatio;
    }

    if (size && size !== this.size) {
      this.size = size;
    }

    this.svg = svg;
  }

  /** @private */
  __iconChanged(icon) {
    if (icon) {
      this._applyIcon();
    } else {
      this.svg = ensureSvgLiteral(null);
    }
  }

  /** @private */
  __svgChanged(svg, svgElement) {
    if (!svgElement) {
      return;
    }

    renderSvg(svg, svgElement);
  }

  /** @private */
  __computePAR(defaultPAR, preserveAspectRatio) {
    return preserveAspectRatio || defaultPAR;
  }

  /** @private */
  __computeViewBox(size, viewBox) {
    return viewBox || `0 0 ${size} ${size}`;
  }
}

customElements.define(Icon.is, Icon);

export { Icon };
