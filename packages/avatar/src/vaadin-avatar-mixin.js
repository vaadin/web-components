/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { FocusMixin } from '@vaadin/a11y-base/src/focus-mixin.js';
import { I18nMixin } from '@vaadin/component-base/src/i18n-mixin.js';

const DEFAULT_I18N = {
  anonymous: 'anonymous',
};

/**
 * A mixin providing common avatar functionality.
 *
 * @polymerMixin
 * @mixes FocusMixin
 */
export const AvatarMixin = (superClass) =>
  class AvatarMixinClass extends I18nMixin(DEFAULT_I18N, FocusMixin(superClass)) {
    static get properties() {
      return {
        /**
         * The path to the image
         */
        img: {
          type: String,
          reflectToAttribute: true,
          observer: '__imgChanged',
        },

        /**
         * A shortened form of name that is displayed
         * in the avatar when `img` is not provided.
         */
        abbr: {
          type: String,
          reflectToAttribute: true,
        },

        /**
         * Full name of the user
         * used for the tooltip of the avatar.
         */
        name: {
          type: String,
          reflectToAttribute: true,
        },

        /**
         * Color index used for avatar background.
         * @attr {number} color-index
         */
        colorIndex: {
          type: Number,
          observer: '__colorIndexChanged',
        },

        /**
         * When true, the avatar has tooltip shown on hover and focus.
         * The tooltip text is based on the `name` and `abbr` properties.
         * When neither is provided, `i18n.anonymous` is used instead.
         * @attr {boolean} with-tooltip
         */
        withTooltip: {
          type: Boolean,
          value: false,
          observer: '__withTooltipChanged',
        },

        /** @protected */
        __imgVisible: Boolean,

        /** @protected */
        __iconVisible: Boolean,

        /** @protected */
        __abbrVisible: Boolean,

        /** @private */
        __tooltipNode: Object,
      };
    }

    static get observers() {
      return [
        '__imgOrAbbrOrNameChanged(img, abbr, name)',
        '__i18nChanged(__effectiveI18n)',
        '__tooltipChanged(__tooltipNode, name, abbr)',
      ];
    }

    /**
     * The object used to localize this component. To change the default
     * localization, replace this with an object that provides all properties, or
     * just the individual properties you want to change.
     *
     * The object has the following JSON structure and default values:
     * ```
     * {
     *   // Translation of the anonymous user avatar tooltip.
     *   anonymous: 'anonymous'
     * }
     * ```
     * @return {!AvatarI18n}
     */
    get i18n() {
      return super.i18n;
    }

    set i18n(value) {
      super.i18n = value;
    }

    /** @protected */
    ready() {
      super.ready();

      this.__updateVisibility();

      // By default, if the user hasn't provided a custom role,
      // the role attribute is set to "img".
      if (!this.hasAttribute('role')) {
        this.setAttribute('role', 'img');
      }

      if (!this.hasAttribute('tabindex')) {
        this.setAttribute('tabindex', '0');
      }

      // Should set `anonymous` if name / abbr is not provided
      if (!this.name && !this.abbr) {
        this.__setTooltip();
      }
    }

    /** @private */
    __colorIndexChanged(index) {
      if (index != null) {
        const prop = `--vaadin-user-color-${index}`;

        // Check if custom CSS property is defined
        const isValid = Boolean(getComputedStyle(document.documentElement).getPropertyValue(prop));

        if (isValid) {
          this.setAttribute('has-color-index', '');
          this.style.setProperty('--vaadin-avatar-user-color', `var(${prop})`);
        } else {
          this.removeAttribute('has-color-index');
          console.warn(`The CSS property --vaadin-user-color-${index} is not defined`);
        }
      } else {
        this.removeAttribute('has-color-index');
      }
    }

    /** @private */
    __imgChanged() {
      this.__imgFailedToLoad = false;
    }

    /** @private */
    __imgOrAbbrOrNameChanged(_img, abbr, name) {
      this.__updateVisibility();

      if (abbr && abbr !== this.__generatedAbbr) {
        return;
      }

      if (name) {
        this.abbr = this.__generatedAbbr = name
          .split(' ')
          .map((word) => word.charAt(0))
          .join('');
      } else {
        this.abbr = undefined;
      }
    }

    /** @private */
    __tooltipChanged(tooltipNode, name, abbr) {
      if (tooltipNode) {
        if (abbr && abbr !== this.__generatedAbbr) {
          this.__setTooltip(name ? `${name} (${abbr})` : abbr);
        } else {
          this.__setTooltip(name);
        }
      }

      if (abbr) {
        // By default, generate aria-label attribute containing the abbr value.
        // When no tooltip is set, prefix the aria-label with the name value.
        this.setAttribute('aria-label', !tooltipNode && name ? `${name} (${abbr})` : abbr);
      } else {
        this.removeAttribute('aria-label');
      }
    }

    /** @private */
    __withTooltipChanged(withTooltip, oldWithTooltip) {
      if (withTooltip) {
        // Create and attach tooltip
        const tooltipNode = document.createElement('vaadin-tooltip');
        tooltipNode.setAttribute('slot', 'tooltip');
        this.appendChild(tooltipNode);
        this.__tooltipNode = tooltipNode;
      } else if (oldWithTooltip) {
        // Cleanup and detach tooltip
        this.__tooltipNode.target = null;
        this.__tooltipNode.remove();
        this.__tooltipNode = null;
      }
    }

    /** @private */
    __i18nChanged(effectiveI18n) {
      if (effectiveI18n && effectiveI18n.anonymous) {
        if (this.__oldAnonymous && this.__tooltipNode && this.__tooltipNode.text === this.__oldAnonymous) {
          this.__setTooltip();
        }

        this.__oldAnonymous = effectiveI18n.anonymous;
      }
    }

    /** @private */
    __updateVisibility() {
      this.__imgVisible = !!this.img && !this.__imgFailedToLoad;
      this.__abbrVisible = !this.__imgVisible && !!this.abbr;
      this.__iconVisible = !this.__imgVisible && !this.abbr;
    }

    /** @private */
    __setTooltip(tooltip) {
      const tooltipNode = this.__tooltipNode;
      if (tooltipNode) {
        tooltipNode.text = tooltip || this.__effectiveI18n.anonymous;
      }
    }

    /** @protected */
    __onImageLoadError() {
      if (this.img) {
        console.warn(`<vaadin-avatar> The specified image could not be loaded: ${this.img}`);
        this.__imgFailedToLoad = true;
        this.__updateVisibility();
      }
    }
  };
