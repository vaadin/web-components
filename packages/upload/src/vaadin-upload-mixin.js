/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { announce } from '@vaadin/a11y-base/src/announce.js';
import { isKeyboardActive } from '@vaadin/a11y-base/src/focus-utils.js';
import { isTouch } from '@vaadin/component-base/src/browser-utils.js';
import { I18nMixin } from '@vaadin/component-base/src/i18n-mixin.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';
import { DEFAULT_I18N as FILE_LIST_DEFAULT_I18N } from './vaadin-upload-file-list-mixin.js';
import { getFilesFromDropEvent } from './vaadin-upload-helpers.js';
import { UploadManager } from './vaadin-upload-manager.js';

export const DEFAULT_I18N = {
  ...FILE_LIST_DEFAULT_I18N,
  dropFiles: {
    one: 'Drop file here',
    many: 'Drop files here',
  },
  addFiles: {
    one: 'Upload File...',
    many: 'Upload Files...',
  },
};

class AddButtonController extends SlotController {
  constructor(host) {
    super(host, 'add-button', 'vaadin-button');
  }

  /**
   * Override method inherited from `SlotController`
   * to add listeners to default and custom node.
   *
   * @param {Node} node
   * @protected
   * @override
   */
  initNode(node) {
    // Needed by Flow counterpart to apply i18n to custom button
    if (node._isDefault) {
      this.defaultNode = node;
    }

    node.addEventListener('touchend', (e) => {
      this.host._onAddFilesTouchEnd(e);
    });

    node.addEventListener('click', (e) => {
      this.host._onAddFilesClick(e);
    });

    this.host._addButton = node;
  }
}

class DropLabelController extends SlotController {
  constructor(host) {
    super(host, 'drop-label', 'span');
  }

  /**
   * Override method inherited from `SlotController`
   * to add listeners to default and custom node.
   *
   * @param {Node} node
   * @protected
   * @override
   */
  initNode(node) {
    // Needed by Flow counterpart to apply i18n to custom label
    if (node._isDefault) {
      this.defaultNode = node;
    }
    this.host._dropLabel = node;
  }
}

/**
 * @polymerMixin
 */
export const UploadMixin = (superClass) =>
  class UploadMixin extends I18nMixin(DEFAULT_I18N, superClass) {
    static get properties() {
      return {
        /**
         * If true, the user cannot interact with this element.
         * @type {boolean}
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
         * @type {boolean}
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
         * @type {string}
         */
        target: {
          type: String,
          value: '',
        },

        /**
         * HTTP Method used to send the files. Only POST and PUT are allowed.
         * @type {!UploadMethod}
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
         * @type {number}
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
         * @type {number}
         */
        maxFiles: {
          type: Number,
          value: Infinity,
          sync: true,
        },

        /**
         * Specifies if the maximum number of files have been uploaded
         * @attr {boolean} max-files-reached
         * @type {boolean}
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
         * @type {string}
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
         * @type {number}
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
         * @type {string}
         */
        formDataName: {
          type: String,
          value: 'file',
        },

        /**
         * Prevents upload(s) from immediately uploading upon adding file(s).
         * When set, you must manually trigger uploads using the `uploadFiles` method
         * @attr {boolean} no-auto
         * @type {boolean}
         */
        noAuto: {
          type: Boolean,
          value: false,
        },

        /**
         * Set the withCredentials flag on the request.
         * @attr {boolean} with-credentials
         * @type {boolean}
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
         * @type {string}
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
         * @type {number}
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
        capture: String,

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
        '__updateAddButton(_addButton, maxFiles, __effectiveI18n, maxFilesReached, disabled)',
        '__updateDropLabel(_dropLabel, maxFiles, __effectiveI18n)',
        '__updateFileList(_fileList, files, __effectiveI18n, disabled)',
        '__updateMaxFilesReached(maxFiles, files)',
        '__syncManagerConfig(target, method, headers, timeout, maxFiles, maxFileSize, accept, noAuto, withCredentials, uploadFormat, maxConcurrentUploads, formDataName)',
      ];
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
     *       forbidden: 'Upload forbidden'
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
     * @return {!UploadI18n}
     */
    get i18n() {
      return super.i18n;
    }

    set i18n(value) {
      super.i18n = value;
    }

    constructor() {
      super();

      // Create the internal upload manager
      this._manager = new UploadManager();

      // Bind manager event handlers
      this.__onManagerFilesChanged = this.__onManagerFilesChanged.bind(this);
      this.__onManagerMaxFilesReachedChanged = this.__onManagerMaxFilesReachedChanged.bind(this);
      this.__onManagerFileReject = this.__onManagerFileReject.bind(this);
      this.__onManagerFileRemove = this.__onManagerFileRemove.bind(this);
      this.__onManagerUploadSuccess = this.__onManagerUploadSuccess.bind(this);
      this.__onManagerUploadError = this.__onManagerUploadError.bind(this);
      this.__redispatchEvent = this.__redispatchEvent.bind(this);
    }

    /** @protected */
    ready() {
      super.ready();

      // Set up manager event listeners
      this._manager.addEventListener('files-changed', this.__onManagerFilesChanged);
      this._manager.addEventListener('max-files-reached-changed', this.__onManagerMaxFilesReachedChanged);
      this._manager.addEventListener('file-reject', this.__onManagerFileReject);
      this._manager.addEventListener('file-remove', this.__onManagerFileRemove);
      this._manager.addEventListener('upload-before', this.__redispatchEvent);
      this._manager.addEventListener('upload-request', this.__redispatchEvent);
      this._manager.addEventListener('upload-start', this.__redispatchEvent);
      this._manager.addEventListener('upload-progress', this.__redispatchEvent);
      this._manager.addEventListener('upload-response', this.__redispatchEvent);
      this._manager.addEventListener('upload-success', this.__onManagerUploadSuccess);
      this._manager.addEventListener('upload-error', this.__onManagerUploadError);
      this._manager.addEventListener('upload-retry', this.__redispatchEvent);
      this._manager.addEventListener('upload-abort', this.__redispatchEvent);

      this.addEventListener('dragover', this._onDragover.bind(this));
      this.addEventListener('dragleave', this._onDragleave.bind(this));
      this.addEventListener('drop', this._onDrop.bind(this));
      this.addEventListener('file-retry', this._onFileRetry.bind(this));
      this.addEventListener('file-abort', this._onFileAbort.bind(this));
      this.addEventListener('file-start', this._onFileStart.bind(this));
      this.addEventListener('file-reject', this._onFileReject.bind(this));
      this.addEventListener('upload-start', this._onUploadStart.bind(this));
      this.addEventListener('upload-success', this._onUploadSuccess.bind(this));
      this.addEventListener('upload-error', this._onUploadError.bind(this));

      this._addButtonController = new AddButtonController(this);
      this.addController(this._addButtonController);

      this._dropLabelController = new DropLabelController(this);
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
    // eslint-disable-next-line @typescript-eslint/max-params
    __syncManagerConfig(
      _target,
      _method,
      _headers,
      _timeout,
      _maxFiles,
      _maxFileSize,
      _accept,
      _noAuto,
      _withCredentials,
      _uploadFormat,
      _maxConcurrentUploads,
      _formDataName,
    ) {
      if (!this._manager) {
        return;
      }
      this._manager.target = this.target;
      this._manager.method = this.method;
      this._manager.headers = this.headers;
      this._manager.timeout = this.timeout;
      this._manager.maxFiles = this.maxFiles;
      this._manager.maxFileSize = this.maxFileSize;
      this._manager.accept = this.accept;
      this._manager.noAuto = this.noAuto;
      this._manager.withCredentials = this.withCredentials;
      this._manager.uploadFormat = this.uploadFormat;
      this._manager.maxConcurrentUploads = this.maxConcurrentUploads;
      this._manager.formDataName = this.formDataName;
    }

    /** @private */
    __filesChanged(files) {
      // Sync files to manager when set directly (e.g., from tests or user code)
      // Skip if this change was triggered by the manager's files-changed event
      if (this._manager && !this.__updatingFromManager) {
        // Use flag to prevent the manager's files-changed event from re-syncing
        this.__syncingToManager = true;
        this._manager.files = files;
        this.__syncingToManager = false;
      }
    }

    // ============ Manager event handlers ============

    /** @private */
    __onManagerFilesChanged(event) {
      // Skip if this event was triggered by our own sync to the manager
      if (this.__syncingToManager) {
        return;
      }
      // Update files from manager
      const files = event.detail.value;
      // Use flag to prevent recursive sync back to manager
      this.__updatingFromManager = true;
      this.files = [...files];
      this.__updatingFromManager = false;
    }

    /** @private */
    __onManagerMaxFilesReachedChanged(event) {
      this._setMaxFilesReached(event.detail.value);
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
      // Check if error was set by upload-response listener (for backwards compatibility)
      if (file.error) {
        file.complete = false;
        this.dispatchEvent(new CustomEvent('upload-error', { detail: event.detail }));
        return;
      }
      this.__redispatchEvent(event);
    }

    /** @private */
    __onManagerUploadError(event) {
      const { file } = event.detail;
      // Translate errorKey to i18n message and set file.error (only if error wasn't already set directly)
      if (file.errorKey && !file.error) {
        file.error = this.__effectiveI18n.uploading.error[file.errorKey] || file.errorKey;
      }
      this.__redispatchEvent(event);
    }

    // ============ UI updates ============

    /** @private */
    __updateMaxFilesReached(maxFiles, files) {
      this._setMaxFilesReached(maxFiles >= 0 && files.length >= maxFiles);
    }

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
      }
    }

    // ============ Drag and drop ============

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
        this._manager.addFiles(files);
      }
    }

    /** @private */
    _dragoverChanged(dragover) {
      if (dragover) {
        this.setAttribute('dragover', dragover);
      } else {
        this.removeAttribute('dragover');
      }
    }

    /** @private */
    _dragoverValidChanged(dragoverValid) {
      if (dragoverValid) {
        this.setAttribute('dragover-valid', dragoverValid);
      } else {
        this.removeAttribute('dragover-valid');
      }
    }

    // ============ File input handling ============

    /** @private */
    _onAddFilesTouchEnd(e) {
      // Cancel the event to avoid the following click event
      e.preventDefault();
      this._onAddFilesClick(e);
    }

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
      this._manager.addFiles(event.target.files);
    }

    // ============ File events ============

    /** @private */
    _onFileStart(event) {
      this._manager.uploadFiles(event.detail.file);
    }

    /** @private */
    _onFileRetry(event) {
      this._manager.retryUpload(event.detail.file);
      this._updateFocus(this.files.indexOf(event.detail.file));
    }

    /** @private */
    _onFileAbort(event) {
      this._manager.abortUpload(event.detail.file);
    }

    // ============ Accessibility ============

    /** @private */
    _onFileReject(event) {
      announce(`${event.detail.file.name}: ${event.detail.error}`, { mode: 'alert' });
    }

    /** @private */
    _onUploadStart(event) {
      announce(`${event.detail.file.name}: 0%`, { mode: 'alert' });
    }

    /** @private */
    _onUploadSuccess(event) {
      announce(`${event.detail.file.name}: 100%`, { mode: 'alert' });
    }

    /** @private */
    _onUploadError(event) {
      announce(`${event.detail.file.name}: ${event.detail.file.error}`, { mode: 'alert' });
    }

    /** @private */
    _updateFocus(fileIndex) {
      // Use requestAnimationFrame to ensure the file list has been updated
      requestAnimationFrame(() => {
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
      });
    }

    // TODO: The following functions only seem to be accessed from tests. Consider removing them.
    /**
     * Add files to the upload list.
     * @param {FileList|File[]} files - Files to add
     */
    _addFiles(files) {
      // Ensure manager config is synced before adding files
      this.__syncManagerConfig();
      this._manager.addFiles(files);
    }

    /**
     * Add a single file to the upload list.
     * @param {File} file - File to add
     * @private
     */
    _addFile(file) {
      // Ensure manager config is synced before adding files
      this.__syncManagerConfig();
      this._manager.addFiles([file]);
    }

    /**
     * Queue a file for upload.
     * @param {UploadFile} file - File to queue
     * @private
     */
    _queueFileUpload(file) {
      this.uploadFiles(file);
    }

    /**
     * Start uploading a file immediately.
     * @param {UploadFile} file - File to upload
     * @private
     */
    _uploadFile(file) {
      this.uploadFiles(file);
    }

    /**
     * Retry uploading a failed file.
     * @param {UploadFile} file - File to retry
     * @private
     */
    _retryFileUpload(file) {
      this._manager.retryUpload(file);
    }

    /**
     * Abort uploading a file.
     * @param {UploadFile} file - File to abort
     * @private
     */
    _abortFileUpload(file) {
      this._manager.abortUpload(file);
    }

    /**
     * Getter/setter for _createXhr to allow tests to mock XHR creation.
     * @private
     */
    get _createXhr() {
      return this.__createXhrOverride || this._manager._createXhr;
    }

    set _createXhr(value) {
      // Store the original value for spy assertions in tests
      this.__createXhrOverride = value;
      // Set on manager - the manager will call this function
      this._manager._createXhr = value;
    }

    /**
     * Triggers the upload of any files that are not completed
     *
     * @param {!UploadFile | !Array<!UploadFile>=} files - Files being uploaded. Defaults to all outstanding files
     */
    uploadFiles(files = this.files) {
      // Ensure manager config is synced before adding files
      this.__syncManagerConfig();

      // Convert to array if single file
      if (files && !Array.isArray(files)) {
        files = [files];
      }

      // Add files that aren't already in the manager (without auto-upload)
      const managerFiles = this._manager.files;
      const newFiles = files.filter((file) => !managerFiles.includes(file));
      if (newFiles.length > 0) {
        // Temporarily enable noAuto to prevent auto-upload when adding
        const wasNoAuto = this._manager.noAuto;
        this._manager.noAuto = true;
        this._manager.addFiles(newFiles);
        this._manager.noAuto = wasNoAuto;
      }

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
