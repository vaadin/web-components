/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-upload-file-list.js';
import { html, LitElement } from 'lit';
import { microTask } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-upload-file-list-box>` is a Web Component that displays a list of
 * uploaded files from a linked `<vaadin-upload>` component. It can be used
 * to show the file list in a different location than the upload component itself.
 *
 * The file list box can be linked to an upload component using the `for` attribute
 * (by ID) or by setting the `target` property directly.
 *
 * ```html
 * <vaadin-upload-file-list-box for="my-upload"></vaadin-upload-file-list-box>
 * <vaadin-upload id="my-upload"></vaadin-upload>
 * ```
 *
 * When linked to an upload, the file list box automatically:
 * - Syncs the files array from the upload
 * - Syncs the i18n object for localization
 * - Syncs the disabled state
 * - Forwards file-retry, file-abort, and file-start events to the upload
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ThemableMixin
 */
class UploadFileListBox extends ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))) {
  static get is() {
    return 'vaadin-upload-file-list-box';
  }

  static get styles() {
    return [];
  }

  static get properties() {
    return {
      /**
       * The id of the `<vaadin-upload>` element to link this file list to.
       * When linked, the file list displays the upload's files and forwards
       * file events back to the upload.
       * @attr {string} for
       */
      for: {
        type: String,
        observer: '__forChanged',
      },

      /**
       * Reference to the `<vaadin-upload>` element to link this file list to.
       * Can be set directly instead of using the `for` attribute.
       * @type {HTMLElement | null}
       */
      target: {
        type: Object,
        value: null,
        observer: '__targetChanged',
      },
    };
  }

  static get lumoInjector() {
    return { ...super.lumoInjector, includeBaseStyles: true };
  }

  constructor() {
    super();
    this.__onTargetFilesChanged = this.__onTargetFilesChanged.bind(this);
    this.__onTargetDisabledChanged = this.__onTargetDisabledChanged.bind(this);
    this.__onTargetUploadProgress = this.__onTargetUploadProgress.bind(this);
    this.__onFileRetry = this.__onFileRetry.bind(this);
    this.__onFileAbort = this.__onFileAbort.bind(this);
    this.__onFileStart = this.__onFileStart.bind(this);
  }

  /** @protected */
  ready() {
    super.ready();

    // Listen for file events to forward to the upload
    this.addEventListener('file-retry', this.__onFileRetry);
    this.addEventListener('file-abort', this.__onFileAbort);
    this.addEventListener('file-start', this.__onFileStart);
  }

  /** @protected */
  render() {
    return html`<vaadin-upload-file-list></vaadin-upload-file-list>`;
  }

  /** @private */
  get __fileList() {
    return this.shadowRoot?.querySelector('vaadin-upload-file-list');
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
      console.warn(`vaadin-upload-file-list-box: No element with id="${forId}" found on the page.`);
    }
  }

  /** @private */
  __targetChanged(target, oldTarget) {
    // Remove listeners from old target
    if (oldTarget) {
      oldTarget.removeEventListener('files-changed', this.__onTargetFilesChanged);
      oldTarget.removeEventListener('disabled-changed', this.__onTargetDisabledChanged);
      oldTarget.removeEventListener('upload-progress', this.__onTargetUploadProgress);
      oldTarget.removeEventListener('upload-success', this.__onTargetUploadProgress);
      oldTarget.removeEventListener('upload-error', this.__onTargetUploadProgress);
      oldTarget.removeEventListener('upload-start', this.__onTargetUploadProgress);
    }

    // Add listeners to new target
    if (target) {
      target.addEventListener('files-changed', this.__onTargetFilesChanged);
      target.addEventListener('disabled-changed', this.__onTargetDisabledChanged);
      // Listen for upload events to update file status
      target.addEventListener('upload-progress', this.__onTargetUploadProgress);
      target.addEventListener('upload-success', this.__onTargetUploadProgress);
      target.addEventListener('upload-error', this.__onTargetUploadProgress);
      target.addEventListener('upload-start', this.__onTargetUploadProgress);

      // Sync initial state
      this.__syncFromTarget();
    } else {
      // Clear the list when target is removed
      const fileList = this.__fileList;
      if (fileList) {
        fileList.items = [];
        fileList.i18n = undefined;
      }
    }
  }

  /** @private */
  __onTargetFilesChanged() {
    this.__syncFromTarget();
  }

  /** @private */
  __onTargetDisabledChanged() {
    if (this.target) {
      const fileList = this.__fileList;
      if (fileList) {
        fileList.disabled = this.target.disabled;
      }
    }
  }

  /** @private */
  __onTargetUploadProgress() {
    // Request content update when upload progress changes
    const fileList = this.__fileList;
    if (fileList && typeof fileList.requestContentUpdate === 'function') {
      fileList.requestContentUpdate();
    }
  }

  /** @private */
  __syncFromTarget() {
    const fileList = this.__fileList;
    if (this.target && fileList) {
      fileList.items = [...this.target.files];
      fileList.i18n = this.target.i18n;
      fileList.disabled = this.target.disabled;
    }
  }

  /** @private */
  __onFileRetry(event) {
    if (this.target) {
      // Stop propagation to prevent double handling
      event.stopPropagation();
      // Dispatch new event on the upload
      this.target.dispatchEvent(
        new CustomEvent('file-retry', {
          detail: event.detail,
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  /** @private */
  __onFileAbort(event) {
    if (this.target) {
      event.stopPropagation();
      this.target.dispatchEvent(
        new CustomEvent('file-abort', {
          detail: event.detail,
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  /** @private */
  __onFileStart(event) {
    if (this.target) {
      event.stopPropagation();
      this.target.dispatchEvent(
        new CustomEvent('file-start', {
          detail: event.detail,
          bubbles: true,
          composed: true,
        }),
      );
    }
  }
}

defineCustomElement(UploadFileListBox);

export { UploadFileListBox };
