/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { FormItemMixin } from './vaadin-form-item-mixin.js';
import { formItemStyles } from './vaadin-form-layout-styles.js';

/**
 * LitElement based version of `<vaadin-form-item>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
class FormItem extends FormItemMixin(ThemableMixin(PolylitMixin(LitElement))) {
  static get is() {
    return 'vaadin-form-item';
  }

  static get styles() {
    return formItemStyles;
  }

  /** @protected */
  render() {
    return html`
      <div id="label" part="label" @click="${this.__onLabelClick}">
        <slot name="label" id="labelSlot" @slotchange="${this.__onLabelSlotChange}"></slot>
        <span part="required-indicator" aria-hidden="true"></span>
      </div>
      <div id="spacing"></div>
      <div id="content">
        <slot id="contentSlot" @slotchange="${this.__onContentSlotChange}"></slot>
      </div>
    `;
  }
}

defineCustomElement(FormItem);

export { FormItem };
