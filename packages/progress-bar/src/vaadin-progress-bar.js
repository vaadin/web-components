/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
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
 *
 * @extends HTMLElement
 * @mixes ProgressMixin
 * @mixes ThemableMixin
 * @mixes ElementMixin
 */
class ProgressBar extends ElementMixin(ThemableMixin(ProgressMixin(PolymerElement))) {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          width: 100%; /* prevent collapsing inside non-stretching column flex */
          height: 8px;
        }

        :host([hidden]) {
          display: none !important;
        }

        [part='bar'] {
          height: 100%;
        }

        [part='value'] {
          height: 100%;
          transform-origin: 0 50%;
          transform: scaleX(var(--vaadin-progress-value));
        }

        /* RTL specific styles */

        :host([dir='rtl']) [part='value'] {
          transform-origin: 100% 50%;
        }
      </style>

      <div part="bar">
        <div part="value"></div>
      </div>
    `;
  }

  static get is() {
    return 'vaadin-progress-bar';
  }
}

customElements.define(ProgressBar.is, ProgressBar);

export { ProgressBar };
