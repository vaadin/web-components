/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, render } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { I18nMixin } from '@vaadin/component-base/src/i18n-mixin.js';
import { updateFileStatus } from './vaadin-upload-helpers.js';
import { UploadManager } from './vaadin-upload-manager.js';

export const DEFAULT_I18N = {
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
      fileTooLarge: 'File is too large',
    },
  },
  units: {
    size: ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
  },
};

export const UploadFileListMixin = (superClass) =>
  class UploadFileListMixin extends I18nMixin(superClass) {
    static get properties() {
      return {
        /**
         * The array of files being processed, or already uploaded.
         * @readonly
         */
        items: {
          type: Array,
        },

        /**
         * If true, the user cannot interact with this element.
         */
        disabled: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
        },

        /**
         * Reference to an UploadManager to link this file list to.
         * When set, the file list automatically:
         * - Syncs files from the manager
         * - Forwards retry/abort/start/remove events back to the manager
         * @type {Object | null}
         */
        manager: {
          type: Object,
          value: null,
          observer: '__managerChanged',
        },
      };
    }

    static get observers() {
      return ['__updateItems(items, __effectiveI18n, disabled, _theme)'];
    }

    static get defaultI18n() {
      return DEFAULT_I18N;
    }

    /**
     * The object used to localize this component.
     * To change the default localization, replace this with an object
     * that provides all properties, or just the individual properties
     * you want to change.
     *
     * The object has the following JSON structure and default values:
     * ```js
     * {
     *   file: {
     *     retry: 'Retry',
     *     start: 'Start',
     *     remove: 'Remove'
     *   },
     *   error: {
     *     tooManyFiles: 'Too Many Files.',
     *     fileIsTooBig: 'File is Too Big.',
     *     incorrectFileType: 'Incorrect File Type.'
     *   },
     *   uploading: {
     *     status: {
     *       connecting: 'Connecting...',
     *       stalled: 'Stalled',
     *       processing: 'Processing File...',
     *       held: 'Queued'
     *     },
     *     remainingTime: {
     *       prefix: 'remaining time: ',
     *       unknown: 'unknown remaining time'
     *     },
     *     error: {
     *       serverUnavailable: 'Upload failed, please try again later',
     *       unexpectedServerError: 'Upload failed due to server error',
     *       forbidden: 'Upload forbidden',
     *       fileTooLarge: 'File is too large'
     *     }
     *   },
     *   units: {
     *     size: ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
     *   }
     * }
     * ```
     * @type {!UploadFileListI18n}
     */
    get i18n() {
      return super.i18n;
    }

    set i18n(value) {
      super.i18n = value;
    }

    constructor() {
      super();
      this.__onManagerFilesChanged = this.__onManagerFilesChanged.bind(this);
      this.__onManagerDisabledChanged = this.__onManagerDisabledChanged.bind(this);
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
    disconnectedCallback() {
      super.disconnectedCallback();

      // Clean up manager listener to prevent memory leaks
      if (this.manager instanceof UploadManager) {
        this.manager.removeEventListener('files-changed', this.__onManagerFilesChanged);
        this.manager.removeEventListener('disabled-changed', this.__onManagerDisabledChanged);
      }
    }

    /** @protected */
    connectedCallback() {
      super.connectedCallback();

      // Re-attach manager listener when reconnected to DOM
      if (this.manager instanceof UploadManager) {
        this.manager.addEventListener('files-changed', this.__onManagerFilesChanged);
        this.manager.addEventListener('disabled-changed', this.__onManagerDisabledChanged);

        // Sync state with current manager
        this.__syncFromManager();
      }
    }

    /** @private */
    __managerChanged(manager, oldManager) {
      // Remove listeners from old manager
      if (oldManager instanceof UploadManager) {
        oldManager.removeEventListener('files-changed', this.__onManagerFilesChanged);
        oldManager.removeEventListener('disabled-changed', this.__onManagerDisabledChanged);
      }

      // Add listeners to new manager only when connected
      if (this.isConnected && manager instanceof UploadManager) {
        manager.addEventListener('files-changed', this.__onManagerFilesChanged);
        manager.addEventListener('disabled-changed', this.__onManagerDisabledChanged);

        // Sync initial state
        this.__syncFromManager();
      } else {
        // Clear the list when manager is removed
        this.items = [];
      }
    }

    /** @private */
    __onManagerFilesChanged() {
      this.__syncFromManager();
    }

    /** @private */
    __onManagerDisabledChanged() {
      this.requestContentUpdate();
    }

    /** @private */
    __syncFromManager() {
      if (this.manager instanceof UploadManager) {
        this.items = [...this.manager.files];
      }
    }

    /** @private */
    __onFileRetry(event) {
      if (this.manager instanceof UploadManager) {
        event.stopPropagation();
        this.manager.retryUpload(event.detail.file);
      }
    }

    /** @private */
    __onFileAbort(event) {
      if (this.manager instanceof UploadManager) {
        event.stopPropagation();
        this.manager.abortUpload(event.detail.file);
      }
    }

    /** @private */
    __onFileStart(event) {
      if (this.manager instanceof UploadManager) {
        event.stopPropagation();
        this.manager.uploadFiles(event.detail.file);
      }
    }

    /** @private */
    __onFileRemove(event) {
      if (this.manager instanceof UploadManager) {
        event.stopPropagation();
        this.manager.removeFile(event.detail.file);
      }
    }

    /** @private */
    __updateItems(items, i18n, _disabled, _theme) {
      if (items && i18n) {
        // Apply i18n formatting to each file
        items.forEach((file) => this.__applyI18nToFile(file));
        this.requestContentUpdate();
      }
    }

    /** @private */
    __applyI18nToFile(file) {
      const i18n = this.__effectiveI18n;

      // Apply size and status strings based on file state
      updateFileStatus(file, i18n, { indeterminateFirst: true });

      // Translate error codes to i18n messages
      this.__applyFileError(file, i18n);
    }

    /** @private */
    __applyFileError(file, i18n) {
      if (file.errorKey && i18n.uploading.error[file.errorKey]) {
        file.error = i18n.uploading.error[file.errorKey];
      } else if (!file.errorKey && this.manager instanceof UploadManager) {
        // Clear error when errorKey is reset (e.g., on retry) only when using manager
        file.error = '';
      }
    }

    /** @private */
    requestContentUpdate() {
      const { items, __effectiveI18n: i18n, disabled } = this;
      if (!items || !i18n) {
        return;
      }

      const managerDisabled = this.manager instanceof UploadManager && this.manager.disabled;
      const effectiveDisabled = disabled || managerDisabled;

      render(
        html`
          ${items.map(
            (file) => html`
              <li>
                <vaadin-upload-file
                  .disabled="${effectiveDisabled}"
                  .file="${file}"
                  .complete="${file.complete}"
                  .errorMessage="${file.error}"
                  .fileName="${file.name}"
                  .held="${file.held}"
                  .indeterminate="${file.indeterminate}"
                  .progress="${file.progress}"
                  .status="${file.status}"
                  .uploading="${file.uploading}"
                  .i18n="${i18n}"
                  theme="${ifDefined(this._theme)}"
                ></vaadin-upload-file>
              </li>
            `,
          )}
        `,
        this,
      );
    }
  };
