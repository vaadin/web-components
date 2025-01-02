/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { progressBarStyles } from './vaadin-progress-bar-styles.js';
import { ProgressMixin } from './vaadin-progress-mixin.js';

/**
 * LitElement based version of `<vaadin-progress-bar>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
class ProgressBar extends ProgressMixin(ElementMixin(ThemableMixin(PolylitMixin(LitElement)))) {
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
