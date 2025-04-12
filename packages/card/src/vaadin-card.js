/**
 * @license
 * Copyright (c) 2024 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { generateUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

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
class Card extends ElementMixin(ThemableMixin(PolylitMixin(LitElement))) {
  static get is() {
    return 'vaadin-card';
  }

  static get styles() {
    return css`
      :host {
        --_padding: var(--vaadin-card-padding, 1em);
        --_gap: var(--vaadin-card-gap, 1em);
        --_media: 0;
        --_title: 0;
        --_subtitle: 0;
        --_header: max(var(--_header-prefix), var(--_title), var(--_subtitle), var(--_header-suffix));
        --_header-prefix: 0;
        --_header-suffix: 0;
        --_content: 0;
        --_footer: 0;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: var(--_gap);
        padding: var(--_padding);
      }

      :host([hidden]) {
        display: none !important;
      }

      :host(:not([theme~='horizontal'])) {
        justify-content: space-between;
      }

      :host([_m]) {
        --_media: 1;
      }

      :host([_t]) {
        --_title: 1;
      }

      :host([_st]) {
        --_subtitle: 1;
      }

      :host([_h]) {
        --_header: 1;
        --_title: 0;
        --_subtitle: 0;
      }

      :host([_hp]) {
        --_header-prefix: 1;
      }

      :host([_hs]) {
        --_header-suffix: 1;
      }

      :host([_c]) {
        --_content: 1;
      }

      :host([_f]) {
        --_footer: 1;
      }

      [part='media'],
      [part='header'],
      [part='content'],
      [part='footer'] {
        display: none;
      }

      :host([_m]) [part='media'],
      :host([_c]) [part='content'] {
        display: block;
      }

      :host([_f]) [part='footer'] {
        display: flex;
        gap: var(--_gap);
      }

      :host(:is([_h], [_t], [_st], [_hp], [_hs])) [part='header'] {
        align-items: center;
        display: grid;
        gap: var(--_gap);
        row-gap: 0;
      }

      [part='header'] {
        margin-bottom: auto;
      }

      :host([_hs]) [part='header'] {
        grid-template-columns: 1fr auto;
      }

      :host([_hp]) [part='header'] {
        grid-template-columns: repeat(var(--_header-prefix), auto) 1fr;
      }

      slot {
        border-radius: inherit;
      }

      ::slotted([slot='header-prefix']) {
        grid-column: 1;
        grid-row: 1 / span calc(var(--_title) + var(--_subtitle));
      }

      ::slotted([slot='header']),
      ::slotted([slot='title']) {
        grid-column: calc(1 + var(--_header-prefix));
        grid-row: 1;
      }

      ::slotted([slot='subtitle']) {
        grid-column: calc(1 + var(--_header-prefix));
        grid-row: calc(1 + var(--_title));
      }

      ::slotted([slot='header-suffix']) {
        grid-column: calc(2 + var(--_header-prefix));
        grid-row: 1 / span calc(var(--_title) + var(--_subtitle));
      }

      /* Horizontal */
      :host([theme~='horizontal']) {
        align-items: start;
        display: grid;
        grid-template-columns: repeat(var(--_media), minmax(auto, max-content)) 1fr;
      }

      :host([theme~='horizontal'][_f]) {
        grid-template-rows: 1fr auto;
      }

      :host([theme~='horizontal'][_c]) {
        grid-template-rows: repeat(var(--_header), auto) 1fr;
      }

      [part='media'] {
        align-self: stretch;
        border-radius: inherit;
        grid-column: 1;
        grid-row: 1 / span calc(var(--_header) + var(--_content) + var(--_footer));
      }

      [part='header'] {
        grid-column: calc(1 + var(--_media));
        grid-row: 1;
      }

      [part='content'] {
        flex: auto;
        grid-column: calc(1 + var(--_media));
        grid-row: calc(1 + var(--_header));
        min-height: 0;
      }

      [part='footer'] {
        border-radius: inherit;
        grid-column: calc(1 + var(--_media));
        grid-row: calc(1 + var(--_header) + var(--_content));
      }

      :host([theme~='horizontal']) [part='footer'] {
        align-self: end;
      }

      :host(:not([theme~='horizontal'])) ::slotted([slot='media']:is(img, video, svg)) {
        max-width: 100%;
      }

      ::slotted([slot='media']) {
        vertical-align: middle;
      }

      :host(:is([theme~='cover-media'], [theme~='stretch-media']))
        ::slotted([slot='media']:is(img, video, svg, vaadin-icon)) {
        aspect-ratio: var(--vaadin-card-media-aspect-ratio, 16/9);
        height: auto;
        object-fit: cover;
        /* Fixes an issue where an icon overflows the card boundaries on Firefox: https://github.com/vaadin/web-components/issues/8641 */
        overflow: hidden;
        width: 100%;
      }

      :host([theme~='horizontal']:is([theme~='cover-media'], [theme~='stretch-media'])) {
        grid-template-columns: repeat(var(--_media), minmax(auto, 0.5fr)) 1fr;
      }

      :host([theme~='horizontal']:is([theme~='cover-media'], [theme~='stretch-media']))
        ::slotted([slot='media']:is(img, video, svg, vaadin-icon)) {
        aspect-ratio: auto;
        height: 100%;
      }

      :host([theme~='cover-media']) ::slotted([slot='media']:is(img, video, svg, vaadin-icon)) {
        border-end-end-radius: 0;
        border-end-start-radius: 0;
        border-radius: inherit;
        margin-inline: calc(var(--_padding) * -1);
        margin-top: calc(var(--_padding) * -1);
        max-width: none;
        width: calc(100% + var(--_padding) * 2);
      }

      :host([theme~='horizontal'][theme~='cover-media']) ::slotted([slot='media']:is(img, video, svg, vaadin-icon)) {
        border-end-end-radius: 0;
        border-radius: inherit;
        border-start-end-radius: 0;
        height: calc(100% + var(--_padding) * 2);
        margin-inline-end: 0;
        width: calc(100% + var(--_padding));
      }

      /* Scroller in content */
      [part='content'] ::slotted(vaadin-scroller) {
        margin-inline: calc(var(--_padding) * -1);
        padding-inline: var(--_padding);
      }

      [part='content'] ::slotted(vaadin-scroller)::before,
      [part='content'] ::slotted(vaadin-scroller)::after {
        margin-inline: calc(var(--_padding) * -1);
      }
    `;
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

  static get experimental() {
    return true;
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
