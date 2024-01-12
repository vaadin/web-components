/**
 * @license
 * Copyright (c) 2019 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, html, LitElement } from 'lit';
import { ButtonMixin } from '@vaadin/button/src/vaadin-button-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * LitElement based version of `<vaadin-details-summary>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
class DetailsSummary extends ButtonMixin(DirMixin(ThemableMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-details-summary';
  }

  static get styles() {
    return css`
      :host {
        display: block;
        outline: none;
        white-space: nowrap;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
      }

      :host([hidden]) {
        display: none !important;
      }

      :host([disabled]) {
        pointer-events: none;
      }
    `;
  }

  static get properties() {
    return {
      /**
       * When true, the element is opened.
       */
      opened: {
        type: Boolean,
        reflectToAttribute: true,
      },
    };
  }

  /** @protected */
  render() {
    return html`
      <span part="toggle" aria-hidden="true"></span>
      <div part="content"><slot></slot></div>
    `;
  }
}

defineCustomElement(DetailsSummary);

export { DetailsSummary };
