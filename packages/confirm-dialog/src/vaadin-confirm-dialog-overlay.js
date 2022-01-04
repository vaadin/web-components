/**
 * @license
 * Copyright (c) 2018 - 2022 Vaadin Ltd.
 * This program is available under Commercial Vaadin Developer License 4.0, available at https://vaadin.com/license/cvdl-4.0.
 */
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { Dialog, DialogOverlay } from '@vaadin/dialog/src/vaadin-dialog.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-confirm-dialog-overlay',
  css`
    :host {
      --_vaadin-confirm-dialog-content-width: auto;
      --_vaadin-confirm-dialog-content-height: auto;
    }

    [part='content'] {
      width: var(--_vaadin-confirm-dialog-content-width);
      display: flex;
      flex-direction: column;
      height: var(--_vaadin-confirm-dialog-content-height);
      box-sizing: content-box;
    }

    [part='message'] {
      margin-bottom: auto;
    }
  `,
  { moduleId: 'vaadin-confirm-dialog-overlay-styles' }
);

let memoizedTemplate;

const dialogTemplate = html`
  <div part="header">
    <slot name="header"></slot>
  </div>

  <div part="message">
    <slot></slot>
  </div>

  <div part="footer">
    <div part="cancel-button">
      <slot name="cancel-button"></slot>
    </div>
    <div part="reject-button">
      <slot name="reject-button"></slot>
    </div>
    <div part="confirm-button">
      <slot name="confirm-button"></slot>
    </div>
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
      const contentPart = memoizedTemplate.content.querySelector('[part="content"]');
      const defaultSlot = contentPart.querySelector('slot:not([name])');
      contentPart.removeChild(defaultSlot);
      contentPart.appendChild(dialogTemplate.content.cloneNode(true));
    }
    return memoizedTemplate;
  }

  /**
   * Override method inherited from `OverlayElement` to notify when overlay is closed.
   * The `vaadin-overlay-close` event is not suitable, as it fires before closing.
   * @protected
   * @override
   */
  _finishClosing() {
    super._finishClosing();

    this.dispatchEvent(new CustomEvent('vaadin-confirm-dialog-close'));
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
        theme$="[[theme]]"
        modeless="[[modeless]]"
        with-backdrop="[[!modeless]]"
        resizable$="[[resizable]]"
        focus-trap
      ></vaadin-confirm-dialog-overlay>
    `;
  }
}

customElements.define(ConfirmDialogDialog.is, ConfirmDialogDialog);
