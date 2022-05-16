/**
 * @license
 * Copyright (c) 2017 - 2021 Vaadin Ltd.
 * This program is available under Commercial Vaadin Developer License 4.0, available at https://vaadin.com/license/cvdl-4.0.
 */
import '@vaadin/dialog/src/vaadin-dialog.js';
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
      ></vaadin-dialog>

      <template id="dialogTemplate"></template>
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
        observer: '_openedChanged',
      },

      editorPosition: {
        type: String,
        reflectToAttribute: true,
      },

      /** Theme to use */
      theme: String,

      /** Disable closing when user clicks outside */
      noCloseOnOutsideClick: Boolean,

      /** Disable closing when user presses escape */
      noCloseOnEsc: Boolean,

      /** Reference to the edit form */
      form: Object,

      /** Reference to the edit save button */
      saveButton: Object,

      /** Reference to the edit delete button */
      deleteButton: Object,

      /** Reference to the edit cancel button */
      cancelButton: Object,

      mobile: {
        type: Boolean,
        observer: '__mobileChanged',
        reflectToAttribute: true,
      },

      __ariaLabel: String,
    };
  }

  ready() {
    super.ready();
    this._dialogOpenedChangedListener = this._dialogOpenedChangedListener.bind(this);
    this.$.dialog.addEventListener('opened-changed', this._dialogOpenedChangedListener);
    this.__header = this.querySelector('[slot=header]');
    this.__footer = Array.from(this.querySelectorAll('[slot="footer"]'));
  }

  _dialogOpenedChangedListener() {
    this.opened = this.$.dialog.opened;
  }

  _openedChanged(opened) {
    if (opened) {
      this._ensureChildren();
    }

    // TODO: A temporary hack as far as `vaadin-dialog` doesn't support the Polymer Template API anymore.
    this.$.dialog.$.overlay.template = this.$.dialogTemplate;

    // Make sure to reset scroll position
    this.$.scroller.scrollTop = 0;
  }

  __mobileChanged() {
    this._ensureChildren();
  }

  __moveChildNodes(target) {
    // Teleport header node
    target.appendChild(this.__header);

    // For custom form, remove slot attribute
    // so that it is properly moved to dialog.
    if (this.form.hasAttribute('slot')) {
      this.form.removeAttribute('slot');
    }

    // Teleport edit form
    target.appendChild(this.form);

    // This order is important so the spacing (coming from this.__footer) is correctly placed
    if (this.saveButton) {
      this.saveButton.setAttribute('slot', 'footer');
      target.appendChild(this.saveButton);
    }

    if (this.cancelButton) {
      this.cancelButton.setAttribute('slot', 'footer');
      target.appendChild(this.cancelButton);
    }

    // Teleport footer nodes
    this.__footer.forEach((node) => target.appendChild(node));

    if (this.deleteButton) {
      this.deleteButton.setAttribute('slot', 'footer');
      target.appendChild(this.deleteButton);
    }

    // Wait to set label until slotted element has been moved.
    setTimeout(() => {
      this.__ariaLabel = this.__header.textContent.trim();
    });
  }

  _ensureChildren() {
    const content = this.$.dialog.$.overlay.$.content;
    if (!this.form || !content.shadowRoot) {
      return;
    }

    if (this.editorPosition === '' || this.mobile) {
      // Move children from editor to dialog
      Array.from(this.$.editor.childNodes).forEach((node) => content.shadowRoot.appendChild(node));
      this.__moveChildNodes(content);
    } else {
      // Move children from dialog to editor
      Array.from(content.shadowRoot.childNodes).forEach((c) => this.$.editor.appendChild(c));
      this.__moveChildNodes(this);
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
