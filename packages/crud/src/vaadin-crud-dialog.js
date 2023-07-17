/**
 * @license
 * Copyright (c) 2000 - 2023 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { Dialog } from '@vaadin/dialog/src/vaadin-dialog.js';
import { dialogOverlay, resizableOverlay } from '@vaadin/dialog/src/vaadin-dialog-styles.js';
import { OverlayMixin } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';
import { overlayStyles } from '@vaadin/overlay/src/vaadin-overlay-styles.js';
import { css, registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const crudDialogOverlay = css`
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
    inset: 0;
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
`;

registerStyles('vaadin-crud-dialog-overlay', [overlayStyles, dialogOverlay, resizableOverlay, crudDialogOverlay], {
  moduleId: 'vaadin-crud-dialog-overlay-styles',
});

/**
 * An element used internally by `<vaadin-crud>`. Not intended to be used separately.
 *
 * @extends HTMLElement
 * @mixes DirMixin
 * @mixes OverlayMixin
 * @mixes ThemableMixin
 * @private
 */
class CrudDialogOverlay extends OverlayMixin(DirMixin(ThemableMixin(PolymerElement))) {
  static get is() {
    return 'vaadin-crud-dialog-overlay';
  }

  static get template() {
    return html`
      <div part="backdrop" id="backdrop" hidden$="[[!withBackdrop]]"></div>
      <div part="overlay" id="overlay" tabindex="0">
        <section id="resizerContainer" class="resizer-container">
          <header part="header"><slot name="header"></slot></header>
          <div part="content" id="content">
            <slot name="form"></slot>
          </div>
          <footer part="footer" role="toolbar">
            <slot name="save-button"></slot>
            <slot name="cancel-button"></slot>
            <slot name="delete-button"></slot>
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

    // CRUD has header and footer but does not use renderers
    this.setAttribute('has-header', '');
    this.setAttribute('has-footer', '');
  }
}

customElements.define(CrudDialogOverlay.is, CrudDialogOverlay);

/**
 * An extension of `<vaadin-dialog>` used internally by `<vaadin-crud>`.
 * Not intended to be used separately.
 * @private
 */
class CrudDialog extends Dialog {
  static get is() {
    return 'vaadin-crud-dialog';
  }

  static get properties() {
    return {
      fullscreen: {
        type: Boolean,
      },
    };
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

      <vaadin-crud-dialog-overlay
        id="overlay"
        on-opened-changed="_onOverlayOpened"
        on-mousedown="_bringOverlayToFront"
        on-touchstart="_bringOverlayToFront"
        theme$="[[_theme]]"
        modeless="[[modeless]]"
        with-backdrop="[[!modeless]]"
        resizable$="[[resizable]]"
        fullscreen$="[[fullscreen]]"
        focus-trap
      ></vaadin-crud-dialog-overlay>
    `;
  }
}

customElements.define(CrudDialog.is, CrudDialog);
