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
import { UploadManager } from './vaadin-upload-manager.js';

/**
 * `<vaadin-upload-button>` is a button component for file uploads.
 * When clicked, it opens a file picker dialog and calls addFiles
 * on a linked UploadManager.
 *
 * ```html
 * <vaadin-upload-button>Upload Files</vaadin-upload-button>
 * ```
 *
 * The button must be linked to an UploadManager by setting the
 * `manager` property:
 *
 * ```javascript
 * const button = document.querySelector('vaadin-upload-button');
 * button.manager = uploadManager;
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------|-------------
 * `label`   | The label (text) inside the button.
 * `prefix`  | A slot for content before the label (e.g. an icon).
 * `suffix`  | A slot for content after the label (e.g. an icon).
 *
 * The following state attributes are available for styling:
 *
 * Attribute      | Description
 * ---------------|-------------
 * `active`       | Set when the button is pressed down, either with mouse, touch or the keyboard
 * `disabled`     | Set when the button is disabled
 * `focus-ring`   | Set when the button is focused using the keyboard
 * `focused`      | Set when the button is focused
 * `has-tooltip`  | Set when the button has a slotted tooltip
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                |
 * :----------------------------------|
 * | `--vaadin-button-background`     |
 * | `--vaadin-button-border-color`   |
 * | `--vaadin-button-border-radius`  |
 * | `--vaadin-button-border-width`   |
 * | `--vaadin-button-font-size`      |
 * | `--vaadin-button-font-weight`    |
 * | `--vaadin-button-gap`            |
 * | `--vaadin-button-height`         |
 * | `--vaadin-button-line-height`    |
 * | `--vaadin-button-margin`         |
 * | `--vaadin-button-padding`        |
 * | `--vaadin-button-text-color`     |
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement vaadin-upload-button
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

      /**
       * True when max files has been reached on the manager.
       * @type {boolean}
       */
      maxFilesReached: {
        type: Boolean,
        value: false,
        reflect: true,
        attribute: 'max-files-reached',
      },
    };
  }

  constructor() {
    super();
    this.__syncFromManager = this.__syncFromManager.bind(this);
    this.__explicitDisabled = false;
  }

  /**
   * Whether the button is disabled.
   * Returns true if either explicitly disabled, manager is disabled, or maxFilesReached is true.
   * @type {boolean}
   * @override
   */
  get disabled() {
    return super.disabled;
  }

  set disabled(value) {
    this.__explicitDisabled = Boolean(value);
    super.disabled = this.__effectiveDisabled;
  }

  /**
   * Override to intercept external disabled attribute changes.
   * `toggleAttribute('disabled', true)` is a no-op per DOM spec when the
   * attribute already exists, so `attributeChangedCallback` won't fire.
   * This override ensures `__explicitDisabled` is updated in that case.
   * @override
   */
  toggleAttribute(name, force) {
    if (name === 'disabled') {
      this.__explicitDisabled = force === undefined ? !this.hasAttribute('disabled') : Boolean(force);
      super.disabled = this.__effectiveDisabled;
      return this.hasAttribute('disabled');
    }
    return super.toggleAttribute(name, force);
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

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();

    // Clean up manager listener to prevent memory leaks
    if (this.manager instanceof UploadManager) {
      this.manager.removeEventListener('max-files-reached-changed', this.__syncFromManager);
      this.manager.removeEventListener('disabled-changed', this.__syncFromManager);
    }
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();

    // Re-attach manager listener when reconnected to DOM
    if (this.manager instanceof UploadManager) {
      this.manager.addEventListener('max-files-reached-changed', this.__syncFromManager);
      this.manager.addEventListener('disabled-changed', this.__syncFromManager);
    }
    this.__syncFromManager();
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
    const { fileInput } = this.$;

    // Set accept attribute from manager
    const accept = this.manager && this.manager.accept;
    if (accept) {
      fileInput.setAttribute('accept', accept);
    } else {
      fileInput.removeAttribute('accept');
    }

    // Set multiple attribute based on manager's maxFiles
    const maxFiles = this.manager && this.manager.maxFiles != null ? this.manager.maxFiles : Infinity;
    fileInput.multiple = maxFiles !== 1;

    // Set capture attribute
    if (this.capture) {
      fileInput.setAttribute('capture', this.capture);
    } else {
      fileInput.removeAttribute('capture');
    }
  }

  /** @private */
  __onFileInputChange(event) {
    const files = event.target.files;

    // If we have a manager, call addFiles
    if (this.manager instanceof UploadManager) {
      this.manager.addFiles(files);
    }
  }

  /** @private */
  __managerChanged(manager, oldManager) {
    // Remove listener from old manager
    if (oldManager instanceof UploadManager) {
      oldManager.removeEventListener('max-files-reached-changed', this.__syncFromManager);
      oldManager.removeEventListener('disabled-changed', this.__syncFromManager);
    }

    // Add listener to new manager and sync state only when connected
    if (this.isConnected && manager instanceof UploadManager) {
      manager.addEventListener('max-files-reached-changed', this.__syncFromManager);
      manager.addEventListener('disabled-changed', this.__syncFromManager);
      this.__syncFromManager();
    } else if (this.isConnected) {
      // No manager - reset state
      this.__syncFromManager();
    }
  }

  /** @private */
  get __effectiveDisabled() {
    const noManager = !(this.manager instanceof UploadManager);
    const managerDisabled = !noManager && this.manager.disabled;
    return this.__explicitDisabled || noManager || managerDisabled || this.maxFilesReached;
  }

  /** @private */
  __syncFromManager() {
    if (this.manager instanceof UploadManager) {
      this.maxFilesReached = this.manager.maxFilesReached;
    } else {
      this.maxFilesReached = false;
    }

    super.disabled = this.__effectiveDisabled;
  }

  /** @override */
  __shouldAllowFocusWhenDisabled() {
    return window.Vaadin.featureFlags.accessibleDisabledButtons;
  }
}

defineCustomElement(UploadButton);

export { UploadButton };
