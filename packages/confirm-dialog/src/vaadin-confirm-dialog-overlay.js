/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { OverlayMixin } from '@vaadin/overlay/src/vaadin-overlay-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { confirmDialogOverlayStyles } from './styles/vaadin-confirm-dialog-overlay-base-styles.js';

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
class ConfirmDialogOverlay extends OverlayMixin(DirMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))))) {
  static get is() {
    return 'vaadin-confirm-dialog-overlay';
  }

  static get styles() {
    return confirmDialogOverlayStyles;
  }

  static get properties() {
    return {
      cancelButtonVisible: {
        type: Boolean,
        value: false,
      },

      rejectButtonVisible: {
        type: Boolean,
        value: false,
      },
    };
  }

  /** @protected */
  render() {
    return html`
      <div part="backdrop" id="backdrop" ?hidden="${!this.withBackdrop}"></div>
      <div part="overlay" id="overlay">
        <header part="header"><slot name="header"></slot></header>
        <div part="content" id="content">
          <div part="message"><slot></slot></div>
        </div>
        <footer part="footer" role="toolbar">
          <div part="cancel-button" ?hidden="${!this.cancelButtonVisible}">
            <slot name="cancel-button"></slot>
          </div>
          <div part="reject-button" ?hidden="${!this.rejectButtonVisible}">
            <slot name="reject-button"></slot>
          </div>
          <div part="confirm-button">
            <slot name="confirm-button"></slot>
          </div>
        </footer>
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

  /**
   * Override method from OverlayFocusMixin to use owner as content root
   * @protected
   * @override
   */
  get _contentRoot() {
    return this.owner;
  }

  /**
   * Override method from OverlayFocusMixin to use owner as focus trap root
   * @protected
   * @override
   */
  get _focusTrapRoot() {
    return this.owner;
  }
}

defineCustomElement(ConfirmDialogOverlay);
