/**
 * @license
 * Copyright (c) 2018 - 2022 Vaadin Ltd.
 * This program is available under Commercial Vaadin Developer License 4.0, available at https://vaadin.com/license/cvdl-4.0.
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

    [part='content'] {
      display: flex;
      flex-direction: column;
      padding: 0;
    }

    [part='scroller'] {
      display: flex;
      flex-direction: column;
      overflow: auto;
      flex: auto;
    }

    [part='footer'] {
      display: flex;
      flex: none;
      flex-direction: row-reverse;
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
  { moduleId: 'vaadin-crud-dialog-overlay-styles' }
);

let memoizedTemplate;

const editorTemplate = html`
  <div part="scroller" role="group" aria-labelledby="header">
    <div part="header" id="header">
      <slot name="header"></slot>
    </div>
    <slot name="form"></slot>
  </div>

  <div part="footer" role="toolbar">
    <slot name="save-button"></slot>
    <slot name="cancel-button"></slot>
    <slot name="delete-button"></slot>
  </div>
`;

class CrudDialogOverlay extends DialogOverlay {
  static get is() {
    return 'vaadin-crud-dialog-overlay';
  }

  static get template() {
    if (!memoizedTemplate) {
      memoizedTemplate = super.template.cloneNode(true);
      const contentPart = memoizedTemplate.content.querySelector('[part="content"]');
      const defaultSlot = contentPart.querySelector('slot:not([name])');
      contentPart.removeChild(defaultSlot);
      contentPart.appendChild(editorTemplate.content.cloneNode(true));
    }
    return memoizedTemplate;
  }
}

customElements.define('vaadin-crud-dialog-overlay', CrudDialogOverlay);

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
        theme$="[[theme]]"
        modeless="[[modeless]]"
        with-backdrop="[[!modeless]]"
        resizable$="[[resizable]]"
        focus-trap
      ></vaadin-crud-dialog-overlay>
    `;
  }
}

customElements.define('vaadin-crud-dialog', CrudDialog);
