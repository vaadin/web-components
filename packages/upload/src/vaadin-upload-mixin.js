/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { announce } from '@vaadin/a11y-base/src/announce.js';
import { isKeyboardActive } from '@vaadin/a11y-base/src/focus-utils.js';
import { isTouch } from '@vaadin/component-base/src/browser-utils.js';
import { setOrRemoveAttribute } from '@vaadin/component-base/src/dom-utils.js';
import { I18nMixin } from '@vaadin/component-base/src/i18n-mixin.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';
import { DEFAULT_I18N as FILE_LIST_DEFAULT_I18N } from './vaadin-upload-file-list-mixin.js';
import { getFilesFromDropEvent, translateErrorKey, updateFileStatus } from './vaadin-upload-helpers.js';
import { UploadManager } from './vaadin-upload-manager.js';

/**
 * The `headers` property also supports a JSON string, while the manager only
 * accepts an object, so strings are parsed. An invalid JSON string parses to
 * undefined, which throws when the request is configured.
 * @private
 */
function parseHeaders(headers) {
  if (typeof headers !== 'string') {
    return headers;
  }
  try {
    return JSON.parse(headers);
  } catch (_) {
    return undefined;
  }
}

// The manager configuration derived from the component properties. Each entry
// is defined as a getter on `InternalUploadManager`, so that the manager reads
// the current value whenever it needs it. This way configuration changed by an
// `upload-before` listener (e.g. headers with a fresh auth token) applies to
// the request being started, like it historically did.
//
// `formDataName` is not included: the `upload-before` listener assigns it to
// the file when the upload starts, like the component has historically done.
const MANAGER_CONFIG = {
  // Fall back to an empty string, which means that window.location will be
  // used, also when the property is set to null
  target: (host) => host.target || '',
  // Unlike the manager, the component passes an unsupported method to the
  // request as-is instead of throwing
  method: (host) => host.method,
  headers: (host) => parseHeaders(host.headers),
  timeout: (host) => host.timeout,
  noAuto: (host) => host.noAuto,
  withCredentials: (host) => host.withCredentials,
  uploadFormat: (host) => host.uploadFormat,
  // Unlike the manager, the component pauses uploads on a non-positive value
  // instead of throwing
  maxConcurrentUploads: (host) => host.maxConcurrentUploads,
  // Unlike the manager, the component treats a negative value as no limit
  maxFiles: (host) => (host.maxFiles < 0 ? Infinity : host.maxFiles),
  maxFileSize: (host) => host.maxFileSize,
  accept: (host) => host.accept,
};

export const DEFAULT_I18N = {
  dropFiles: {
    one: 'Drop file here',
    many: 'Drop files here',
  },
  addFiles: {
    one: 'Upload File...',
    many: 'Upload Files...',
  },
  error: FILE_LIST_DEFAULT_I18N.error,
  uploading: FILE_LIST_DEFAULT_I18N.uploading,
  file: FILE_LIST_DEFAULT_I18N.file,
  units: FILE_LIST_DEFAULT_I18N.units,
};

/**
 * An `UploadManager` subclass used internally by `<vaadin-upload>`. It
 * overrides the manager behavior where the component behavior that predates
 * the manager integration differs from the standalone manager.
 */
class InternalUploadManager extends UploadManager {
  constructor(host) {
    super();
    this.__host = host;
  }

  /**
   * Override accessor from `UploadManager` to accept assigned files as-is,
   * without validating them against the maxFiles, maxFileSize and accept
   * constraints, e.g. to show previously uploaded files.
   * @override
   */
  get files() {
    return super.files;
  }

  set files(files) {
    this._setFiles([...files]);
  }

  /**
   * Start the upload of the given file, even if it is already complete, in
   * which case it is uploaded again from scratch. A file that is already
   * uploading or queued is ignored.
   * @param {UploadFile} file
   */
  startUpload(file) {
    this._queueFileUpload(file);
  }

  /**
   * Override method from `UploadManager` to not restart the upload of a
   * file that is already uploading or queued, like the component
   * historically does; only the `upload-retry` event is dispatched.
   * @override
   */
  retryUpload(file) {
    const evt = this.dispatchEvent(
      new CustomEvent('upload-retry', {
        detail: { file, xhr: file.xhr },
        cancelable: true,
      }),
    );
    if (evt) {
      this._queueFileUpload(file);
    }
  }

  /**
   * Override method from `UploadManager` to treat all files as managed:
   * files that are not in the `files` list are uploaded without being added
   * to it, and removing a file in an `upload-before` or `upload-request`
   * listener does not cancel its upload.
   * @override
   */
  _isFileManaged(_file) {
    return true;
  }

  /**
   * Override method from `UploadManager` to leave the state of a file whose
   * `upload-before` or `upload-request` event was prevented untouched, so
   * that the preventing listener can take over the request (e.g. send the
   * xhr manually). The upload slot stays taken until the taken-over request
   * completes.
   * @override
   */
  _holdFile(_file) {
    // The listener that prevented the upload is expected to take it over
  }

  /**
   * Override method from `UploadManager` to keep the progress properties of
   * the previous upload attempt until a new upload progresses.
   * @override
   */
  _resetFileProgress(_file) {
    // Progress is only updated by upload progress events
  }

  /**
   * Override method from `UploadManager` to keep the last request available
   * on the file after the upload has finished, e.g. in the `upload-retry`
   * event detail.
   * @override
   */
  _clearFileXhr(_file) {
    // The request reference is kept on the file
  }

  /**
   * Override method from `UploadManager` to also free upload capacity for
   * other queued files when a file is removed.
   * @override
   */
  _removeFile(file) {
    super._removeFile(file);
    this._processUploadQueue();
  }
}

// Define the configuration properties as getters that read the current value
// from the host component. The setters are no-ops so that the assignments in
// the `UploadManager` constructor are ignored.
Object.entries(MANAGER_CONFIG).forEach(([prop, getValue]) => {
  Object.defineProperty(InternalUploadManager.prototype, prop, {
    get() {
      return getValue(this.__host);
    },
    set(_value) {},
  });
});

export const UploadMixin = (superClass) =>
  class UploadMixin extends I18nMixin(superClass) {
    static get properties() {
      return {
        /**
         * If true, the user cannot interact with this element.
         */
        disabled: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
        },

        /**
         * Define whether the element supports dropping files on it for uploading.
         * By default it's enabled in desktop and disabled in touch devices
         * because mobile devices do not support drag events in general. Setting
         * it false means that drop is enabled even in touch-devices, and true
         * disables drop in all devices.
         *
         * @default true in touch-devices, false otherwise.
         */
        nodrop: {
          type: Boolean,
          reflectToAttribute: true,
          value: isTouch,
        },

        /**
         * The server URL. The default value is an empty string, which means that
         * _window.location_ will be used.
         */
        target: {
          type: String,
          value: '',
        },

        /**
         * HTTP Method used to send the files. Only POST and PUT are allowed.
         */
        method: {
          type: String,
          value: 'POST',
        },

        /**
         * Key-Value map to send to the server. If you set this property as an
         * attribute, use a valid JSON string, for example:
         * ```html
         * <vaadin-upload headers='{"X-Foo": "Bar"}'></vaadin-upload>
         * ```
         * @type {object | string}
         */
        headers: {
          type: Object,
          value: {},
        },

        /**
         * Max time in milliseconds for the entire upload process, if exceeded the
         * request will be aborted. Zero means that there is no timeout.
         */
        timeout: {
          type: Number,
          value: 0,
        },

        /** @private */
        _dragover: {
          type: Boolean,
          value: false,
          observer: '_dragoverChanged',
        },

        /**
         * The array of files being processed, or already uploaded.
         *
         * Each element is a [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File)
         * object with a number of extra properties  to track the upload process:
         * - `uploadTarget`: The target URL used to upload this file.
         * - `elapsed`: Elapsed time since the upload started.
         * - `elapsedStr`: Human-readable elapsed time.
         * - `remaining`: Number of seconds remaining for the upload to finish.
         * - `remainingStr`: Human-readable remaining time for the upload to finish.
         * - `progress`: Percentage of the file already uploaded.
         * - `speed`: Upload speed in kB/s.
         * - `size`: File size in bytes.
         * - `totalStr`: Human-readable total size of the file.
         * - `loaded`: Bytes transferred so far.
         * - `loadedStr`: Human-readable uploaded size at the moment.
         * - `status`: Status of the upload process.
         * - `error`: Error message in case the upload failed.
         * - `abort`: True if the file was canceled by the user.
         * - `complete`: True when the file was transferred to the server.
         * - `uploading`: True while transferring data to the server.
         * @type {!Array<!UploadFile>}
         */
        files: {
          type: Array,
          notify: true,
          value: () => [],
          sync: true,
          observer: '__filesChanged',
        },

        /**
         * Limit of files to upload, by default it is unlimited. If the value is
         * set to one, native file browser will prevent selecting multiple files.
         * @attr {number} max-files
         */
        maxFiles: {
          type: Number,
          value: Infinity,
          sync: true,
        },

        /**
         * Specifies if the maximum number of files have been uploaded
         * @attr {boolean} max-files-reached
         */
        maxFilesReached: {
          type: Boolean,
          value: false,
          notify: true,
          readOnly: true,
          reflectToAttribute: true,
        },

        /**
         * Specifies the types of files that the server accepts.
         * Syntax: a comma-separated list of MIME type patterns (wildcards are
         * allowed) or file extensions.
         * Notice that MIME types are widely supported, while file extensions
         * are only implemented in certain browsers, so avoid using it.
         * Example: accept="video/*,image/tiff" or accept=".pdf,audio/mp3"
         */
        accept: {
          type: String,
          value: '',
        },

        /**
         * Specifies the maximum file size in bytes allowed to upload.
         * Notice that it is a client-side constraint, which will be checked before
         * sending the request. Obviously you need to do the same validation in
         * the server-side and be sure that they are aligned.
         * @attr {number} max-file-size
         */
        maxFileSize: {
          type: Number,
          value: Infinity,
        },

        /**
         * Specifies if the dragover is validated with maxFiles and
         * accept properties.
         * @private
         */
        _dragoverValid: {
          type: Boolean,
          value: false,
          observer: '_dragoverValidChanged',
        },

        /**
         * Specifies the 'name' property at Content-Disposition for multipart uploads.
         * This property is ignored when uploadFormat is 'raw'.
         * @attr {string} form-data-name
         */
        formDataName: {
          type: String,
          value: 'file',
        },

        /**
         * Prevents upload(s) from immediately uploading upon adding file(s).
         * When set, you must manually trigger uploads using the `uploadFiles` method
         * @attr {boolean} no-auto
         */
        noAuto: {
          type: Boolean,
          value: false,
        },

        /**
         * Set the withCredentials flag on the request.
         * @attr {boolean} with-credentials
         */
        withCredentials: {
          type: Boolean,
          value: false,
        },

        /**
         * Specifies the upload format to use when sending files to the server.
         * - 'raw': Send file as raw binary data with the file's MIME type as Content-Type (default)
         * - 'multipart': Send file using multipart/form-data encoding
         * @attr {string} upload-format
         */
        uploadFormat: {
          type: String,
          value: 'raw',
        },

        /**
         * Specifies the maximum number of files that can be uploaded simultaneously.
         * This helps prevent browser performance degradation and XHR limitations when
         * uploading large numbers of files. Files exceeding this limit will be queued
         * and uploaded as active uploads complete.
         * @attr {number} max-concurrent-uploads
         */
        maxConcurrentUploads: {
          type: Number,
          value: 3,
          sync: true,
        },

        /**
         * Pass-through to input's capture attribute. Allows user to trigger device inputs
         * such as camera or microphone immediately.
         */
        capture: {
          type: String,
        },

        /** @private */
        _addButton: {
          type: Object,
        },

        /** @private */
        _dropLabel: {
          type: Object,
        },

        /** @private */
        _fileList: {
          type: Object,
        },
      };
    }

    static get observers() {
      return [
        '__updateMaxFilesReached(maxFiles, files)',
        '__updateAddButton(_addButton, maxFiles, __effectiveI18n, maxFilesReached, disabled)',
        '__updateDropLabel(_dropLabel, maxFiles, __effectiveI18n)',
        '__updateFileList(_fileList, files, __effectiveI18n, disabled, _theme)',
      ];
    }

    static get defaultI18n() {
      return DEFAULT_I18N;
    }

    /**
     * The object used to localize this component. To change the default
     * localization, replace this with an object that provides all properties, or
     * just the individual properties you want to change.
     *
     * The object has the following JSON structure and default values:
     *
     * ```js
     * {
     *   dropFiles: {
     *     one: 'Drop file here',
     *     many: 'Drop files here'
     *   },
     *   addFiles: {
     *     one: 'Upload File...',
     *     many: 'Upload Files...'
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
     *   file: {
     *     retry: 'Retry',
     *     start: 'Start',
     *     remove: 'Remove'
     *   },
     *   units: {
     *     size: ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
     *     sizeBase: 1000
     *   },
     *   formatSize: function(bytes) {
     *     // returns the size followed by the best suitable unit
     *   },
     *   formatTime: function(seconds, [secs, mins, hours]) {
     *     // returns a 'HH:MM:SS' string
     *   }
     * }
     * ```
     * @type {!UploadI18n}
     */
    get i18n() {
      return super.i18n;
    }

    set i18n(value) {
      super.i18n = value;
    }

    constructor() {
      super();

      // Create the internal upload manager, which reads its configuration
      // from this component
      this._manager = new InternalUploadManager(this);

      // Files that are uploaded without being added to the `files` list
      // (e.g. passed directly to `uploadFiles`)
      this.__externalFiles = new Set();
    }

    /** @protected */
    ready() {
      super.ready();

      // Set up manager event listeners
      this._manager.addEventListener('files-changed', (e) => this.__onManagerFilesChanged(e));
      this._manager.addEventListener('file-reject', (e) => this.__onManagerFileReject(e));
      this._manager.addEventListener('file-remove', (e) => this.__onManagerFileRemove(e));
      this._manager.addEventListener('upload-success', (e) => this.__onManagerUploadSuccess(e));
      this._manager.addEventListener('upload-error', (e) => this.__onManagerUploadError(e));
      this._manager.addEventListener('upload-retry', (e) => this.__onManagerUploadRetry(e));
      this._manager.addEventListener('upload-before', (e) => {
        // The manager assigns formDataName when a file is added, but the
        // component has historically assigned it when the upload starts, so
        // that later changes to the property also apply to files that were
        // already added. Listeners of the redispatched event can still
        // override the value before the request body is created.
        if (this.uploadFormat !== 'raw') {
          e.detail.file.formDataName = this.formDataName;
        }
        this.__redispatchEvent(e);
        if (!e.defaultPrevented && typeof this.headers === 'string') {
          // The component has historically parsed a headers JSON string into
          // the property when an upload starts, after the upload-before
          // listeners have run
          this.headers = parseHeaders(this.headers);
        }
      });
      this._manager.addEventListener('upload-progress', (e) => {
        this.__applyLegacyProgressStats(e.detail.file);
        this.__redispatchEvent(e);
      });
      ['upload-request', 'upload-start', 'upload-response', 'upload-abort'].forEach((type) =>
        this._manager.addEventListener(type, (e) => this.__redispatchEvent(e)),
      );

      this.addEventListener('dragover', this._onDragover.bind(this));
      this.addEventListener('dragleave', this._onDragleave.bind(this));
      this.addEventListener('drop', this._onDrop.bind(this));

      // Handle events dispatched by the file elements in the list
      this.addEventListener('file-start', (e) => {
        this.__clearFileError(e.detail.file);
        this.__trackExternalFile(e.detail.file);
        this._manager.startUpload(e.detail.file);
      });
      this.addEventListener('file-abort', (e) => {
        const { file } = e.detail;
        this._manager.abortUpload(file);
        if (file.abort) {
          this.__externalFiles.delete(file);
        }
      });
      this.addEventListener('file-retry', (e) => this._manager.retryUpload(e.detail.file));

      // Announce the upload lifecycle to screen readers
      const alert = (message) => announce(message, { mode: 'alert' });
      this.addEventListener('file-reject', (e) => alert(`${e.detail.file.name}: ${e.detail.error}`));
      this.addEventListener('upload-start', (e) => alert(`${e.detail.file.name}: 0%`));
      this.addEventListener('upload-success', (e) => alert(`${e.detail.file.name}: 100%`));
      this.addEventListener('upload-error', (e) => alert(`${e.detail.file.name}: ${e.detail.file.error}`));

      this._addButtonController = new SlotController(this, 'add-button', 'vaadin-button', {
        initializer: (node) => {
          // Needed by Flow counterpart to apply i18n to custom button
          if (node._isDefault) {
            this._addButtonController.defaultNode = node;
          }
          node.addEventListener('touchend', (e) => {
            // Cancel the event to avoid the following click event
            e.preventDefault();
            this._onAddFilesClick(e);
          });
          node.addEventListener('click', (e) => this._onAddFilesClick(e));
          this._addButton = node;
        },
      });
      this.addController(this._addButtonController);

      this._dropLabelController = new SlotController(this, 'drop-label', 'span', {
        initializer: (label) => {
          // Needed by Flow counterpart to apply i18n to custom label
          if (label._isDefault) {
            this._dropLabelController.defaultNode = label;
          }
          this._dropLabel = label;
        },
      });
      this.addController(this._dropLabelController);

      this.addController(
        new SlotController(this, 'file-list', 'vaadin-upload-file-list', {
          initializer: (list) => {
            this._fileList = list;
          },
        }),
      );

      this.addController(new SlotController(this, 'drop-label-icon', 'vaadin-upload-icon'));
    }

    /** @private */
    __updateMaxFilesReached(maxFiles, files) {
      this._setMaxFilesReached(maxFiles >= 0 && files.length >= maxFiles);
    }

    /**
     * Restore the `speed` and `remaining` stats the component computed
     * before the manager integration: the speed derived from the total file
     * size instead of the transferred bytes, and unknown (infinite)
     * remaining time when no bytes have been transferred yet. The status
     * strings derived from the stats are recomputed by `__redispatchEvent`
     * before the `upload-progress` listeners run.
     * @private
     */
    __applyLegacyProgressStats(file) {
      if (file.uploading && !file.errorKey && !file.abort && file.total && file.elapsed) {
        file.speed = ~~(file.total / file.elapsed / 1024);
        if (!file.loaded) {
          file.remaining = Infinity;
        }
      }
    }

    /** @private */
    __filesChanged(files) {
      // Sync files to manager when set directly (e.g., from tests or user code)
      // Skip if this change was triggered by the manager's files-changed event
      if (this._manager && !this.__updatingFromManager) {
        // The flag suppresses the synchronous file list render for the
        // resulting files-changed event, which the component has
        // historically not done for property assignments
        this.__syncingFilesToManager = true;
        this._manager.files = files;
        this.__syncingFilesToManager = false;
      }
    }

    // ============ Manager event handlers ============

    /**
     * Update the status strings of the given file, hiding the status when an
     * error has been assigned to the file (e.g. by an `upload-progress`
     * listener) while it is uploading, like the component historically did.
     * @private
     */
    __updateFileStatus(file) {
      updateFileStatus(file, this.__effectiveI18n);
      if (file.uploading && file.error) {
        file.status = undefined;
        file.indeterminate = undefined;
      }
    }

    /** @private */
    __onManagerFilesChanged(event) {
      const files = event.detail.value;
      // Only update the `files` property when files are added or removed, so that
      // `files-changed` is not fired for upload state updates on individual files
      const filesChanged = files.length !== this.files.length || files.some((f, i) => f !== this.files[i]);
      if (filesChanged) {
        // Use flag to prevent recursive sync back to manager
        this.__updatingFromManager = true;
        this.files = [...files];
        this.__updatingFromManager = false;
        // The component has historically not rendered the file list
        // synchronously when files are added or removed — the list is
        // updated through the files property observer instead. Only compute
        // the file status strings, which the file list does not compute
        // when rendering.
        this.__updateFileStatuses();
      } else if (!this.__syncingFilesToManager) {
        // Compute the file status strings before rendering, like the
        // component did before the manager integration; the file list does
        // not compute them when rendering.
        this.__updateFileStatuses();
        this.__renderFileList();
      }
    }

    /**
     * Update the status strings of files, including files that are uploaded
     * without being added to the `files` list, which are not rendered by the
     * file list but still need up-to-date status strings. Only files that
     * are uploading or queued are updated: the status of other files stays
     * the same until they are queued again.
     * @private
     */
    __updateFileStatuses() {
      [...this.__externalFiles, ...this.files]
        .filter((file) => file.uploading || file.held)
        .forEach((file) => this.__updateFileStatus(file));
    }

    /**
     * Track a file that is uploaded without being in the `files` list, so
     * that its status strings are also updated while it uploads. The file is
     * removed from the tracked set once its upload finishes or is aborted.
     * @private
     */
    __trackExternalFile(file) {
      if (!this.files.includes(file)) {
        this.__externalFiles.add(file);
      }
    }

    /** @private */
    __renderFileList() {
      if (this._fileList && typeof this._fileList.requestContentUpdate === 'function') {
        this._fileList.requestContentUpdate();
      }
    }

    /** @private */
    __onManagerFileReject(event) {
      const { file, error } = event.detail;
      // Translate error code to i18n message
      const errorMessage = this.__effectiveI18n.error[error] || error;
      this.dispatchEvent(
        new CustomEvent('file-reject', {
          detail: { file, error: errorMessage },
        }),
      );
    }

    /** @private */
    __onManagerFileRemove(event) {
      const { file, fileIndex } = event.detail;

      this.dispatchEvent(
        new CustomEvent('file-remove', {
          detail: { file },
          bubbles: true,
          composed: true,
        }),
      );
      this._updateFocus(fileIndex);
    }

    /** @private */
    __redispatchEvent(event) {
      const { file } = event.detail;
      if (file) {
        // Make sure the status strings are up-to-date when listeners of the
        // redispatched event read them, like they were historically: e.g.
        // 'Connecting...' already at the upload-request event, while the
        // file list only renders it on the next files-changed
        this.__updateFileStatus(file);
      }
      const dispatched = this.dispatchEvent(
        new CustomEvent(event.type, {
          detail: event.detail,
          cancelable: event.cancelable,
        }),
      );
      if (event.cancelable && !dispatched) {
        event.preventDefault();
      }
    }

    /** @private */
    __onManagerUploadSuccess(event) {
      const { file } = event.detail;
      this.__externalFiles.delete(file);
      // Check if error was set by upload-response listener (for backwards compatibility)
      if (file.error) {
        file.complete = false;
        this.dispatchEvent(new CustomEvent('upload-error', { detail: event.detail }));
        return;
      }
      this.__redispatchEvent(event);
    }

    /** @private */
    __onManagerUploadRetry(event) {
      this.__redispatchEvent(event);
      if (!event.defaultPrevented) {
        this.__clearFileError(event.detail.file);

        const fileIndex = this.files.indexOf(event.detail.file);
        if (fileIndex >= 0) {
          this._updateFocus(fileIndex);
        }
      }
    }

    /**
     * Clear the error from a previous upload attempt when the upload of the
     * file is about to be restarted. The manager resets its own error state
     * (`errorKey`) when queueing a file, but not the translated `error` message
     * that this mixin assigns.
     * @private
     */
    __clearFileError(file) {
      if (!file.uploading) {
        file.error = false;
      }
    }

    /** @private */
    __onManagerUploadError(event) {
      const { file } = event.detail;
      this.__externalFiles.delete(file);
      // Translate errorKey to i18n message and set file.error, also when a
      // listener has already assigned an error, which the component has
      // historically overwritten with the message derived from the response
      if (file.errorKey) {
        file.error = translateErrorKey(file.errorKey, this.__effectiveI18n);
      }
      this.__redispatchEvent(event);
      // The manager stops tracking upload progress once the upload has
      // failed, so clear the stale status and progress state here
      file.status = undefined;
      file.indeterminate = undefined;
    }

    // ============ UI updates ============

    /** @private */
    __updateAddButton(addButton, maxFiles, effectiveI18n, maxFilesReached, disabled) {
      if (addButton) {
        addButton.disabled = disabled || maxFilesReached;

        // Only update text content for the default button element
        if (addButton === this._addButtonController.defaultNode) {
          addButton.textContent = this._i18nPlural(maxFiles, effectiveI18n.addFiles);
        }
      }
    }

    /** @private */
    __updateDropLabel(dropLabel, maxFiles, effectiveI18n) {
      // Only update text content for the default label element
      if (dropLabel && dropLabel === this._dropLabelController.defaultNode) {
        dropLabel.textContent = this._i18nPlural(maxFiles, effectiveI18n.dropFiles);
      }
    }

    /** @private */
    __updateFileList(list, files, effectiveI18n, disabled) {
      if (list) {
        list.items = [...files];
        list.i18n = effectiveI18n;
        list.disabled = disabled;
        setOrRemoveAttribute(list, 'theme', this._theme);
      }
    }

    // ============ Drag and drop ============

    /** @private */
    _dragoverChanged(dragover) {
      setOrRemoveAttribute(this, 'dragover', dragover);
    }

    /** @private */
    _dragoverValidChanged(dragoverValid) {
      setOrRemoveAttribute(this, 'dragover-valid', dragoverValid);
    }

    /** @private */
    _onDragover(event) {
      event.preventDefault();
      if (!this.nodrop && !this._dragover) {
        this._dragoverValid = !this.maxFilesReached && !this.disabled;
        this._dragover = true;
      }
      event.dataTransfer.dropEffect = !this._dragoverValid || this.nodrop ? 'none' : 'copy';
    }

    /** @private */
    _onDragleave(event) {
      event.preventDefault();
      if (this._dragover && !this.nodrop) {
        this._dragover = this._dragoverValid = false;
      }
    }

    /** @private */
    async _onDrop(event) {
      if (!this.nodrop && !this.disabled) {
        event.preventDefault();
        this._dragover = this._dragoverValid = false;

        const files = await getFilesFromDropEvent(event);
        this._addFiles(files);
      }
    }

    // ============ File input handling ============

    /** @private */
    _onAddFilesClick(e) {
      if (this.maxFilesReached) {
        return;
      }

      e.stopPropagation();
      this.$.fileInput.value = '';
      this.$.fileInput.click();
    }

    /** @private */
    _onFileInputChange(event) {
      this._addFiles(event.target.files);
    }

    /** @private */
    _addFiles(files) {
      Array.from(files).forEach((file) => this._addFile(file));
    }

    /**
     * Add the file for uploading. Called internally for each file after picking files from dialog or dropping files.
     *
     * @param {!UploadFile} file File being added
     * @protected
     */
    _addFile(file) {
      this._manager.addFiles([file]);
    }

    /**
     * Remove file from upload list. Called internally if file upload was canceled.
     * @param {!UploadFile} file File to remove
     * @protected
     */
    _removeFile(file) {
      this._manager.removeFile(file);
    }

    // ============ Accessibility ============

    /** @private */
    _updateFocus(fileIndex) {
      if (this.files.length === 0) {
        this._addButton.focus({ focusVisible: isKeyboardActive() });
        return;
      }
      // If the removed file was at the end, focus the new last file
      const lastFileRemoved = fileIndex >= this.files.length;
      if (lastFileRemoved) {
        fileIndex = this.files.length - 1;
      }
      if (this._fileList && this._fileList.children[fileIndex]) {
        this._fileList.children[fileIndex].firstElementChild.focus({ focusVisible: isKeyboardActive() });
      }
    }

    /**
     * Getter/setter for _createXhr to allow tests to mock XHR creation.
     * @private
     */
    get _createXhr() {
      return this._manager._createXhr;
    }

    set _createXhr(value) {
      this._manager._createXhr = value;
    }

    /**
     * Triggers the upload of any files that are not completed
     *
     * @param {!UploadFile | !Array<!UploadFile>=} files - Files being uploaded. Defaults to all outstanding files
     */
    uploadFiles(files = this.files) {
      // Convert to array if single file
      if (files && !Array.isArray(files)) {
        files = [files];
      }

      files
        .filter((file) => !file.complete)
        .forEach((file) => {
          this.__clearFileError(file);
          this.__trackExternalFile(file);
        });

      this._manager.uploadFiles(files);
    }

    // ============ Utilities ============

    /** @private */
    _i18nPlural(value, plural) {
      return value === 1 ? plural.one : plural.many;
    }

    /** @protected */
    _isMultiple(maxFiles) {
      return maxFiles !== 1;
    }
  };
