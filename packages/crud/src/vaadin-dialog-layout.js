/**
 * @license
 * Copyright (c) 2017 - 2021 Vaadin Ltd.
 * This program is available under Commercial Vaadin Developer License 4.0, available at https://vaadin.com/license/cvdl-4.0.
 */
import './vaadin-crud-dialog.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

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
          flex: auto;
        }

        [part='footer'] {
          display: flex;
          flex: none;
          flex-direction: row-reverse;
        }
      </style>

      <div id="editor" part="editor" hidden$="[[__computeEditorHidden(opened, mobile, editorPosition)]]">
        <div part="scroller" id="scroller" role="group" aria-labelledby="header">
          <div part="header" id="header">
            <slot name="header"></slot>
          </div>
          <slot name="form"></slot>
        </div>

        <div part="footer" role="toolbar">
          <slot name="save-button"></slot>
          <slot name="cancel-button"></slot>
          <slot name="delete-button"></slot>
        </div>
      </div>

      <vaadin-crud-dialog
        id="dialog"
        opened="[[__computeDialogOpened(opened, mobile, editorPosition)]]"
        aria-label="[[__ariaLabel]]"
        no-close-on-outside-click="[[noCloseOnOutsideClick]]"
        no-close-on-esc="[[noCloseOnEsc]]"
        theme$="[[theme]] crud"
      ></vaadin-crud-dialog>
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

      /** Reference to the edit form */
      form: Object,

      /** Reference to the header element */
      header: Object,

      /** Reference to the edit save button */
      saveButton: Object,

      /** Reference to the edit delete button */
      deleteButton: Object,

      /** Reference to the edit cancel button */
      cancelButton: Object,

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
    this._crud = this.getRootNode().host;
  }

  _dialogOpenedChangedListener(event) {
    this.opened = event.detail.value;
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

  __moveChildNodes(target) {
    // Teleport header node
    target.appendChild(this.header);

    // Teleport editor form
    target.appendChild(this.form);

    // Teleport toolbar buttons
    // NOTE: order in which buttons are moved matches the order of slots.
    target.appendChild(this.saveButton);
    target.appendChild(this.cancelButton);
    target.appendChild(this.deleteButton);

    // Wait to set label until slotted element has been moved.
    setTimeout(() => {
      this.__ariaLabel = this.header.textContent.trim();
    });
  }

  _shouldOpenDialog(isMobile, editorPosition) {
    return editorPosition === '' || isMobile;
  }

  _ensureChildren() {
    const overlay = this.$.dialog.$.overlay;
    const hasContent = ['header', 'form', 'saveButton', 'cancelButton', 'deleteButton'].every((prop) => !!this[prop]);
    if (!hasContent || !overlay) {
      return;
    }

    if (this._shouldOpenDialog(this.mobile, this.editorPosition)) {
      // Move form to dialog
      this.__moveChildNodes(overlay);
    } else {
      // Move form to crud
      this.__moveChildNodes(this._crud);
    }
  }

  __computeDialogOpened(opened, isMobile, editorPosition) {
    // Only open dialog when editorPosition is "" or mobile is set
    return this._shouldOpenDialog(isMobile, editorPosition) ? opened : false;
  }

  __computeEditorHidden(opened, mobile, editorPosition) {
    // Only show editor when editorPosition is "bottom" or "aside"
    if (['aside', 'bottom'].includes(editorPosition) && !mobile) {
      return !opened;
    }

    return true;
  }
}

customElements.define(DialogLayout.is, DialogLayout);
