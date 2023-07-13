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
import { html, LitElement } from 'lit';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { Dialog } from '@vaadin/dialog/src/vaadin-dialog.js';
import { dialogOverlay, resizableOverlay } from '@vaadin/dialog/src/vaadin-dialog-styles.js';
import { OverlayMixin } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';
import { overlayStyles } from '@vaadin/overlay/src/vaadin-overlay-styles.js';
import { css, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

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

/**
 * An element used internally by `<vaadin-crud>`. Not intended to be used separately.
 *
 * @extends HTMLElement
 * @mixes DirMixin
 * @mixes OverlayMixin
 * @mixes ThemableMixin
 * @private
 */
class CrudDialogOverlay extends OverlayMixin(DirMixin(ThemableMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-crud-dialog-overlay';
  }

  static get styles() {
    return [overlayStyles, dialogOverlay, resizableOverlay, crudDialogOverlay];
  }

  /** @protected */
  render() {
    return html`
      <div part="backdrop" id="backdrop" ?hidden="${!this.withBackdrop}"></div>
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

customElements.define('vaadin-crud-dialog-overlay', CrudDialogOverlay);

/**
 * An extension of `<vaadin-dialog>` used internally by `<vaadin-crud>`.
 * Not intended to be used separately.
 * @private
 */
class CrudDialog extends Dialog {
  static get properties() {
    return {
      fullscreen: {
        type: Boolean,
      },
    };
  }

  /** @protected */
  render() {
    return html`
      <vaadin-crud-dialog-overlay
        id="overlay"
        .owner="${this}"
        .opened="${this.opened}"
        @opened-changed="${this._onOverlayOpened}"
        @mousedown="${this._bringOverlayToFront}"
        @touchstart="${this._bringOverlayToFront}"
        theme="${this._theme}"
        .modeless="${this.modeless}"
        .withBackdrop="${!this.modeless}"
        ?resizable="${this.resizable}"
        ?fullscreen="${this.fullscreen}"
        focus-trap
      ></vaadin-crud-dialog-overlay>
    `;
  }
}

customElements.define('vaadin-crud-dialog', CrudDialog);
