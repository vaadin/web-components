import { ProgressMixin } from './vaadin-progress-mixin.js';

import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';

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
 * Part name | Description
 * ----------------|----------------
 * `bar` | Progress-bar's background
 * `value` | Progress-bar's foreground
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * The following custom properties are available:
 *
 * Custom property | Description | Default
 * ----------------|-------------|-------------
 * `--vaadin-progress-value` | current progress value (between 0 and 1) | 0
 *
 * The following state attributes are available for styling:
 *
 * Attribute       | Description | Part name
 * ----------------|-------------|------------
 * `indeterminate` | Set to an indeterminate progress bar | :host
 */
declare class ProgressBarElement extends ProgressMixin(ThemableMixin(ElementMixin(HTMLElement))) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-progress-bar': ProgressBarElement;
  }
}

export { ProgressBarElement };
