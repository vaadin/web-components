/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-upload-add-button>` is a Web Component that can be used as an
 * add button for file uploads. When clicked, it opens a file picker dialog
 * and dispatches selected files via an event or calls addFiles on a target.
 *
 * The add button can be linked to an UploadOrchestrator by setting the
 * `target` property directly.
 *
 * ```javascript
 * const button = document.querySelector('vaadin-upload-add-button');
 * button.target = orchestrator;
 *
 * // Or listen to the files-selected event
 * button.addEventListener('files-selected', (e) => {
 *   orchestrator.addFiles(e.detail.files);
 * });
 * ```
 *
 * ### Styling
 *
 * The component has minimal default styling. You can style the slotted content
 * or use CSS to customize the appearance.
 *
 * The following state attributes are available for styling:
 *
 * Attribute   | Description
 * ------------|--------------------------------------------
 * `disabled`  | Set when disabled or max files reached
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @fires {CustomEvent} files-selected - Fired when files are selected from the picker
 */
class UploadAddButton extends ThemableMixin(PolylitMixin(LitElement)) {
  static get is() {
    return 'vaadin-upload-add-button';
  }

  static get properties() {
    return {
      /**
       * Reference to an UploadOrchestrator or any object with addFiles method.
       * @type {Object | null}
       */
      target: {
        type: Object,
        value: null,
      },

      /**
       * When true, the button is disabled and cannot be clicked.
       * @type {boolean}
       */
      disabled: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },

      /**
       * Accepted file types (MIME types or extensions).
       * @type {string}
       */
      accept: {
        type: String,
        value: '',
      },

      /**
       * Maximum number of files (1 = single file mode).
       * @type {number}
       */
      maxFiles: {
        type: Number,
        value: Infinity,
      },

      /**
       * Capture attribute for mobile file input.
       * @type {string}
       */
      capture: {
        type: String,
      },
    };
  }

  constructor() {
    super();
    this.__onClick = this.__onClick.bind(this);
    this.__onTouchEnd = this.__onTouchEnd.bind(this);
    this.__onKeyDown = this.__onKeyDown.bind(this);
    this.__onFileInputChange = this.__onFileInputChange.bind(this);
  }

  /** @protected */
  ready() {
    super.ready();

    // Create a hidden file input
    this.__fileInput = document.createElement('input');
    this.__fileInput.type = 'file';
    this.__fileInput.style.display = 'none';
    this.__fileInput.addEventListener('change', this.__onFileInputChange);
    this.shadowRoot.appendChild(this.__fileInput);

    this.addEventListener('click', this.__onClick);
    this.addEventListener('touchend', this.__onTouchEnd);
    this.addEventListener('keydown', this.__onKeyDown);

    // Make it focusable
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }

    // Set role for accessibility
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'button');
    }
  }

  /** @protected */
  render() {
    return html`<slot></slot>`;
  }

  /**
   * Opens the file picker dialog.
   */
  openFilePicker() {
    if (this.disabled) {
      return;
    }

    // Update file input attributes before opening
    this.__updateFileInputAttributes();

    this.__fileInput.value = '';
    this.__fileInput.click();
  }

  /** @private */
  __updateFileInputAttributes() {
    if (this.__fileInput) {
      // Set accept attribute
      if (this.accept) {
        this.__fileInput.accept = this.accept;
      } else {
        this.__fileInput.removeAttribute('accept');
      }

      // Set multiple attribute based on maxFiles
      this.__fileInput.multiple = this.maxFiles !== 1;

      // Set capture attribute
      if (this.capture) {
        this.__fileInput.capture = this.capture;
      } else {
        this.__fileInput.removeAttribute('capture');
      }
    }
  }

  /** @private */
  __onClick(event) {
    if (this.disabled) {
      return;
    }
    event.stopPropagation();
    this.openFilePicker();
  }

  /** @private */
  __onTouchEnd(event) {
    event.preventDefault();
    this.__onClick(event);
  }

  /** @private */
  __onKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.openFilePicker();
    }
  }

  /** @private */
  __onFileInputChange(event) {
    const files = event.target.files;

    // Dispatch event for listeners
    this.dispatchEvent(
      new CustomEvent('files-selected', {
        detail: { files: Array.from(files) },
        bubbles: true,
        composed: true,
      }),
    );

    // If we have a target with addFiles, call it
    if (this.target && typeof this.target.addFiles === 'function') {
      this.target.addFiles(files);
    }
  }
}

defineCustomElement(UploadAddButton);

export { UploadAddButton };
