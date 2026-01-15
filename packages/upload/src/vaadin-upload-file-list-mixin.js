/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, render } from 'lit';
import { UploadManager } from './vaadin-upload-manager.js';

const DEFAULT_I18N = {
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
};

/**
 * @polymerMixin
 */
export const UploadFileListMixin = (superClass) =>
  class UploadFileListMixin extends superClass {
    static get properties() {
      return {
        /**
         * The array of files being processed, or already uploaded.
         */
        items: {
          type: Array,
        },

        /**
         * The object used to localize upload files.
         */
        i18n: {
          type: Object,
          value: () => DEFAULT_I18N,
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
      return ['__updateItems(items, i18n, disabled)'];
    }

    constructor() {
      super();
      this.__onManagerFilesChanged = this.__onManagerFilesChanged.bind(this);
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
      }
    }

    /** @protected */
    connectedCallback() {
      super.connectedCallback();

      // Re-attach manager listener when reconnected to DOM
      if (this.manager instanceof UploadManager) {
        this.manager.addEventListener('files-changed', this.__onManagerFilesChanged);

        // Sync state with current manager files
        this.__syncFromManager();
      }
    }

    /** @private */
    __managerChanged(manager, oldManager) {
      // Remove listeners from old manager
      if (oldManager instanceof UploadManager) {
        oldManager.removeEventListener('files-changed', this.__onManagerFilesChanged);
      }

      // Add listeners to new manager only when connected
      if (this.isConnected && manager instanceof UploadManager) {
        manager.addEventListener('files-changed', this.__onManagerFilesChanged);

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
    __syncFromManager() {
      if (this.manager instanceof UploadManager) {
        const files = [...this.manager.files];
        // Apply i18n formatting to each file
        files.forEach((file) => this.__applyI18nToFile(file));
        this.items = files;
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
    __updateItems(items, i18n) {
      if (items && i18n) {
        // Apply i18n formatting to each file
        items.forEach((file) => this.__applyI18nToFile(file));
        this.requestContentUpdate();
      }
    }

    // ============ I18n formatting ============

    /** @private */
    __applyI18nToFile(file) {
      const i18n = this.i18n;

      // Always set size-related strings when total is available
      if (file.total) {
        file.totalStr = this.__formatSize(file.total);
        file.loadedStr = this.__formatSize(file.loaded || 0);
        if (file.elapsed != null) {
          file.elapsedStr = this.__formatTime(file.elapsed, this.__splitTimeByUnits(file.elapsed));
        }
        if (file.remaining != null) {
          file.remainingStr = this.__formatTime(file.remaining, this.__splitTimeByUnits(file.remaining));
        }
      }

      // Apply status messages based on file state
      if (file.held && !file.error) {
        // File is queued and waiting
        file.status = i18n.uploading.status.held;
      } else if (file.stalled) {
        // File upload is stalled
        file.status = i18n.uploading.status.stalled;
      } else if (file.uploading && file.indeterminate && !file.held) {
        // File is uploading but progress is indeterminate (connecting or processing)
        if (file.progress === 100) {
          file.status = i18n.uploading.status.processing;
        } else {
          file.status = i18n.uploading.status.connecting;
        }
      } else if (file.uploading && file.progress < 100 && file.total) {
        // File is uploading with known progress
        file.status = this.__formatFileProgress(file);
      }

      // Translate error codes to i18n messages
      if (file.errorKey && i18n.uploading.error[file.errorKey]) {
        file.error = i18n.uploading.error[file.errorKey];
      } else if (!file.errorKey && this.manager instanceof UploadManager) {
        // Clear error when errorKey is reset (e.g., on retry) only when using manager
        file.error = '';
      }
    }

    /** @private */
    __formatSize(bytes) {
      const i18n = this.i18n;
      if (typeof i18n.formatSize === 'function') {
        return i18n.formatSize(bytes);
      }

      // https://wiki.ubuntu.com/UnitsPolicy
      const base = i18n.units.sizeBase || 1000;
      const unit = ~~(Math.log(bytes) / Math.log(base));
      const dec = Math.max(0, Math.min(3, unit - 1));
      const size = parseFloat((bytes / base ** unit).toFixed(dec));
      return `${size} ${i18n.units.size[unit]}`;
    }

    /** @private */
    __splitTimeByUnits(time) {
      const unitSizes = [60, 60, 24, Infinity];
      const timeValues = [0];

      for (let i = 0; i < unitSizes.length && time > 0; i++) {
        timeValues[i] = time % unitSizes[i];
        time = Math.floor(time / unitSizes[i]);
      }

      return timeValues;
    }

    /** @private */
    __formatTime(seconds, split) {
      const i18n = this.i18n;
      if (typeof i18n.formatTime === 'function') {
        return i18n.formatTime(seconds, split);
      }

      // Fill HH:MM:SS with leading zeros
      while (split.length < 3) {
        split.push(0);
      }

      return split
        .reverse()
        .map((number) => {
          return (number < 10 ? '0' : '') + number;
        })
        .join(':');
    }

    /** @private */
    __formatFileProgress(file) {
      const i18n = this.i18n;
      const remainingTime =
        file.loaded > 0
          ? i18n.uploading.remainingTime.prefix + file.remainingStr
          : i18n.uploading.remainingTime.unknown;

      return `${file.totalStr}: ${file.progress}% (${remainingTime})`;
    }

    /**
     * Requests an update for the `vaadin-upload-file` elements.
     *
     * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
     */
    requestContentUpdate() {
      const { items, i18n, disabled } = this;

      render(
        html`
          ${items.map(
            (file) => html`
              <li>
                <vaadin-upload-file
                  .disabled="${disabled}"
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
                ></vaadin-upload-file>
              </li>
            `,
          )}
        `,
        this,
      );
    }
  };
