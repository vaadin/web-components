/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-badge>` is a Web Component for displaying badges.
 *
 * ```html
 * <vaadin-badge>New</vaadin-badge>
 * ```
 *
 * ### Slots
 *
 * Name     | Description
 * ---------|-------------
 * (none)   | Default slot for the badge text content
 * `prefix` | Slot for an element to place before the text, e.g. an icon
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name  | Description
 * -----------|-------------
 * `prefix`   | The container for the prefix slot
 * `number`   | The container for the number value
 * `content`  | The container for the default slot
 *
 * The following state attributes are available for styling:
 *
 * Attribute      | Description
 * ---------------|-------------
 * `has-prefix`   | Set when the badge has content in the prefix slot
 * `has-content`  | Set when the badge has content in the default slot
 * `has-number`   | Set when the badge has a number value
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property              |
 * :--------------------------------|
 * `--vaadin-badge-background`      |
 * `--vaadin-badge-border-radius`   |
 * `--vaadin-badge-font-size`       |
 * `--vaadin-badge-font-weight`     |
 * `--vaadin-badge-font-family`     |
 * `--vaadin-badge-gap`             |
 * `--vaadin-badge-line-height`     |
 * `--vaadin-badge-min-width`       |
 * `--vaadin-badge-padding`         |
 * `--vaadin-badge-text-color`      |
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 */
declare class Badge extends ElementMixin(ThemableMixin(HTMLElement)) {
  /**
   * The number to display in the badge.
   */
  number: number | null | undefined;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-badge': Badge;
  }
}

export { Badge };
