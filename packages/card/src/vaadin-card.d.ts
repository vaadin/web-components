/**
 * @license
 * Copyright (c) 2024 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
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
 */
declare class Card extends ElementMixin(ThemableMixin(HTMLElement)) {
  /**
   * The title of the card. When set, any custom slotted title is removed and this string-based title is used instead. If this title is used, an `aria-labelledby` attribute that points to the generated title element is set.
   * @attr {string} card-title
   */
  cardTitle: string;

  /**
   * Sets the heading level (`aria-level`) for the string-based title. If not set, the level defaults to 2. Setting values outside the range [1, 6] can cause accessibility issues.
   * @attr {number} title-heading-level
   */
  titleHeadingLevel: number | null | undefined;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-card': Card;
  }
}

export { Card };
