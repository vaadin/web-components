/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-upload-file-list.js';
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-upload-file-list-box>` is a Web Component that displays a list of
 * uploaded files. It can be linked to an UploadManager to automatically
 * sync files and forward events.
 *
 * ```javascript
 * const listBox = document.querySelector('vaadin-upload-file-list-box');
 * listBox.target = manager;
 *
 * // The list box automatically:
 * // - Syncs files from the manager
 * // - Forwards retry/abort/start events back to the manager
 * ```
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ThemableMixin
 */
class UploadFileListBox extends ThemableMixin(PolylitMixin(LitElement)) {
  static get is() {
    return 'vaadin-upload-file-list-box';
  }

  static get properties() {
    return {
      /**
       * Reference to an UploadManager to link this file list to.
       * @type {Object | null}
       */
      target: {
        type: Object,
        value: null,
        observer: '__targetChanged',
      },

      /**
       * The i18n object for localization.
       * @type {Object}
       */
      i18n: {
        type: Object,
        value: () => ({
          file: {
            retry: 'Retry',
            start: 'Start',
            remove: 'Remove',
          },
          error: {
            tooManyFiles: 'Too Many Files.',
            fileIsTooBig: 'File is Too Big.',
            incorrectFileType: 'Incorrect File Type.',
          },
          uploading: {
            status: {
              connecting: 'Connecting...',
              stalled: 'Stalled',
              processing: 'Processing File...',
              held: 'Queued',
            },
            remainingTime: {
              prefix: 'remaining time: ',
              unknown: 'unknown remaining time',
            },
            error: {
              serverUnavailable: 'Upload failed, please try again later',
              unexpectedServerError: 'Upload failed due to server error',
              forbidden: 'Upload forbidden',
            },
          },
          units: {
            size: ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
          },
        }),
      },
    };
  }

  constructor() {
    super();
    this.__onTargetFilesChanged = this.__onTargetFilesChanged.bind(this);
    this.__onFileRetry = this.__onFileRetry.bind(this);
    this.__onFileAbort = this.__onFileAbort.bind(this);
    this.__onFileStart = this.__onFileStart.bind(this);
    this.__onFileRemove = this.__onFileRemove.bind(this);
  }

  /** @protected */
  ready() {
    super.ready();

    // Listen for file events to forward to the manager
    this.addEventListener('file-retry', this.__onFileRetry);
    this.addEventListener('file-abort', this.__onFileAbort);
    this.addEventListener('file-start', this.__onFileStart);
    this.addEventListener('file-remove', this.__onFileRemove);
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
  __targetChanged(target, oldTarget) {
    // Remove listeners from old target
    if (oldTarget) {
      oldTarget.removeEventListener('files-changed', this.__onTargetFilesChanged);
    }

    // Add listeners to new target
    if (target) {
      target.addEventListener('files-changed', this.__onTargetFilesChanged);

      // Sync initial state
      this.__syncFromTarget();
    } else {
      // Clear the list when target is removed
      const fileList = this.__fileList;
      if (fileList) {
        fileList.items = [];
      }
    }
  }

  /** @private */
  __onTargetFilesChanged() {
    this.__syncFromTarget();
  }

  /** @private */
  __syncFromTarget() {
    const fileList = this.__fileList;
    if (this.target && fileList) {
      fileList.items = [...this.target.files];
      fileList.i18n = this.i18n;
    }
  }

  /** @private */
  __onFileRetry(event) {
    if (this.target && typeof this.target.retryUpload === 'function') {
      event.stopPropagation();
      this.target.retryUpload(event.detail.file);
    }
  }

  /** @private */
  __onFileAbort(event) {
    if (this.target && typeof this.target.abortUpload === 'function') {
      event.stopPropagation();
      this.target.abortUpload(event.detail.file);
    }
  }

  /** @private */
  __onFileStart(event) {
    if (this.target && typeof this.target.uploadFiles === 'function') {
      event.stopPropagation();
      this.target.uploadFiles(event.detail.file);
    }
  }

  /** @private */
  __onFileRemove(event) {
    if (this.target && typeof this.target.removeFile === 'function') {
      event.stopPropagation();
      this.target.removeFile(event.detail.file);
    }
  }
}

defineCustomElement(UploadFileListBox);

export { UploadFileListBox };
