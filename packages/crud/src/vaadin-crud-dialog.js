/**
 * @license
 * Copyright (c) 2000 - 2025 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { css, html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { DialogBaseMixin } from '@vaadin/dialog/src/vaadin-dialog-base-mixin.js';
import { OverlayMixin } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';
import { crudDialogOverlayStyles } from './styles/vaadin-crud-dialog-overlay-base-styles.js';

/**
 * An element used internally by `<vaadin-crud>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes DirMixin
 * @mixes OverlayMixin
 * @mixes ThemableMixin
 * @private
 */
class CrudDialogOverlay extends OverlayMixin(DirMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))))) {
  static get is() {
    return 'vaadin-crud-dialog-overlay';
  }

  static get styles() {
    return crudDialogOverlayStyles;
  }

  /**
   * Override method from OverlayFocusMixin to use dialog as focus trap root
   * @protected
   * @override
   */
  get _focusTrapRoot() {
    // Do not use `owner` since that points to `vaadin-crud`
    return this.getRootNode().host;
  }

  /** @protected */
  render() {
    return html`
      <div part="backdrop" id="backdrop" ?hidden="${!this.withBackdrop}"></div>
      <div part="overlay" id="overlay">
        <section id="resizerContainer" class="resizer-container">
          <header part="header">
            <slot name="header"></slot>
          </header>
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

defineCustomElement(CrudDialogOverlay);

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
      :host([opened]),
      :host([opening]),
      :host([closing]) {
        display: block !important;
        position: absolute;
      }

      :host,
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
