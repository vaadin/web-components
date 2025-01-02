/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { OverlayClassMixin } from '@vaadin/component-base/src/overlay-class-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { DialogBaseMixin } from '@vaadin/dialog/src/vaadin-dialog-base-mixin.js';
import { dialogOverlay } from '@vaadin/dialog/src/vaadin-dialog-styles.js';
import { OverlayMixin } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';
import { overlayStyles } from '@vaadin/overlay/src/vaadin-overlay-styles.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';
import { ConfirmDialogBaseMixin } from './vaadin-confirm-dialog-base-mixin.js';
import { confirmDialogOverlay } from './vaadin-confirm-dialog-overlay-styles.js';

/**
 * An element used internally by `<vaadin-confirm-dialog>`. Not intended to be used separately.
 *
 * @customElement
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

defineCustomElement(ConfirmDialogOverlay);

/**
 * An element used internally by `<vaadin-confirm-dialog>`. Not intended to be used separately.
 * @private
 */
class ConfirmDialogDialog extends ConfirmDialogBaseMixin(
  DialogBaseMixin(OverlayClassMixin(ThemePropertyMixin(PolylitMixin(LitElement)))),
) {
  static get is() {
    return 'vaadin-confirm-dialog-dialog';
  }

  static get styles() {
    return css`
      :host {
        display: none;
      }
    `;
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
        aria-label="${this.ariaLabel}"
        restore-focus-on-close
        focus-trap
      ></vaadin-confirm-dialog-overlay>
    `;
  }
}

defineCustomElement(ConfirmDialogDialog);
