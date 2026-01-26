/**
 * @license
 * Copyright (c) 2017 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { BadgeMixin } from './vaadin-badge-mixin.js';

/**
 * `<vaadin-badge>` is a Web Component for displaying badges.
 *
 * ```html
 * <vaadin-badge>New</vaadin-badge>
 * ```
 *
 * ### Styling
 *
 * The following custom properties are available for styling:
 *
 * Custom property                  | Description                             | Default
 * ---------------------------------|-----------------------------------------|--------
 * `--vaadin-badge-background`      | Background color                        | `var(--vaadin-background-container-subtle)`
 * `--vaadin-badge-text-color`      | Text color                              | `var(--vaadin-text-color)`
 * `--vaadin-badge-border-radius`   | Border radius                           | `0.25em`
 * `--vaadin-badge-font-size`       | Font size                               | `var(--vaadin-font-size-s)`
 * `--vaadin-badge-font-weight`     | Font weight                             | `500`
 * `--vaadin-badge-font-family`     | Font family                             | `inherit`
 * `--vaadin-badge-padding`         | Padding                                 | `0.4em calc(0.5em + var(--vaadin-badge-border-radius) / 4)`
 * `--vaadin-badge-min-width`       | Minimum width                           | `calc(1lh + 0.45em)`
 * `--vaadin-badge-line-height`     | Line height                             | `1`
 *
 * The following state attributes are available for styling:
 *
 * Attribute | Description
 * ----------|-------------
 * `empty`   | Set when the badge has no text content (dot indicator)
 *
 * ### Theme Variants
 *
 * The component supports the following theme variants:
 *
 * Variant      | Description
 * -------------|-------------
 * `primary`    | Primary color variant
 * `success`    | Success color variant
 * `error`      | Error color variant
 * `warning`    | Warning color variant
 * `contrast`   | Contrast color variant
 * `small`      | Smaller size variant
 * `pill`       | Pill-shaped variant with rounded ends
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 */
declare class Badge extends BadgeMixin(ElementMixin(ThemableMixin(HTMLElement))) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-badge': Badge;
  }
}

export { Badge };
