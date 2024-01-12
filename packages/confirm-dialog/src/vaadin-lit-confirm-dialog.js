/**
 * @license
 * Copyright (c) 2018 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/button/src/vaadin-lit-button.js';
import './vaadin-lit-confirm-dialog-overlay.js';
import { css, html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';
import { ConfirmDialogMixin } from './vaadin-confirm-dialog-mixin.js';

/**
 * LitElement based version of `<vaadin-confirm-dialog>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 *
 * @extends HTMLElement
 * @mixes ConfirmDialogMixin
 * @mixes ElementMixin
 * @mixes ThemePropertyMixin
 */
class ConfirmDialog extends ConfirmDialogMixin(ElementMixin(ThemePropertyMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-confirm-dialog';
  }

  static get styles() {
    return css`
      :host,
      [hidden] {
        display: none !important;
      }
    `;
  }

  /** @protected */
  render() {
    return html`
      <vaadin-confirm-dialog-dialog
        id="dialog"
        .opened="${this.opened}"
        .overlayClass="${this.overlayClass}"
        aria-label="${this.header || 'confirmation'}"
        theme="${ifDefined(this._theme)}"
        no-close-on-outside-click
        .noCloseOnEsc="${this.noCloseOnEsc}"
        .contentHeight="${this._contentHeight}"
        .contentWidth="${this._contentWidth}"
        @opened-changed="${this._onOpenedChanged}"
      ></vaadin-confirm-dialog-dialog>

      <div hidden>
        <slot name="header"></slot>
        <slot></slot>
        <slot name="cancel-button"></slot>
        <slot name="reject-button"></slot>
        <slot name="confirm-button"></slot>
      </div>
    `;
  }

  /** @protected */
  async ready() {
    super.ready();

    await this.$.dialog.updateComplete;

    this._overlayElement = this.$.dialog.$.overlay;

    this._initOverlay(this._overlayElement);
  }

  /** @private */
  _onOpenedChanged(event) {
    this.opened = event.detail.value;
  }
}

defineCustomElement(ConfirmDialog);

export { ConfirmDialog };
