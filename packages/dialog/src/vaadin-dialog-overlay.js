/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { dialogOverlayStyles } from './styles/vaadin-dialog-overlay-base-styles.js';
import { DialogOverlayMixin } from './vaadin-dialog-overlay-mixin.js';

/**
 * An element used internally by `<vaadin-dialog>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes DialogOverlayMixin
 * @mixes DirMixin
 * @mixes ThemableMixin
 * @private
 */
export class DialogOverlay extends DialogOverlayMixin(
  DirMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement)))),
) {
  static get is() {
    return 'vaadin-dialog-overlay';
  }

  static get styles() {
    return dialogOverlayStyles;
  }

  /**
   * Override method from OverlayFocusMixin to use owner as focus trap root
   * @protected
   * @override
   */
  get _focusTrapRoot() {
    return this.owner;
  }

  /** @protected */
  render() {
    return html`
      <div id="backdrop" part="backdrop" ?hidden="${!this.withBackdrop}"></div>
      <div part="overlay" id="overlay">
        <section id="resizerContainer" class="resizer-container">
          <header part="header">
            <div part="title"><slot name="title"></slot></div>
            <div part="header-content"><slot name="header-content"></slot></div>
          </header>
          <div part="content" id="content"><slot></slot></div>
          <footer part="footer"><slot name="footer"></slot></footer>
        </section>
      </div>
    `;
  }
}

defineCustomElement(DialogOverlay);
