/**
 * @license
 * Copyright (c) 2018 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { Dialog } from '@vaadin/dialog/src/vaadin-dialog.js';
import { DialogOverlay } from '@vaadin/dialog/src/vaadin-dialog-overlay.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-confirm-dialog-overlay',
  css`
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
  `,
  { moduleId: 'vaadin-confirm-dialog-overlay-styles' },
);

let memoizedTemplate;

const footerTemplate = html`
  <div part="cancel-button">
    <slot name="cancel-button"></slot>
  </div>
  <div part="reject-button">
    <slot name="reject-button"></slot>
  </div>
  <div part="confirm-button">
    <slot name="confirm-button"></slot>
  </div>
`;

/**
 * An extension of `<vaadin-dialog-overlay>` used internally by `<vaadin-confirm-dialog>`.
 * Not intended to be used separately.
 * @private
 */
class ConfirmDialogOverlay extends DialogOverlay {
  static get is() {
    return 'vaadin-confirm-dialog-overlay';
  }

  static get template() {
    if (!memoizedTemplate) {
      memoizedTemplate = super.template.cloneNode(true);

      // Replace two header slots with a single one
      const headerPart = memoizedTemplate.content.querySelector('[part="header"]');
      headerPart.innerHTML = '';
      const headerSlot = document.createElement('slot');
      headerSlot.setAttribute('name', 'header');
      headerPart.appendChild(headerSlot);

      // Place default slot inside a "message" part
      const contentPart = memoizedTemplate.content.querySelector('[part="content"]');
      const defaultSlot = contentPart.querySelector('slot:not([name])');
      const messagePart = document.createElement('div');
      messagePart.setAttribute('part', 'message');
      contentPart.appendChild(messagePart);
      messagePart.appendChild(defaultSlot);

      // Replace footer slot with button named slots
      const footerPart = memoizedTemplate.content.querySelector('[part="footer"]');
      footerPart.setAttribute('role', 'toolbar');
      const footerSlot = footerPart.querySelector('slot');
      footerPart.removeChild(footerSlot);
      footerPart.appendChild(footerTemplate.content.cloneNode(true));
    }
    return memoizedTemplate;
  }

  /**
   * @protected
   * @override
   */
  _headerFooterRendererChange(headerRenderer, footerRenderer, opened) {
    super._headerFooterRendererChange(headerRenderer, footerRenderer, opened);

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

  /**
   * Override template to provide custom overlay tag name.
   */
  static get template() {
    return html`
      <style>
        :host {
          display: none;
        }
      </style>

      <vaadin-confirm-dialog-overlay
        id="overlay"
        on-opened-changed="_onOverlayOpened"
        on-mousedown="_bringOverlayToFront"
        on-touchstart="_bringOverlayToFront"
        theme$="[[_theme]]"
        modeless="[[modeless]]"
        with-backdrop="[[!modeless]]"
        resizable$="[[resizable]]"
        restore-focus-on-close
        focus-trap
      ></vaadin-confirm-dialog-overlay>
    `;
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
