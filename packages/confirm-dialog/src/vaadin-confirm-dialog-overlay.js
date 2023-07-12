/**
 * @license
 * Copyright (c) 2018 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { Dialog } from '@vaadin/dialog/src/vaadin-dialog.js';
import { dialogOverlay } from '@vaadin/dialog/src/vaadin-dialog-styles.js';
import { OverlayMixin } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';
import { overlayStyles } from '@vaadin/overlay/src/vaadin-overlay-styles.js';
import { css, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const confirmDialogOverlay = css`
  :host {
    --_vaadin-confirm-dialog-content-width: auto;
    --_vaadin-confirm-dialog-content-height: auto;
  }

  [part='overlay'] {
    width: var(--_vaadin-confirm-dialog-content-width);
    height: var(--_vaadin-confirm-dialog-content-height);
  }

  /* Make buttons clickable */
  [part='footer'] > * {
    pointer-events: all;
  }
`;

/**
 * An element used internally by `<vaadin-confirm-dialog>`. Not intended to be used separately.
 *
 * @extends HTMLElement
 * @mixes DirMixin
 * @mixes OverlayMixin
 * @mixes ThemableMixin
 * @private
 */
class ConfirmDialogOverlay extends OverlayMixin(DirMixin(ThemableMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-confirm-dialog-overlay';
  }

  static get styles() {
    return [overlayStyles, dialogOverlay, confirmDialogOverlay];
  }

  /** @protected */
  render() {
    return html`
      <div part="backdrop" id="backdrop" ?hidden="${!this.withBackdrop}"></div>
      <div part="overlay" id="overlay" tabindex="0">
        <section id="resizerContainer" class="resizer-container">
          <header part="header"><slot name="header"></slot></header>
          <div part="content" id="content">
            <div part="message"><slot></slot></div>
          </div>
          <footer part="footer" role="toolbar">
            <div part="cancel-button">
              <slot name="cancel-button"></slot>
            </div>
            <div part="reject-button">
              <slot name="reject-button"></slot>
            </div>
            <div part="confirm-button">
              <slot name="confirm-button"></slot>
            </div>
          </footer>
        </section>
      </div>
    `;
  }

  /**
   * @protected
   * @override
   */
  ready() {
    super.ready();

    // ConfirmDialog has header and footer but does not use renderers
    this.setAttribute('has-header', '');
    this.setAttribute('has-footer', '');
  }
}

customElements.define(ConfirmDialogOverlay.is, ConfirmDialogOverlay);

/**
 * An extension of `<vaadin-dialog>` used internally by `<vaadin-confirm-dialog>`.
 * Not intended to be used separately.
 * @private
 */
class ConfirmDialogDialog extends Dialog {
  static get is() {
    return 'vaadin-confirm-dialog-dialog';
  }

  static get properties() {
    return {
      /**
       * Height to be set on the overlay content.
       */
      contentHeight: {
        type: String,
      },

      /**
       * Width to be set on the overlay content.
       */
      contentWidth: {
        type: String,
      },

      /** @private */
      _overlayElement: {
        type: Object,
      },
    };
  }

  static get observers() {
    return [
      '__updateContentHeight(contentHeight, _overlayElement)',
      '__updateContentWidth(contentWidth, _overlayElement)',
    ];
  }

  /** @protected */
  render() {
    return html`
      <vaadin-confirm-dialog-overlay
        id="overlay"
        .owner="${this}"
        .opened="${this.opened}"
        @opened-changed="${this._onOverlayOpened}"
        @mousedown="${this._bringOverlayToFront}"
        @touchstart="${this._bringOverlayToFront}"
        theme="${ifDefined(this._theme)}"
        .modeless="${this.modeless}"
        .withBackdrop="${!this.modeless}"
        ?resizable="${this.resizable}"
        restore-focus-on-close
        focus-trap
      ></vaadin-confirm-dialog-overlay>
    `;
  }

  /** @protected */
  ready() {
    super.ready();

    this._overlayElement = this.$.overlay;
  }

  /** @private */
  __updateDimension(overlay, dimension, value) {
    const prop = `--_vaadin-confirm-dialog-content-${dimension}`;

    if (value) {
      overlay.style.setProperty(prop, value);
    } else {
      overlay.style.removeProperty(prop);
    }
  }

  /** @private */
  __updateContentHeight(height, overlay) {
    if (overlay) {
      this.__updateDimension(overlay, 'height', height);
    }
  }

  /** @private */
  __updateContentWidth(width, overlay) {
    if (overlay) {
      this.__updateDimension(overlay, 'width', width);
    }
  }
}

customElements.define(ConfirmDialogDialog.is, ConfirmDialogDialog);
