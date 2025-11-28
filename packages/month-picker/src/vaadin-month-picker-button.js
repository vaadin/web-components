/**
 * @license
 * Copyright (c) 2025 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { ButtonMixin } from '@vaadin/button/src/vaadin-button-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { monthPickerButtonStyles } from './styles/vaadin-month-picker-button-base-styles.js';

/**
 * An element used internally by `<vaadin-month-picker>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes DirMixin
 * @mixes ButtonMixin
 * @mixes OverlayMixin
 * @mixes PositionMixin
 * @mixes ThemableMixin
 * @private
 */
class MonthPickerButton extends ButtonMixin(DirMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))))) {
  static get is() {
    return 'vaadin-month-picker-button';
  }

  static get styles() {
    return monthPickerButtonStyles;
  }

  /** @protected */
  render() {
    return html`<span part="icon"></span>`;
  }
}

defineCustomElement(MonthPickerButton);

export { MonthPickerButton };
