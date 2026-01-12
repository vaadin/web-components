/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { ButtonMixin } from '@vaadin/button/src/vaadin-button-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { uploadButtonStyles } from './styles/vaadin-upload-button-base-styles.js';

/**
 * `<vaadin-upload-button>` is a button component for file uploads.
 * When clicked, it opens a file picker dialog and dispatches selected
 * files via an event or calls addFiles on a target UploadManager.
 *
 * ```html
 * <vaadin-upload-button>Upload Files</vaadin-upload-button>
 * ```
 *
 * The button can be linked to an UploadManager by setting the
 * `target` property directly:
 *
 * ```javascript
 * const button = document.querySelector('vaadin-upload-button');
 * button.target = manager;
 *
 * // Or listen to the files-selected event
 * button.addEventListener('files-selected', (e) => {
 *   manager.addFiles(e.detail.files);
 * });
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------|-------------
 * `label`   | The label element
 * `prefix`  | The prefix element
 * `suffix`  | The suffix element
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description
 * -------------|--------------------------------------------
 * `active`     | Set when the button is pressed
 * `disabled`   | Set when disabled or max files reached
 * `focus-ring` | Set when the button is focused via keyboard
 * `focused`    | Set when the button is focused
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ButtonMixin
 * @mixes ElementMixin
 * @mixes ThemableMixin
 * @fires {CustomEvent} files-selected - Fired when files are selected from the picker
 */
class UploadButton extends ButtonMixin(ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))))) {
  static get is() {
    return 'vaadin-upload-button';
  }

  static get styles() {
    return uploadButtonStyles;
  }

  static get properties() {
    return {
      /**
       * Reference to an UploadManager.
       * When set, the button will automatically disable when maxFilesReached
       * becomes true on the target.
       * @type {Object | null}
       */
      target: {
        type: Object,
        value: null,
        observer: '__targetChanged',
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
    this.__onFileInputChange = this.__onFileInputChange.bind(this);
    this.__onMaxFilesReachedChanged = this.__onMaxFilesReachedChanged.bind(this);
  }

  /** @protected */
  render() {
    return html`
      <div class="vaadin-button-container">
        <span part="prefix" aria-hidden="true">
          <slot name="prefix"></slot>
        </span>
        <span part="label">
          <slot></slot>
        </span>
        <span part="suffix" aria-hidden="true">
          <slot name="suffix"></slot>
        </span>
      </div>
      <slot name="tooltip"></slot>
    `;
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

    // Add tooltip support
    this._tooltipController = new TooltipController(this);
    this.addController(this._tooltipController);

    // Open file picker on click
    this.addEventListener('click', () => {
      this.openFilePicker();
    });
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

  /** @private */
  __targetChanged(target, oldTarget) {
    // Remove listener from old target
    if (oldTarget && typeof oldTarget.removeEventListener === 'function') {
      oldTarget.removeEventListener('max-files-reached-changed', this.__onMaxFilesReachedChanged);
    }

    // Add listener to new target
    if (target && typeof target.addEventListener === 'function') {
      target.addEventListener('max-files-reached-changed', this.__onMaxFilesReachedChanged);

      // Sync initial state if target has maxFilesReached property
      if (target.maxFilesReached !== undefined) {
        this.disabled = target.maxFilesReached;
      }
    }
  }

  /** @private */
  __onMaxFilesReachedChanged(event) {
    this.disabled = event.detail.value;
  }
}

defineCustomElement(UploadButton);

export { UploadButton };
