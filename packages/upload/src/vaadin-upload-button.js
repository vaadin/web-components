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
 * files via an event or calls addFiles on a linked UploadManager.
 *
 * ```html
 * <vaadin-upload-button>Upload Files</vaadin-upload-button>
 * ```
 *
 * The button can be linked to an UploadManager by setting the
 * `manager` property directly:
 *
 * ```javascript
 * const button = document.querySelector('vaadin-upload-button');
 * button.manager = uploadManager;
 *
 * // Or listen to the files-selected event
 * button.addEventListener('files-selected', (e) => {
 *   uploadManager.addFiles(e.detail.files);
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
       * becomes true on the manager.
       * @type {Object | null}
       */
      manager: {
        type: Object,
        value: null,
        observer: '__managerChanged',
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
      <input id="fileInput" type="file" hidden @change=${this.__onFileInputChange} />
    `;
  }

  /** @protected */
  ready() {
    super.ready();

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

    this.$.fileInput.value = '';
    this.$.fileInput.click();
  }

  /** @private */
  __updateFileInputAttributes() {
    // Set accept attribute from manager
    this.$.fileInput.accept = this.manager && this.manager.accept;

    // Set multiple attribute based on manager's maxFiles
    const maxFiles = this.manager && this.manager.maxFiles != null ? this.manager.maxFiles : Infinity;
    this.$.fileInput.multiple = maxFiles !== 1;

    // Set capture attribute
    this.$.fileInput.capture = this.capture;
  }

  /** @private */
  __onFileInputChange(event) {
    const files = event.target.files;

    // If we have a manager with addFiles, call it
    if (this.manager && typeof this.manager.addFiles === 'function') {
      this.manager.addFiles(files);
    }
  }

  /** @private */
  __managerChanged(manager, oldManager) {
    // Remove listener from old manager
    if (oldManager && typeof oldManager.removeEventListener === 'function') {
      oldManager.removeEventListener('max-files-reached-changed', this.__onMaxFilesReachedChanged);
    }

    // Add listener to new manager
    if (manager && typeof manager.addEventListener === 'function') {
      manager.addEventListener('max-files-reached-changed', this.__onMaxFilesReachedChanged);

      // Sync initial state if manager has maxFilesReached property
      this.disabled = !!manager.maxFilesReached;
    }
  }

  /** @private */
  __onMaxFilesReachedChanged(event) {
    this.disabled = event.detail.value;
  }
}

defineCustomElement(UploadButton);

export { UploadButton };
