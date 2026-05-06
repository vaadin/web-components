/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
// @ts-check -- gradual ts-check pilot, see proto/ts-check
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';
import { IconFontSizeMixin } from './vaadin-icon-font-size-mixin.js';
import { unsafeSvgLiteral } from './vaadin-icon-svg.js';

/**
 * @typedef {import('./vaadin-icon-svg.js').IconSvgLiteral} IconSvgLiteral
 *
 * @typedef {{
 *   ready(): void;
 *   connectedCallback(): void;
 *   disconnectedCallback(): void;
 *   attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
 *   addController(controller: import('lit').ReactiveController): void;
 * }} HostInstance
 *
 * @typedef {(new (...args: any[]) => HTMLElement & HostInstance) & { readonly observedAttributes: readonly string[] }} HostBaseClass
 */

/** @type {Map<string, Promise<string>>} */
const srcCache = new Map();

const Iconset = /** @type {typeof import('./vaadin-iconset.js').Iconset} */ (customElements.get('vaadin-iconset'));

/**
 * @polymerMixin
 * @mixes IconFontSizeMixin
 * @template {HostBaseClass} T
 * @param {T} superClass
 */
export const IconMixin = (superClass) =>
  class extends IconFontSizeMixin(superClass) {
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
         */
        icon: {
          type: String,
          reflectToAttribute: true,
          observer: '__iconChanged',
          sync: true,
        },

        /**
         * The SVG icon wrapped in a Lit template literal.
         */
        svg: {
          type: Object,
          sync: true,
        },

        /**
         * The SVG source to be loaded as the icon. It can be:
         * - an URL to a file containing the icon
         * - an URL in the format `/path/to/file.svg#objectID`, where the `objectID` refers to an ID attribute contained
         *   inside the SVG referenced by the path. Note that the file needs to follow the same-origin policy.
         * - a string in the format `data:image/svg+xml,<svg>...</svg>`. You may need to use the `encodeURIComponent`
         *   function for the SVG content passed
         *
         */
        src: {
          type: String,
          sync: true,
        },

        /**
         * The symbol identifier that references an ID of an element contained in the SVG element assigned to the
         * `src` property
         *
         */
        symbol: {
          type: String,
          sync: true,
        },

        /**
         * Class names defining an icon font and/or a specific glyph inside an icon font.
         *
         * Example: "fa-solid fa-user"
         *
         * @attr {string} icon-class
         */
        iconClass: {
          type: String,
          reflectToAttribute: true,
          sync: true,
        },

        /**
         * A hexadecimal code point that specifies a glyph from an icon font.
         *
         * Example: "e001"
         *
         */
        char: {
          type: String,
          sync: true,
        },

        /**
         * A ligature name that specifies an icon from an icon font with support for ligatures.
         *
         * Example: "home".
         *
         */
        ligature: {
          type: String,
          sync: true,
        },

        /**
         * The font family to use for the font icon.
         *
         * @attr {string} font-family
         */
        fontFamily: {
          type: String,
          observer: '__fontFamilyChanged',
          sync: true,
        },

        /**
         * The size of an icon, used to set the `viewBox` attribute.
         */
        size: {
          type: Number,
          value: 24,
          sync: true,
        },

        /** @private */
        __preserveAspectRatio: String,

        /** @private */
        __useRef: String,

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
      return ['__fontChanged(iconClass, char, ligature)', '__srcChanged(src, symbol)'];
    }

    static get observedAttributes() {
      return [...super.observedAttributes, 'class'];
    }

    constructor() {
      super();
      // Type-only declarations: assign each property its existing default so
      // the setter call is a no-op and Lit's reactive-property observers do
      // not fire during construction. `value:` defaults from `static
      // properties` must be mirrored here.
      /** @type {string | null | undefined} */
      this.icon = undefined;
      /** @type {IconSvgLiteral | null | undefined} */
      this.svg = undefined;
      /** @type {string | null | undefined} */
      this.src = undefined;
      /** @type {string | null | undefined} */
      this.symbol = undefined;
      /** @type {string | null | undefined} */
      this.iconClass = undefined;
      /** @type {string | null | undefined} */
      this.char = undefined;
      /** @type {string | null | undefined} */
      this.ligature = undefined;
      /** @type {string | null | undefined} */
      this.fontFamily = undefined;
      /** @type {number} */
      this.size = 24;
      /** @type {string | null | undefined} */
      this.__preserveAspectRatio = undefined;
      /** @type {string | null | undefined} */
      this.__useRef = undefined;
      /** @type {string | null | undefined} */
      this.__viewBox = undefined;
      /** @type {string | null | undefined} */
      this.__fill = undefined;
      /** @type {string | null | undefined} */
      this.__stroke = undefined;
      /** @type {string | null | undefined} */
      this.__strokeWidth = undefined;
      /** @type {string | null | undefined} */
      this.__strokeLinecap = undefined;
      /** @type {string | null | undefined} */
      this.__strokeLinejoin = undefined;
      /** @type {string[] | undefined} */
      this.__addedIconClasses = undefined;
      /** @type {TooltipController | undefined} */
      this._tooltipController = undefined;
      this.__fetch = fetch.bind(window);
    }

    /** @private */
    get __iconClasses() {
      return this.iconClass ? this.iconClass.split(' ') : [];
    }

    ready() {
      super.ready();
      this._tooltipController = new TooltipController(this);
      this.addController(this._tooltipController);
    }

    connectedCallback() {
      super.connectedCallback();
      Iconset.attachedIcons.add(/** @type {import('./vaadin-icon.js').Icon} */ (/** @type {unknown} */ (this)));
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      Iconset.attachedIcons.delete(/** @type {import('./vaadin-icon.js').Icon} */ (/** @type {unknown} */ (this)));
    }

    /** @protected */
    _applyIcon() {
      if (!this.icon) {
        return;
      }
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

    /**
     * @private
     * @param {string | null} icon
     */
    __iconChanged(icon) {
      if (icon) {
        this._applyIcon();
      } else {
        this.svg = null;
      }
    }

    /**
     * @private
     * @param {string | null} src
     * @param {string | null} symbol
     */
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
              this.__fetch(src, {
                mode: 'cors',
              }).then((data) => {
                if (!data.ok) {
                  throw new Error('Error loading icon');
                }
                return data.text();
              }),
            );
          }
          const svgData = /** @type {string} */ (await srcCache.get(src));
          const sc = /** @type {{ __domParser?: DOMParser }} */ (/** @type {unknown} */ (superClass));
          if (!sc.__domParser) {
            sc.__domParser = new DOMParser();
          }
          const parsedResponse = sc.__domParser.parseFromString(svgData, 'text/html');
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

    /**
     * @private
     * @param {string | null} iconClass
     * @param {string | null} char
     * @param {string | null} ligature
     */
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

    /**
     * @param {string} name
     * @param {string | null} oldValue
     * @param {string | null} newValue
     */
    attributeChangedCallback(name, oldValue, newValue) {
      super.attributeChangedCallback(name, oldValue, newValue);

      // Make sure class list always contains all the font class names
      if (name === 'class' && this.__iconClasses.some((className) => !this.classList.contains(className))) {
        this.classList.add(...this.__iconClasses);
      }
    }

    /**
     * @private
     * @param {string | null} fontFamily
     */
    __fontFamilyChanged(fontFamily) {
      this.style.fontFamily = `'${fontFamily}'`;
    }
  };
