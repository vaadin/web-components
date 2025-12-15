/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ProgressMixin } from './vaadin-progress-mixin.js';

/**
 * `<vaadin-progress-bar>` is a Web Component for progress bars.
 *
 * ```html
 * <vaadin-progress-bar min="0" max="1" value="0.5">
 * </vaadin-progress-bar>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name  | Description
 * -----------|----------------
 * `bar`      | Progress-bar's background
 * `value`    | Progress-bar's foreground
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                          |
 * :--------------------------------------------|
 * | `--vaadin-progress-bar-animation-duration` |
 * | `--vaadin-progress-bar-background`         |
 * | `--vaadin-progress-bar-border-color`       |
 * | `--vaadin-progress-bar-border-radius`      |
 * | `--vaadin-progress-bar-border-width`       |
 * | `--vaadin-progress-bar-height`             |
 * | `--vaadin-progress-bar-padding`            |
 * | `--vaadin-progress-bar-value-background`   |
 * | `--vaadin-progress-value`                  |
 *
 * The following state attributes are available for styling:
 *
 * Attribute       | Description
 * ----------------|-------------------------------------
 * `indeterminate` | Set to an indeterminate progress bar
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 */
declare class ProgressBar extends ProgressMixin(ThemableMixin(ElementMixin(HTMLElement))) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-progress-bar': ProgressBar;
  }
}

export { ProgressBar };
