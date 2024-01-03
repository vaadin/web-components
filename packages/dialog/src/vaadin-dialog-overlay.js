/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { overlayStyles } from '@vaadin/overlay/src/vaadin-overlay-styles.js';
import { registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { DialogOverlayMixin } from './vaadin-dialog-overlay-mixin.js';
import { dialogOverlay, resizableOverlay } from './vaadin-dialog-styles.js';

registerStyles('vaadin-dialog-overlay', [overlayStyles, dialogOverlay, resizableOverlay], {
  moduleId: 'vaadin-dialog-overlay-styles',
});

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
export class DialogOverlay extends DialogOverlayMixin(DirMixin(ThemableMixin(PolymerElement))) {
  static get is() {
    return 'vaadin-dialog-overlay';
  }

  static get template() {
    return html`
      <div id="backdrop" part="backdrop" hidden$="[[!withBackdrop]]"></div>
      <div part="overlay" id="overlay" tabindex="0">
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
