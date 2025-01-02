/**
 * @license
 * Copyright (c) 2015 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-lit-combo-box-item.js';
import './vaadin-lit-combo-box-overlay.js';
import './vaadin-lit-combo-box-scroller.js';
import { css, html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ComboBoxLightMixin } from './vaadin-combo-box-light-mixin.js';

/**
 * LitElement based version of `<vaadin-combo-box-light>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
class ComboBoxLight extends ComboBoxLightMixin(ThemableMixin(PolylitMixin(LitElement))) {
  static get is() {
    return 'vaadin-combo-box-light';
  }

  static get styles() {
    return css`
      :host([opened]) {
        pointer-events: auto;
      }
    `;
  }

  /** @protected */
  render() {
    return html`
      <slot></slot>

      <vaadin-combo-box-overlay
        id="overlay"
        .opened="${this._overlayOpened}"
        ?loading="${this.loading}"
        theme="${ifDefined(this._theme)}"
        .positionTarget="${this.inputElement}"
        no-vertical-overlap
      ></vaadin-combo-box-overlay>
    `;
  }
}

defineCustomElement(ComboBoxLight);

export { ComboBoxLight };
