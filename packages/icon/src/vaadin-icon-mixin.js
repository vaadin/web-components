/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { setOrRemoveAttribute } from '@vaadin/component-base/src/dom-utils.js';
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';
import { IconFontSizeMixin } from './vaadin-icon-font-size-mixin.js';
import { parseSvg } from './vaadin-icon-helpers.js';

const srcCache = new Map();

const Iconset = customElements.get('vaadin-iconset');

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
         *   inside the SVG referenced by the path
         * - a string in the format `data:image/svg+xml,<svg>...</svg>`. You may need to use the `encodeURIComponent`
         *   function for the SVG content passed
         *
         * A file from another origin needs CORS headers. Only static SVG content is rendered, so use presentation
         * attributes such as `fill` instead of a `<style>` element.
         */
        src: {
          type: String,
          sync: true,
        },

        /**
         * The symbol identifier that references an ID of an element contained in the SVG element assigned to the
         * `src` property
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
         */
        char: {
          type: String,
          sync: true,
        },

        /**
         * A ligature name that specifies an icon from an icon font with support for ligatures.
         *
         * Example: "home".
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
      this.__fetch = fetch.bind(window);
    }

    /** @private */
    get __iconClasses() {
      return this.iconClass ? this.iconClass.split(' ') : [];
    }

    /** @protected */
    ready() {
      super.ready();
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
        this.svg = null;
      }
    }

    /** @private */
    async __srcChanged(src, symbol) {
      this.__useRef = undefined;
      if (!src) {
        this.svg = null;
        return;
      }

      // Need to add the "icon" attribute to avoid issues as described in
      // https://github.com/vaadin/web-components/issues/6301
      this.icon = '';
      const [path, iconId] = src.split('#');
      const ref = symbol || iconId;
      try {
        if (!srcCache.has(path)) {
          srcCache.set(
            path,
            this.__fetch(path, {
              mode: 'cors',
            })
              .then((data) => {
                if (!data.ok) {
                  throw new Error('Error loading icon');
                }
                return data.text();
              })
              .then((text) => {
                const parsed = parseSvg(text);
                if (!parsed) {
                  throw new Error(`SVG element not found on path: ${path}`);
                }
                return parsed;
              }),
          );
        }
        const parsed = await srcCache.get(path);
        if (src !== this.src || symbol !== this.symbol) {
          return;
        }
        // Reference an element of a sprite, render a standalone icon inline
        const root = ref ? null : parsed.svgElement;
        this.svg = ref ? null : parsed.svg;
        this.__useRef = ref ? `${parsed.url}#${ref}` : undefined;
        this.__viewBox = root?.getAttribute('viewBox');
        this.__fill = root?.getAttribute('fill');
        this.__stroke = root?.getAttribute('stroke');
        this.__strokeWidth = root?.getAttribute('stroke-width');
        this.__strokeLinecap = root?.getAttribute('stroke-linecap');
        this.__strokeLinejoin = root?.getAttribute('stroke-linejoin');
      } catch (e) {
        console.error(e);
        this.svg = null;
      }
    }

    /** @private */
    __fontChanged(iconClass, char, ligature) {
      this.classList.remove(...(this.__addedIconClasses || []));
      if (iconClass) {
        this.__addedIconClasses = [...this.__iconClasses];
        this.classList.add(...this.__addedIconClasses);
      }
      let content = ligature;
      if (char) {
        content = char.length > 1 ? String.fromCodePoint(parseInt(char, 16)) : char;
      }
      setOrRemoveAttribute(this, 'font-icon-content', content);
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
  };
