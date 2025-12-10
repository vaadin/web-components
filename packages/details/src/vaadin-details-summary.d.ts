/**
 * @license
 * Copyright (c) 2019 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ButtonMixin } from '@vaadin/button/src/vaadin-button-mixin.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * The details summary element.
 *
 * ### Styling
 *
 * The following shadow DOM parts are exposed for styling:
 *
 * Part name  | Description
 * -----------|-------------------
 * `toggle`   | The icon element
 * `content`  | The content wrapper
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description
 * -------------| -----------
 * `active`     | Set when the element is pressed down, either with mouse, touch or the keyboard.
 * `opened`     | Set when the element is expanded and related collapsible content is visible.
 * `disabled`   | Set when the element is disabled.
 * `focus-ring` | Set when the element is focused using the keyboard.
 * `focused`    | Set when the element is focused.
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                        |
 * :------------------------------------------|
 * | `--vaadin-details-summary-background`    |
 * | `--vaadin-details-summary-border-color`  |
 * | `--vaadin-details-summary-border-radius` |
 * | `--vaadin-details-summary-border-width`  |
 * | `--vaadin-details-summary-font-size`     |
 * | `--vaadin-details-summary-font-weight`   |
 * | `--vaadin-details-summary-gap`           |
 * | `--vaadin-details-summary-height`        |
 * | `--vaadin-details-summary-padding`       |
 * | `--vaadin-details-summary-text-color`    |
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 */
declare class DetailsSummary extends ButtonMixin(DirMixin(ThemableMixin(HTMLElement))) {
  /**
   * When true, the element is opened.
   */
  opened: boolean;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-details-summary': DetailsSummary;
  }
}

export { DetailsSummary };
