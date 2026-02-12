/**
 * @license
 * Copyright (c) 2017 - 2026 Vaadin Ltd.
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
 * ### Styling
 *
 * The following state attributes are available for styling:
 *
 * Attribute | Description
 * ----------|-------------
 * `empty`   | Set when the badge has no text content or child elements
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
 * `--vaadin-badge-line-height`     |
 * `--vaadin-badge-min-width`       |
 * `--vaadin-badge-padding`         |
 * `--vaadin-badge-text-color`      |
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 */
declare class Badge extends ElementMixin(ThemableMixin(HTMLElement)) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-badge': Badge;
  }
}

export { Badge };
