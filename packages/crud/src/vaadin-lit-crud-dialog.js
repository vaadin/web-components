/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { dialogOverlay, resizableOverlay } from '@vaadin/dialog/src/vaadin-dialog-styles.js';
import { overlayStyles } from '@vaadin/overlay/src/vaadin-overlay-styles.js';
import { registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { CrudDialogMixin } from './vaadin-crud-dialog-mixin.js';
import { crudDialogOverlayStyles } from './vaadin-crud-styles.js';
registerStyles(
  'vaadin-crud-dialog-overlay',
  [overlayStyles, dialogOverlay, resizableOverlay, crudDialogOverlayStyles],
  {
    moduleId: 'vaadin-crud-dialog-overlay-styles',
  },
);

/**
 * LitElement based version of `<vaadin-crud-dialog>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
class CrudDialogOverlay extends CrudDialogMixin(ThemableMixin(PolylitMixin(LitElement))) {
  static get is() {
    return 'vaadin-crud-dialog-overlay';
  }
  render() {
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
}
defineCustomElement(CrudDialogOverlay);

/**
 * An element used internally by `<vaadin-crud>`. Not intended to be used separately.
 * @private
 */
class CrudDialog extends CrudDialogMixin(ThemableMixin(PolylitMixin(LitElement))) {
  static get is() {
    return 'vaadin-crud-dialog';
  }
  static get template() {
    return html`
      <style>
        :host {
          display: none;
        }
      </style>

      <vaadin-crud-dialog-overlay
        id="overlay"
        opened="[[opened]]"
        aria-label$="[[ariaLabel]]"
        on-opened-changed="_onOverlayOpened"
        on-mousedown="_bringOverlayToFront"
        on-touchstart="_bringOverlayToFront"
        theme$="[[_theme]]"
        modeless="[[modeless]]"
        with-backdrop="[[!modeless]]"
        resizable$="[[resizable]]"
        fullscreen$="[[fullscreen]]"
        role="dialog"
        focus-trap
      ></vaadin-crud-dialog-overlay>
    `;
  }
}
defineCustomElement(CrudDialog);
