/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { microTask } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-upload-add-button>` is a Web Component that can be used as an external
 * add button for `<vaadin-upload>`. When clicked, it opens a file picker dialog
 * and adds the selected files to the linked upload component.
 *
 * The add button can be linked to an upload component using the `for` attribute
 * (by ID) or by setting the `target` property directly.
 *
 * ```html
 * <vaadin-upload-add-button for="my-upload">
 *   Choose files
 * </vaadin-upload-add-button>
 * <vaadin-upload id="my-upload"></vaadin-upload>
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
 * `disabled`  | Set when max files reached or upload is disabled
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ThemableMixin
 */
class UploadAddButton extends ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))) {
  static get is() {
    return 'vaadin-upload-add-button';
  }

  static get styles() {
    return [];
  }

  static get properties() {
    return {
      /**
       * The id of the `<vaadin-upload>` element to link this add button to.
       * When the button is clicked, it opens a file picker and adds the
       * selected files to the linked upload component.
       * @attr {string} for
       */
      for: {
        type: String,
        observer: '__forChanged',
      },

      /**
       * Reference to the `<vaadin-upload>` element to link this add button to.
       * Can be set directly instead of using the `for` attribute.
       * @type {HTMLElement | null}
       */
      target: {
        type: Object,
        value: null,
        observer: '__targetChanged',
      },

      /**
       * When true, the button is disabled and cannot be clicked.
       * This is automatically set when the linked upload's maxFilesReached
       * property is true or when the upload is disabled.
       * @type {boolean}
       */
      disabled: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },
    };
  }

  static get lumoInjector() {
    return { ...super.lumoInjector, includeBaseStyles: true };
  }

  constructor() {
    super();
    this.__onTargetMaxFilesReachedChanged = this.__onTargetMaxFilesReachedChanged.bind(this);
    this.__onTargetDisabledChanged = this.__onTargetDisabledChanged.bind(this);
  }

  /** @protected */
  ready() {
    super.ready();

    // Create a hidden file input
    this.__fileInput = document.createElement('input');
    this.__fileInput.type = 'file';
    this.__fileInput.style.display = 'none';
    this.__fileInput.addEventListener('change', this.__onFileInputChange.bind(this));
    this.shadowRoot.appendChild(this.__fileInput);

    this.addEventListener('click', this.__onClick.bind(this));
    this.addEventListener('touchend', this.__onTouchEnd.bind(this));

    // Make it focusable
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }

    // Handle keyboard activation
    this.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.__openFilePicker();
      }
    });
  }

  /** @protected */
  render() {
    return html`<slot></slot>`;
  }

  /** @private */
  __forChanged(forId) {
    if (forId) {
      this.__setTargetByIdDebouncer = Debouncer.debounce(this.__setTargetByIdDebouncer, microTask, () =>
        this.__setTargetById(forId),
      );
    } else {
      this.target = null;
    }
  }

  /** @private */
  __setTargetById(forId) {
    if (!this.isConnected) {
      return;
    }

    const target = this.getRootNode().getElementById(forId);

    if (target) {
      this.target = target;
    } else {
      console.warn(`vaadin-upload-add-button: No element with id="${forId}" found on the page.`);
    }
  }

  /** @private */
  __targetChanged(target, oldTarget) {
    // Remove listeners from old target
    if (oldTarget) {
      oldTarget.removeEventListener('max-files-reached-changed', this.__onTargetMaxFilesReachedChanged);
      oldTarget.removeEventListener('disabled-changed', this.__onTargetDisabledChanged);
    }

    // Add listeners to new target
    if (target) {
      target.addEventListener('max-files-reached-changed', this.__onTargetMaxFilesReachedChanged);
      target.addEventListener('disabled-changed', this.__onTargetDisabledChanged);

      // Sync initial state
      this.__updateDisabledState();
      this.__updateFileInputAttributes();
    }
  }

  /** @private */
  __onTargetMaxFilesReachedChanged() {
    this.__updateDisabledState();
  }

  /** @private */
  __onTargetDisabledChanged() {
    this.__updateDisabledState();
  }

  /** @private */
  __updateDisabledState() {
    if (this.target) {
      this.disabled = this.target.maxFilesReached || this.target.disabled;
    }
  }

  /** @private */
  __updateFileInputAttributes() {
    if (this.target && this.__fileInput) {
      // Sync accept attribute
      if (this.target.accept) {
        this.__fileInput.accept = this.target.accept;
      } else {
        this.__fileInput.removeAttribute('accept');
      }

      // Sync multiple attribute based on maxFiles
      this.__fileInput.multiple = this.target.maxFiles !== 1;

      // Sync capture attribute
      if (this.target.capture) {
        this.__fileInput.capture = this.target.capture;
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
    this.__openFilePicker();
  }

  /** @private */
  __onTouchEnd(event) {
    // Cancel the event to avoid the following click event
    event.preventDefault();
    this.__onClick(event);
  }

  /** @private */
  __openFilePicker() {
    if (this.disabled || !this.target) {
      return;
    }

    // Update file input attributes before opening
    this.__updateFileInputAttributes();

    this.__fileInput.value = '';
    this.__fileInput.click();
  }

  /** @private */
  __onFileInputChange(event) {
    if (this.target && typeof this.target.addFiles === 'function') {
      this.target.addFiles(event.target.files);
    }
  }
}

defineCustomElement(UploadAddButton);

export { UploadAddButton };
