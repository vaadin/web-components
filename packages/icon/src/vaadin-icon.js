/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { SlotStylesMixin } from '@vaadin/component-base/src/slot-styles-mixin.js';
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { IconFontSizeMixin } from './vaadin-icon-font-size-mixin.js';
import { ensureSvgLiteral, renderSvg, unsafeSvgLiteral } from './vaadin-icon-svg.js';
import { Iconset } from './vaadin-iconset.js';

const srcCache = new Map();

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
 * @customElement
 * @extends HTMLElement
 * @mixes ControllerMixin
 * @mixes ThemableMixin
 * @mixes ElementMixin
 * @mixes SlotStylesMixin
 * @mixes IconFontSizeMixin
 */
class Icon extends ThemableMixin(ElementMixin(ControllerMixin(SlotStylesMixin(IconFontSizeMixin(PolymerElement))))) {
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
        viewBox="[[__computeViewBox(size, __viewBox)]]"
        preserveAspectRatio="[[__computePAR(__defaultPAR, __preserveAspectRatio)]]"
        fill$="[[__fill]]"
        stroke$="[[__stroke]]"
        stroke-width$="[[__strokeWidth]]"
        stroke-linecap$="[[__strokeLinecap]]"
        stroke-linejoin$="[[__strokeLinejoin]]"
        aria-hidden="true"
      >
        <g id="svg-group"></g>
        <g id="use-group" visibility$="[[__computeVisibility(__useRef, svg)]]">
          <use href$="[[__useRef]]" />
        </g>
      </svg>

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
       *
       * @attr {string} icon
       * @type {string}
       */
      icon: {
        type: String,
        reflectToAttribute: true,
        observer: '__iconChanged',
      },

      /**
       * The SVG icon wrapped in a Lit template literal.
       */
      svg: {
        type: Object,
      },

      /**
       * The SVG source to be loaded as the icon. It can be:
       * - an URL to a file containing the icon
       * - an URL in the format "/path/to/file.svg#objectID", where the "objectID" refers to an ID attribute contained
       *   inside the SVG referenced by the path. Note that the file needs to follow the same-origin policy.
       * - a string in the format "data:image/svg+xml,<svg>...</svg>". You may need to use the "encodeURIComponent"
       *   function for the SVG content passed
       *
       * @type {string}
       */
      src: {
        type: String,
      },

      /**
       * The symbol identifier that references an ID of an element contained in the SVG element assigned to the
       * `src` property
       *
       * @type {string}
       */
      symbol: {
        type: String,
      },

      /**
       * Class names defining an icon font and/or a specific glyph inside an icon font.
       *
       * Example: "fa-solid fa-user"
       *
       * @attr {string} icon-class
       * @type {string}
       */
      iconClass: {
        type: String,
        reflectToAttribute: true,
      },

      /**
       * A hexadecimal code point that specifies a glyph from an icon font.
       *
       * Example: "e001"
       *
       * @type {string}
       */
      char: {
        type: String,
      },

      /**
       * A ligature name that specifies an icon from an icon font with support for ligatures.
       *
       * Example: "home".
       *
       * @type {string}
       */
      ligature: {
        type: String,
      },

      /**
       * The font family to use for the font icon.
       *
       * @type {string}
       */
      fontFamily: {
        type: String,
        observer: '__fontFamilyChanged',
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
      __useRef: Object,

      /** @private */
      __svgElement: String,

      /** @private */
      __viewBox: String,

      /** @private */
      __fill: String,

      /** @private */
      __stroke: String,

      /** @private */
      __strokeWidth: String,

      /** @private */
      __strokeLinecap: String,

      /** @private */
      __strokeLinejoin: String,
    };
  }

  static get observers() {
    return ['__svgChanged(svg, __svgElement)', '__fontChanged(iconClass, char, ligature)', '__srcChanged(src, symbol)'];
  }

  static get observedAttributes() {
    return [...super.observedAttributes, 'class'];
  }

  constructor() {
    super();

    this.__fetch = fetch.bind(window);
  }

  /** @protected */
  get slotStyles() {
    const tag = this.localName;
    return [
      `
        ${tag}[icon-class] {
          display: inline-flex;
          vertical-align: middle;
          font-size: inherit;
        }
      `,
    ];
  }

  /** @private */
  get __iconClasses() {
    return this.iconClass ? this.iconClass.split(' ') : [];
  }

  /** @protected */
  ready() {
    super.ready();
    this.__svgElement = this.shadowRoot.querySelector('#svg-group');

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
  async __srcChanged(src, symbol) {
    if (!src) {
      this.svg = null;
      return;
    }

    // Need to add the "icon" attribute to avoid issues as described in
    // https://github.com/vaadin/web-components/issues/6301
    this.icon = '';

    if (!src.startsWith('data:') && (symbol || src.includes('#'))) {
      const [path, iconId] = src.split('#');
      this.__useRef = `${path}#${symbol || iconId}`;
    } else {
      try {
        if (!srcCache.has(src)) {
          srcCache.set(
            src,
            this.__fetch(src, { mode: 'cors' }).then((data) => {
              if (!data.ok) {
                throw new Error('Error loading icon');
              }
              return data.text();
            }),
          );
        }
        const svgData = await srcCache.get(src);

        if (!Icon.__domParser) {
          Icon.__domParser = new DOMParser();
        }
        const parsedResponse = Icon.__domParser.parseFromString(svgData, 'text/html');

        const svgElement = parsedResponse.querySelector('svg');
        if (!svgElement) {
          throw new Error(`SVG element not found on path: ${src}`);
        }

        this.svg = unsafeSvgLiteral(svgElement.innerHTML);

        if (symbol) {
          this.__useRef = `#${symbol}`;
        }

        this.__viewBox = svgElement.getAttribute('viewBox');
        this.__fill = svgElement.getAttribute('fill');
        this.__stroke = svgElement.getAttribute('stroke');
        this.__strokeWidth = svgElement.getAttribute('stroke-width');
        this.__strokeLinecap = svgElement.getAttribute('stroke-linecap');
        this.__strokeLinejoin = svgElement.getAttribute('stroke-linejoin');
      } catch (e) {
        console.error(e);
        this.svg = null;
      }
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
  __computeVisibility(__useRef) {
    return __useRef ? 'visible' : 'hidden';
  }

  /** @private */
  __computeViewBox(size, viewBox) {
    return viewBox || `0 0 ${size} ${size}`;
  }

  /** @private */
  __fontChanged(iconClass, char, ligature) {
    this.classList.remove(...(this.__addedIconClasses || []));
    if (iconClass) {
      this.__addedIconClasses = [...this.__iconClasses];
      this.classList.add(...this.__addedIconClasses);
    }

    if (char) {
      this.setAttribute('font-icon-content', char.length > 1 ? String.fromCodePoint(parseInt(char, 16)) : char);
    } else if (ligature) {
      this.setAttribute('font-icon-content', ligature);
    } else {
      this.removeAttribute('font-icon-content');
    }

    if ((iconClass || char || ligature) && !this.icon) {
      // The "icon" attribute needs to be set on the host also when using font icons
      // to avoid issues such as https://github.com/vaadin/web-components/issues/6301
      this.icon = '';
    }
  }

  /** @protected */
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);

    // Make sure class list always contains all the font class names
    if (name === 'class' && this.__iconClasses.some((className) => !this.classList.contains(className))) {
      this.classList.add(...this.__iconClasses);
    }
  }

  /** @private */
  __fontFamilyChanged(fontFamily) {
    this.style.fontFamily = `'${fontFamily}'`;
  }
}

defineCustomElement(Icon);

export { Icon };
