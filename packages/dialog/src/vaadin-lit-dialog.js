/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-lit-dialog-overlay.js';
import { css, html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { OverlayClassMixin } from '@vaadin/component-base/src/overlay-class-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';
import { DialogBaseMixin } from './vaadin-dialog-base-mixin.js';
import { DialogDraggableMixin } from './vaadin-dialog-draggable-mixin.js';
import { DialogRendererMixin } from './vaadin-dialog-renderer-mixin.js';
import { DialogResizableMixin } from './vaadin-dialog-resizable-mixin.js';

export { DialogOverlay } from './vaadin-lit-dialog-overlay.js';

/**
 * LitElement based version of `<vaadin-dialog>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 *
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes DialogBaseMixin
 * @mixes DialogDraggableMixin
 * @mixes DialogRendererMixin
 * @mixes DialogResizableMixin
 * @mixes OverlayClassMixin
 * @mixes ThemePropertyMixin
 */
class Dialog extends DialogDraggableMixin(
  DialogResizableMixin(
    DialogRendererMixin(DialogBaseMixin(OverlayClassMixin(ThemePropertyMixin(ElementMixin(PolylitMixin(LitElement)))))),
  ),
) {
  static get is() {
    return 'vaadin-dialog';
  }

  static get styles() {
    return css`
      :host {
        display: none !important;
      }
    `;
  }

  static get properties() {
    return {
      /**
       * Set the `aria-label` attribute for assistive technologies like
       * screen readers. An empty string value for this property (the
       * default) means that the `aria-label` attribute is not present.
       */
      ariaLabel: {
        type: String,
        value: '',
      },
    };
  }

  /** @protected */
  render() {
    return html`
      <vaadin-dialog-overlay
        id="overlay"
        role="${this.overlayRole}"
        .owner="${this}"
        .opened="${this.opened}"
        .headerTitle="${this.headerTitle}"
        .renderer="${this.renderer}"
        .headerRenderer="${this.headerRenderer}"
        .footerRenderer="${this.footerRenderer}"
        @opened-changed="${this._onOverlayOpened}"
        @mousedown="${this._bringOverlayToFront}"
        @touchstart="${this._bringOverlayToFront}"
        theme="${ifDefined(this._theme)}"
        aria-label="${ifDefined(this.ariaLabel || this.headerTitle)}"
        .modeless="${this.modeless}"
        .withBackdrop="${!this.modeless}"
        ?resizable="${this.resizable}"
        restore-focus-on-close
        focus-trap
      ></vaadin-dialog-overlay>
    `;
  }
}

defineCustomElement(Dialog);

export { Dialog };
