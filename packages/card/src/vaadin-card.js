/**
 * @license
 * Copyright (c) 2024 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { generateUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { cardStyles } from './styles/vaadin-card-base-styles.js';

/**
 * `<vaadin-card>` is a versatile container for grouping related content and actions.
 * It presents information in a structured and visually appealing manner, with
 * customization options to fit various design requirements. The default ARIA role is `region`.
 *
 * ```html
 * <vaadin-card role="region" theme="outlined cover-media">
 *   <img slot="media" width="200" src="..." alt="">
 *   <div slot="title">Lapland</div>
 *   <div slot="subtitle">The Exotic North</div>
 *   <div>Lapland is the northern-most region of Finland and an active outdoor destination.</div>
 *   <vaadin-button slot="footer">Book Vacation</vaadin-button>
 * </vaadin-card>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------|-------------
 * `media`   | The container for the media element (e.g., image, video, icon). Shown above of before the card content.
 * `header`  | The container for title and subtitle - or for custom header content - and header prefix and suffix elements.
 * `content` | The container for the card content (usually text content).
 * `footer`  | The container for footer elements. This part is always at the bottom of the card.
 *
 * The following custom properties are available for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|-------------
 * `--vaadin-card-padding` | The space between the card edge and its content. Needs to a unified value for all edges, i.e., a single length value. | `1em`
 * `--vaadin-card-gap`     | The space between content elements within the card. | `1em`
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
class Card extends ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement)))) {
  static get is() {
    return 'vaadin-card';
  }

  static get styles() {
    return cardStyles;
  }

  static get lumoInjector() {
    return { ...super.lumoInjector, includeBaseStyles: true };
  }

  static get properties() {
    return {
      /**
       * The title of the card. When set, any custom slotted title is removed and this string-based title is used instead. If this title is used, an `aria-labelledby` attribute that points to the generated title element is set.
       *
       * @attr {string} card-title
       */
      cardTitle: {
        type: String,
        observer: '__cardTitleChanged',
      },

      /**
       * Sets the heading level (`aria-level`) for the string-based title. If not set, the level defaults to 2. Setting values outside the range [1, 6] can cause accessibility issues.
       *
       * @attr {number} title-heading-level
       */
      titleHeadingLevel: {
        type: Number,
        reflectToAttribute: true,
        observer: '__titleHeadingLevelChanged',
      },
    };
  }

  /** @protected */
  ready() {
    super.ready();

    // By default, if the user hasn't provided a custom role,
    // the role attribute is set to "region".
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'region');
    }
  }

  /** @protected */
  render() {
    return html`
      <div part="media">
        <slot name="media"></slot>
      </div>
      <div part="header">
        <slot name="header-prefix"></slot>
        <slot name="header">
          <slot name="title"></slot>
          <slot name="subtitle"></slot>
        </slot>
        <slot name="header-suffix"></slot>
      </div>
      <div part="content">
        <slot></slot>
      </div>
      <div part="footer">
        <slot name="footer"></slot>
      </div>
    `;
  }

  /** @protected */
  firstUpdated() {
    super.firstUpdated();
    this._onSlotChange();
  }

  /** @private */
  _onSlotChange() {
    this.toggleAttribute('_m', this.querySelector(':scope > [slot="media"]'));
    this.toggleAttribute('_h', this.querySelector(':scope > [slot="header"]'));
    this.toggleAttribute(
      '_t',
      this.querySelector(':scope > [slot="title"]') && !this.querySelector(':scope > [slot="header"]'),
    );
    this.toggleAttribute(
      '_st',
      this.querySelector(':scope > [slot="subtitle"]') && !this.querySelector(':scope > [slot="header"]'),
    );
    this.toggleAttribute('_hp', this.querySelector(':scope > [slot="header-prefix"]'));
    this.toggleAttribute('_hs', this.querySelector(':scope > [slot="header-suffix"]'));
    this.toggleAttribute('_c', this.querySelector(':scope > :not([slot])'));
    this.toggleAttribute('_f', this.querySelector(':scope > [slot="footer"]'));
    if (this.__getCustomTitleElement()) {
      this.__clearStringTitle();
    }
  }

  /** @private */
  __clearStringTitle() {
    const stringTitleElement = this.__getStringTitleElement();
    if (stringTitleElement) {
      this.removeChild(stringTitleElement);
    }
    const ariaLabelledby = this.getAttribute('aria-labelledby');
    if (ariaLabelledby && ariaLabelledby.startsWith('card-title-')) {
      this.removeAttribute('aria-labelledby');
    }
    if (this.cardTitle) {
      this.cardTitle = '';
    }
  }

  /** @private */
  __getCustomTitleElement() {
    return Array.from(this.querySelectorAll('[slot="title"]')).find((el) => {
      return !el.hasAttribute('card-string-title');
    });
  }

  /** @private */
  __cardTitleChanged(title) {
    if (!title) {
      this.__clearStringTitle();
      return;
    }
    const customTitleElement = this.__getCustomTitleElement();
    if (customTitleElement) {
      this.removeChild(customTitleElement);
    }
    let stringTitleElement = this.__getStringTitleElement();
    if (!stringTitleElement) {
      stringTitleElement = this.__createStringTitleElement();
      this.appendChild(stringTitleElement);
      this.setAttribute('aria-labelledby', stringTitleElement.id);
    }
    stringTitleElement.textContent = title;
  }

  /** @private */
  __createStringTitleElement() {
    const stringTitleElement = document.createElement('div');
    stringTitleElement.setAttribute('slot', 'title');
    stringTitleElement.setAttribute('role', 'heading');
    this.__setTitleHeadingLevel(stringTitleElement, this.titleHeadingLevel);
    stringTitleElement.setAttribute('card-string-title', '');
    stringTitleElement.id = `card-title-${generateUniqueId()}`;
    return stringTitleElement;
  }

  /** @private */
  __titleHeadingLevelChanged(titleHeadingLevel) {
    const stringTitleElement = this.__getStringTitleElement();
    if (stringTitleElement) {
      this.__setTitleHeadingLevel(stringTitleElement, titleHeadingLevel);
    }
  }

  /** @private */
  __setTitleHeadingLevel(stringTitleElement, titleHeadingLevel) {
    stringTitleElement.setAttribute('aria-level', titleHeadingLevel || 2);
  }

  /** @private */
  __getStringTitleElement() {
    return this.querySelector('[slot="title"][card-string-title]');
  }

  /**
   * @protected
   * @override
   */
  createRenderRoot() {
    const root = super.createRenderRoot();
    root.addEventListener('slotchange', () => this._onSlotChange());
    return root;
  }
}

defineCustomElement(Card);

export { Card };
