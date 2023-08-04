import { html } from '@polymer/polymer/polymer-element.js';
import { ConfirmDialog } from '@vaadin/confirm-dialog';
import { PositionMixin } from '@vaadin/overlay/src/vaadin-overlay-position-mixin.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

// Remove CSS responsible for dialog centering
registerStyles(
  'custom-confirm-dialog-overlay',
  css`
    :host::before,
    :host::after {
      display: none;
    }
  `,
  { moduleId: 'custom-confirm-dialog-overlay-styles' },
);

const ConfirmDialogOverlay = customElements.get('vaadin-confirm-dialog-overlay');

customElements.define(
  'custom-confirm-dialog-overlay',
  class extends PositionMixin(ConfirmDialogOverlay) {
    static get is() {
      return 'custom-confirm-dialog-overlay';
    }
  },
);

const ConfirmDialogDialog = customElements.get('vaadin-confirm-dialog-dialog');

customElements.define(
  'custom-confirm-dialog-dialog',
  class extends ConfirmDialogDialog {
    static get is() {
      return 'custom-confirm-dialog-dialog';
    }

    static get properties() {
      return {
        /**
         * This is used for the overlay.
         */
        positionTarget: Object,
      };
    }

    static get template() {
      return html`
        <custom-confirm-dialog-overlay
          id="overlay"
          opened="[[opened]]"
          on-opened-changed="_onOverlayOpened"
          on-mousedown="_bringOverlayToFront"
          on-touchstart="_bringOverlayToFront"
          theme$="[[_theme]]"
          modeless="[[modeless]]"
          with-backdrop="[[!modeless]]"
          resizable$="[[resizable]]"
          aria-label$="[[ariaLabel]]"
          position-target="[[positionTarget]]"
          no-vertical-overlap
        ></custom-confirm-dialog-overlay>
      `;
    }
  },
);

class CustomConfirmDialog extends ConfirmDialog {
  static get is() {
    return 'custom-confirm-dialog';
  }

  static get properties() {
    return {
      /**
       * This is used for the overlay.
       */
      positionTarget: Object,
    };
  }

  static get template() {
    return html`
      <style>
        :host,
        [hidden] {
          display: none !important;
        }
      </style>

      <custom-confirm-dialog-dialog
        id="dialog"
        opened="{{opened}}"
        overlay-class="[[overlayClass]]"
        aria-label="[[_getAriaLabel(header)]]"
        theme$="[[_theme]]"
        no-close-on-outside-click
        no-close-on-esc="[[noCloseOnEsc]]"
        content-height="[[_contentHeight]]"
        content-width="[[_contentWidth]]"
        position-target="[[positionTarget]]"
        modeless
      ></custom-confirm-dialog-dialog>

      <div hidden>
        <slot name="header"></slot>
        <slot></slot>
        <slot name="cancel-button"></slot>
        <slot name="reject-button"></slot>
        <slot name="confirm-button"></slot>
      </div>
    `;
  }
}

customElements.define(CustomConfirmDialog.is, CustomConfirmDialog);
