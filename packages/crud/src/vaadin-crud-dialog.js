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
import { OverlayClassMixin } from '@vaadin/component-base/src/overlay-class-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { DialogBaseMixin } from '@vaadin/dialog/src/vaadin-dialog-base-mixin.js';
import { OverlayMixin } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';
import { crudDialogOverlayStyles } from './styles/vaadin-crud-dialog-overlay-core-styles.js';

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
   * Override method from OverlayFocusMixin to use the owner (CRUD element) as modal root
   * @protected
   * @override
   */
  get _modalRoot() {
    return this.owner;
  }

  /** @protected */
  render() {
    return html`
      <div part="backdrop" id="backdrop" ?hidden="${!this.withBackdrop}"></div>
      <div part="overlay" id="overlay" tabindex="0">
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

  /**
   * @protected
   * @override
   */
  _attachOverlay() {
    this.showPopover();
  }

  /**
   * @protected
   * @override
   */
  _detachOverlay() {
    this.hidePopover();
  }
}

defineCustomElement(CrudDialogOverlay);

/**
 * An element used internally by `<vaadin-crud>`. Not intended to be used separately.
 * @private
 */
class CrudDialog extends DialogBaseMixin(OverlayClassMixin(ThemePropertyMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-crud-dialog';
  }

  static get styles() {
    return css`
      :host,
      [hidden] {
        display: none !important;
      }

      :host([opened]),
      :host([opening]),
      :host([closing]) {
        display: contents !important;
      }
    `;
  }

  static get properties() {
    return {
      ariaLabel: {
        type: String,
      },

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
        popover="manual"
        .owner="${this.crudElement}"
        .opened="${this.opened}"
        aria-label="${ifDefined(this.ariaLabel)}"
        @opened-changed="${this._onOverlayOpened}"
        @mousedown="${this._bringOverlayToFront}"
        @touchstart="${this._bringOverlayToFront}"
        @vaadin-overlay-outside-click="${this.__cancel}"
        @vaadin-overlay-escape-press="${this.__cancel}"
        theme="${ifDefined(this._theme)}"
        .modeless="${this.modeless}"
        .withBackdrop="${!this.modeless}"
        ?fullscreen="${this.fullscreen}"
        role="dialog"
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
