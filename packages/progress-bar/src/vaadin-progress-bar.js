/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { CSSInjectionMixin } from '@vaadin/vaadin-themable-mixin/css-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { progressBarStyles } from './styles/vaadin-progress-bar-core-styles.js';
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
 * Part name | Description
 * ----------------|----------------
 * `bar` | Progress-bar's background
 * `value` | Progress-bar's foreground
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
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
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ProgressMixin
 * @mixes ThemableMixin
 * @mixes ElementMixin
 */
class ProgressBar extends ProgressMixin(ElementMixin(ThemableMixin(CSSInjectionMixin(PolylitMixin(LitElement))))) {
  static get is() {
    return 'vaadin-progress-bar';
  }

  static get styles() {
    return progressBarStyles;
  }

  /** @protected */
  render() {
    return html`
      <div part="bar">
        <div part="value"></div>
      </div>
    `;
  }
}

defineCustomElement(ProgressBar);

export { ProgressBar };
