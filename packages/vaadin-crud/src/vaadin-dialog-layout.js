/**
 * @license
 * Copyright (c) 2017 - 2021 Vaadin Ltd.
 * This program is available under Commercial Vaadin Developer License 4.0, available at https://vaadin.com/license/cvdl-4.0.
 */
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';
import '@vaadin/vaadin-dialog/src/vaadin-dialog.js';

/**
 * An element used internally by `<vaadin-crud>`. Not intended to be used separately.
 *
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 * @private
 */
class DialogLayout extends ElementMixin(ThemableMixin(PolymerElement)) {
  static get is() {
    return 'vaadin-dialog-layout';
  }

  static get template() {
    return html`
      <style>
        :host {
          z-index: 1;
        }

        :host(:not([editor-position=''])[opened]:not([mobile])) {
          flex: 1 0 100%;
        }

        :host([editor-position='bottom'][opened]:not([mobile])) {
          max-height: var(--vaadin-crud-editor-max-height);
        }

        :host([editor-position='aside'][opened]:not([mobile])) {
          min-width: 300px;
          max-width: var(--vaadin-crud-editor-max-width);
        }

        [part='editor'] {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        [part='editor'][hidden] {
          display: none;
        }

        :host([editor-position='bottom']) [part='editor']:not([hidden]) {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        [part='scroller'] {
          display: flex;
          flex-direction: column;
          overflow: auto;
          -webkit-overflow-scrolling: touch;
          flex: auto;
        }

        [part='footer'] {
          display: flex;
          flex: none;
          flex-direction: row-reverse;
        }
      </style>

      <div id="editor" part="editor" hidden$="[[!_computeEditorOpened(opened, mobile, 'bottom','aside')]]">
        <div part="scroller" id="scroller" role="group" aria-labelledby="header">
          <div part="header" id="header">
            <slot name="header"></slot>
          </div>
          <slot></slot>
        </div>

        <div part="footer" role="toolbar">
          <slot name="footer"></slot>
        </div>
      </div>

      <vaadin-dialog
        id="dialog"
        opened="[[_computeEditorOpened(opened, mobile, '')]]"
        aria-label="[[__ariaLabel]]"
        no-close-on-outside-click="[[noCloseOnOutsideClick]]"
        no-close-on-esc="[[noCloseOnEsc]]"
        theme$="[[theme]] layout"
      >
        <template></template>
      </vaadin-dialog>
    `;
  }

  static get properties() {
    return {
      /**
       * True if the overlay is currently displayed.
       */
      opened: {
        type: Boolean,
        value: false,
        notify: true,
        reflectToAttribute: true,
        observer: '_openedChanged'
      },

      editorPosition: {
        type: String,
        reflectToAttribute: true
      },

      /** Theme to use */
      theme: String,

      /** Disable closing when user clicks outside */
      noCloseOnOutsideClick: Boolean,

      /** Disable closing when user presses escape */
      noCloseOnEsc: Boolean,

      mobile: {
        type: Boolean,
        observer: '__mobileChanged',
        reflectToAttribute: true
      },

      __ariaLabel: String
    };
  }

  ready() {
    super.ready();
    this._dialogOpenedChangedListener = this._dialogOpenedChangedListener.bind(this);
    this.$.dialog.addEventListener('opened-changed', this._dialogOpenedChangedListener);
  }

  _dialogOpenedChangedListener() {
    this.opened = this.$.dialog.opened;
  }

  _openedChanged(opened) {
    if (opened) {
      this._ensureChildren();
    }

    // Make sure to reset scroll position
    this.$.scroller.scrollTop = 0;
  }

  __mobileChanged() {
    this._ensureChildren();
  }

  _ensureChildren() {
    if (!this.$.dialog.$.overlay.$.content.shadowRoot) {
      return;
    }

    if (this.editorPosition === '' || this.mobile) {
      // Move children from editor to dialog
      Array.from(this.$.editor.childNodes).forEach((c) => this.$.dialog.$.overlay.$.content.shadowRoot.appendChild(c));
      Array.from(this.childNodes).forEach((c) => this.$.dialog.$.overlay.$.content.appendChild(c));

      // Wait to set label until slotted element have been moved.
      setTimeout(() => {
        this.__ariaLabel = Array.from(this.$.dialog.$.overlay.$.content.querySelectorAll('[slot=header]'))
          .reduce((prev, ele) => prev + ' ' + ele.textContent, '')
          .trim();
      });
    } else {
      // Move children from dialog to editor
      Array.from(this.$.dialog.$.overlay.$.content.shadowRoot.childNodes).forEach((c) => this.$.editor.appendChild(c));
      Array.from(this.$.dialog.$.overlay.$.content.childNodes).forEach((c) => this.appendChild(c));

      // Wait to set label until slotted element have been moved.
      setTimeout(() => {
        this.__ariaLabel = Array.from(this.querySelectorAll('[slot=header]'))
          .reduce((prev, ele) => prev + ' ' + ele.textContent, '')
          .trim();
      });
    }
  }

  _computeEditorOpened(opened, isMobile, ...editorPositions) {
    if (isMobile && editorPositions.indexOf('') !== -1) {
      return opened;
    }
    return editorPositions.indexOf(this.editorPosition) !== -1 && opened;
  }
}

customElements.define(DialogLayout.is, DialogLayout);
