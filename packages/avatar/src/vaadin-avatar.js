/**
 * @license
 * Copyright (c) 2020 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-avatar-icons.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { FocusMixin } from '@vaadin/component-base/src/focus-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-avatar>` is a Web Component providing avatar displaying functionality.
 *
 * ```html
 * <vaadin-avatar img="avatars/avatar-1.jpg"></vaadin-avatar>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are exposed for styling:
 *
 * Part name | Description
 * --------- | ---------------
 * `abbr`    | The abbreviation element
 * `icon`    | The icon element
 *
 * The following state attributes are available for styling:
 *
 * Attribute         | Description
 * ------------------|-------------
 * `focus-ring`      | Set when the avatar is focused using the keyboard.
 * `focused`         | Set when the avatar is focused.
 * `has-color-index` | Set when the avatar has `colorIndex` and the corresponding custom CSS property exists.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @extends HTMLElement
 * @mixes FocusMixin
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
class Avatar extends FocusMixin(ElementMixin(ThemableMixin(PolymerElement))) {
  static get template() {
    return html`
      <style>
        :host {
          display: inline-block;
          flex: none;
          border-radius: 50%;
          overflow: hidden;
          height: var(--vaadin-avatar-size);
          width: var(--vaadin-avatar-size);
          border: var(--vaadin-avatar-outline-width) solid transparent;
          margin: calc(var(--vaadin-avatar-outline-width) * -1);
          background-clip: content-box;
          --vaadin-avatar-outline-width: 2px;
          --vaadin-avatar-size: 64px;
        }

        img {
          height: 100%;
          width: 100%;
          object-fit: cover;
        }

        [part='icon'] {
          font-size: 5.6em;
        }

        [part='abbr'] {
          font-size: 2.2em;
        }

        [part='icon'] > text {
          font-family: 'vaadin-avatar-icons';
        }

        :host([hidden]) {
          display: none !important;
        }

        svg[hidden] {
          display: none !important;
        }

        :host([has-color-index]) {
          position: relative;
          background-color: var(--vaadin-avatar-user-color);
        }

        :host([has-color-index])::before {
          position: absolute;
          content: '';
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          border-radius: inherit;
          box-shadow: inset 0 0 0 2px var(--vaadin-avatar-user-color);
        }
      </style>
      <img hidden$="[[!__imgVisible]]" src$="[[img]]" aria-hidden="true" on-error="__onImageLoadError" />
      <svg
        part="icon"
        hidden$="[[!__iconVisible]]"
        id="avatar-icon"
        viewBox="-50 -50 100 100"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <text dy=".35em" text-anchor="middle"></text>
      </svg>
      <svg
        part="abbr"
        hidden$="[[!__abbrVisible]]"
        id="avatar-abbr"
        viewBox="-50 -50 100 100"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <text dy=".35em" text-anchor="middle">[[abbr]]</text>
      </svg>
    `;
  }

  static get is() {
    return 'vaadin-avatar';
  }

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
       * used for the title of the avatar.
       */
      name: {
        type: String,
        reflectToAttribute: true,
      },

      /**
       * Color index used for avatar background.
       */
      colorIndex: {
        type: Number,
        observer: '__colorIndexChanged',
      },

      /**
       * The object used to localize this component.
       * To change the default localization, replace the entire
       * _i18n_ object or just the property you want to modify.
       *
       * The object has the following JSON structure and default values:
          {
            // Translation of the anonymous user avatar title.
            anonymous: 'anonymous'
          }
      * @type {!AvatarI18n}
      * @default {English/US}
      */
      i18n: {
        type: Object,
        value: () => {
          return {
            anonymous: 'anonymous',
          };
        },
      },

      /** @private */
      __imgVisible: Boolean,

      /** @private */
      __iconVisible: Boolean,

      /** @private */
      __abbrVisible: Boolean,
    };
  }

  static get observers() {
    return ['__imgOrAbbrOrNameChanged(img, abbr, name)', '__i18nChanged(i18n.*)'];
  }

  /** @protected */
  ready() {
    super.ready();

    this.__updateVisibility();

    // Should set `anonymous` if name / abbr is not provided
    if (!this.name && !this.abbr) {
      this.__setTitle(this.name);
    }

    this.setAttribute('role', 'button');

    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
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
  __imgOrAbbrOrNameChanged(img, abbr, name) {
    this.__updateVisibility();

    if (abbr && abbr !== this.__generatedAbbr) {
      this.__setTitle(name ? `${name} (${abbr})` : abbr);
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

    this.__setTitle(name);
  }

  /** @private */
  __i18nChanged(i18n) {
    if (i18n.base && i18n.base.anonymous) {
      if (this.__oldAnonymous && this.getAttribute('title') === this.__oldAnonymous) {
        this.__setTitle();
      }

      this.__oldAnonymous = i18n.base.anonymous;
    }
  }

  /** @private */
  __updateVisibility() {
    this.__imgVisible = !!this.img && !this.__imgFailedToLoad;
    this.__abbrVisible = !this.__imgVisible && !!this.abbr;
    this.__iconVisible = !this.__imgVisible && !this.abbr;
  }

  /** @private */
  __setTitle(title) {
    if (title) {
      this.setAttribute('title', title);
    } else {
      this.setAttribute('title', this.i18n.anonymous);
    }
  }

  /** @private */
  __onImageLoadError() {
    if (this.img) {
      console.warn(`<vaadin-avatar> The specified image could not be loaded: ${this.img}`);
      this.__imgFailedToLoad = true;
      this.__updateVisibility();
    }
  }
}

customElements.define(Avatar.is, Avatar);

export { Avatar };
