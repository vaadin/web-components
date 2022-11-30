/**
 * @license
 * Copyright (c) 2000 - 2022 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { Dialog, DialogOverlay } from '@vaadin/dialog/src/vaadin-dialog.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-crud-dialog-overlay',
  css`
    [part='overlay'] {
      max-width: 54em;
      min-width: 20em;
    }

    [part='footer'] {
      justify-content: flex-start;
      flex-direction: row-reverse;
    }

    /* Make buttons clickable */
    [part='footer'] ::slotted(:not([disabled])) {
      pointer-events: all;
    }

    :host([fullscreen]) {
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 0;
    }

    :host([fullscreen]) [part='overlay'] {
      height: 100vh;
      width: 100vw;
      border-radius: 0 !important;
    }

    :host([fullscreen]) [part='content'] {
      flex: 1;
    }
  `,
  { moduleId: 'vaadin-crud-dialog-overlay-styles' },
);

let memoizedTemplate;

const footerTemplate = html`
  <slot name="save-button"></slot>
  <slot name="cancel-button"></slot>
  <slot name="delete-button"></slot>
`;

/**
 * An extension of `<vaadin-dialog-overlay>` used internally by `<vaadin-crud>`.
 * Not intended to be used separately.
 * @private
 */
class CrudDialogOverlay extends DialogOverlay {
  static get is() {
    return 'vaadin-crud-dialog-overlay';
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

      // Replace default slot with "form" named slot
      const contentPart = memoizedTemplate.content.querySelector('[part="content"]');
      const defaultSlot = contentPart.querySelector('slot:not([name])');
      defaultSlot.setAttribute('name', 'form');

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

    // CRUD has header and footer but does not use renderers
    this.setAttribute('has-header', '');
    this.setAttribute('has-footer', '');
  }
}

customElements.define('vaadin-crud-dialog-overlay', CrudDialogOverlay);

/**
 * An extension of `<vaadin-dialog>` used internally by `<vaadin-crud>`.
 * Not intended to be used separately.
 * @private
 */
class CrudDialog extends Dialog {
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

      <vaadin-crud-dialog-overlay
        id="overlay"
        on-opened-changed="_onOverlayOpened"
        on-mousedown="_bringOverlayToFront"
        on-touchstart="_bringOverlayToFront"
        theme$="[[_theme]]"
        modeless="[[modeless]]"
        with-backdrop="[[!modeless]]"
        resizable$="[[resizable]]"
        focus-trap
      ></vaadin-crud-dialog-overlay>
    `;
  }
}

customElements.define('vaadin-crud-dialog', CrudDialog);
