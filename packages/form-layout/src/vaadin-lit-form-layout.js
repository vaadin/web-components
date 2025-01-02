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
import { FormLayoutMixin } from './vaadin-form-layout-mixin.js';
import { formLayoutStyles } from './vaadin-form-layout-styles.js';

/**
 * LitElement based version of `<vaadin-form-layout>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
class FormLayout extends FormLayoutMixin(ThemableMixin(ElementMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-form-layout';
  }

  static get styles() {
    return formLayoutStyles;
  }

  /** @protected */
  render() {
    return html`
      <div id="layout">
        <slot id="slot"></slot>
      </div>
    `;
  }
}

defineCustomElement(FormLayout);

export { FormLayout };
