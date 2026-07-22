/**
 * @license
 * Copyright (c) 2024 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { isEmptyTextNode } from '@vaadin/component-base/src/dom-utils.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { cardStyles } from './styles/vaadin-card-base-styles.js';
import { TitleController } from './title-controller.js';

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
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                    |
 * :--------------------------------------|
 * | `--vaadin-card-background`           |
 * | `--vaadin-card-border-color`         |
 * | `--vaadin-card-border-radius`        |
 * | `--vaadin-card-border-width`         |
 * | `--vaadin-card-gap`                  |
 * | `--vaadin-card-media-aspect-ratio`   |
 * | `--vaadin-card-padding`              |
 * | `--vaadin-card-shadow`               |
 * | `--vaadin-card-subtitle-color`       |
 * | `--vaadin-card-subtitle-font-size`   |
 * | `--vaadin-card-subtitle-line-height` |
 * | `--vaadin-card-title-color`          |
 * | `--vaadin-card-title-font-size`      |
 * | `--vaadin-card-title-font-weight`    |
 * | `--vaadin-card-title-line-height`    |
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement vaadin-card
 * @extends HTMLElement
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
      },

      /**
       * Sets the heading level (`aria-level`) for the string-based title. If not set, the level defaults to 2. Setting values outside the range [1, 6] can cause accessibility issues.
       *
       * @attr {number} title-heading-level
       */
      titleHeadingLevel: {
        type: Number,
        reflectToAttribute: true,
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

    this.__titleController = new TitleController(this);
    this.addController(this.__titleController);

    this._onSlotChange();
  }

  /** @protected */
  updated(props) {
    super.updated(props);

    if (props.has('cardTitle')) {
      this.__titleController.setTitle(this.cardTitle);
    }

    if (props.has('titleHeadingLevel')) {
      this.__titleController.setLevel(this.titleHeadingLevel);
    }
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
    this.toggleAttribute('_c', this.__hasContent());
    this.toggleAttribute('_f', this.querySelector(':scope > [slot="footer"]'));
  }

  /** @private */
  __hasContent() {
    const slot = this.shadowRoot.querySelector('slot:not([name])');
    return slot.assignedNodes({ flatten: true }).filter((node) => !isEmptyTextNode(node)).length > 0;
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
