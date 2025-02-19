/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { formRowStyles } from './vaadin-form-layout-styles.js';

/**
 * LitElement based version of `<vaadin-form-row>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
class FormRow extends ThemableMixin(PolylitMixin(LitElement)) {
  static get is() {
    return 'vaadin-form-row';
  }

  static get styles() {
    return formRowStyles;
  }

  /** @protected */
  render() {
    return html`<slot></slot>`;
  }
}

defineCustomElement(FormRow);

export { FormRow };
