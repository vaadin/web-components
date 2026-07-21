/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import './vaadin-crud-dialog-overlay.js';
import { css, html, LitElement, unsafeCSS } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { DialogBaseMixin } from '@vaadin/dialog/src/vaadin-dialog-base-mixin.js';
import { overlayAnimationProperties } from '@vaadin/overlay/src/styles/vaadin-overlay-base-styles.js';
import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';

/**
 * An element used internally by `<vaadin-crud>`. Not intended to be used separately.
 * @private
 */
class CrudDialog extends DialogBaseMixin(ThemePropertyMixin(PolylitMixin(LitElement))) {
  static get is() {
    return 'vaadin-crud-dialog';
  }

  static get styles() {
    return css`
      :host {
        /*
        The overlay animation properties need to be explicitly inherited from the vaadin-crud
        element to the internal vaadin-crud-dialog element, from where they get explicitly
        inherited by the internal vaadin-crud-dialog-overlay element.
        */
        ${unsafeCSS(overlayAnimationProperties)}
      }

      :host([opened]),
      :host([opening]),
      :host([closing]) {
        display: block !important;
        position: fixed;
      }

      :host:not([opening], [closing]),
      :host([hidden]) {
        display: none !important;
      }

      :host(:focus-visible) ::part(overlay) {
        outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
      }
    `;
  }

  static get properties() {
    return {
      fullscreen: {
        type: Boolean,
      },

      crudElement: {
        type: Object,
      },
    };
  }

  /** @protected */
  render() {
    return html`
      <vaadin-crud-dialog-overlay
        id="overlay"
        .owner="${this.crudElement}"
        .opened="${this.opened}"
        @opened-changed="${this._onOverlayOpened}"
        @mousedown="${this._bringOverlayToFront}"
        @touchstart="${this._bringOverlayToFront}"
        @vaadin-overlay-outside-click="${this.__cancel}"
        @vaadin-overlay-escape-press="${this.__cancel}"
        theme="${ifDefined(this._theme)}"
        .modeless="${this.modeless}"
        .withBackdrop="${!this.modeless}"
        ?fullscreen="${this.fullscreen}"
        focus-trap
        exportparts="backdrop, overlay, header, content, footer"
      >
        <slot name="header" slot="header"></slot>
        <slot name="form" slot="form"></slot>
        <slot name="save-button" slot="save-button"></slot>
        <slot name="cancel-button" slot="cancel-button"></slot>
        <slot name="delete-button" slot="delete-button"></slot>
      </vaadin-crud-dialog-overlay>
    `;
  }

  /** @private **/
  __cancel() {
    this.dispatchEvent(new CustomEvent('cancel'));
  }
}

defineCustomElement(CrudDialog);
