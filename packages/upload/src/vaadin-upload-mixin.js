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
import { issueWarning } from '@vaadin/component-base/src/warnings.js';
import { DEFAULT_I18N as FILE_LIST_DEFAULT_I18N } from './vaadin-upload-file-list-mixin.js';
import { getFilesFromDropEvent, updateFileStatus } from './vaadin-upload-helpers.js';
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

// Configuration properties that are mirrored to the internal upload managers
const MANAGER_CONFIG_PROPS = [
  'target',
  'method',
  'headers',
  'timeout',
  'maxFiles',
  'maxFileSize',
  'accept',
  'noAuto',
  'withCredentials',
  'uploadFormat',
  'maxConcurrentUploads',
  'formDataName',
];

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
          reflectToAttribute: true,
          attribute: 'dragover',
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
          reflectToAttribute: true,
          attribute: 'dragover-valid',
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

      // Create the internal upload manager
      this._manager = this.__createManager();
    }

    /** @protected */
    ready() {
      super.ready();

      // Set up manager event listeners
      this._manager.addEventListener('files-changed', (e) => this.__onManagerFilesChanged(e));
      this._manager.addEventListener('max-files-reached-changed', (e) => this.__onManagerMaxFilesReachedChanged(e));
      this._manager.addEventListener('file-reject', (e) => this.__onManagerFileReject(e));
      this._manager.addEventListener('file-remove', (e) => this.__onManagerFileRemove(e));
      this.__addUploadEventListeners(this._manager);

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

    /** @protected */
    updated(props) {
      super.updated(props);

      if (MANAGER_CONFIG_PROPS.some((prop) => props.has(prop))) {
        this.__syncManagerConfig();
      }
    }

    /**
     * Add listeners for the upload lifecycle events of the given manager.
     * @private
     */
    __addUploadEventListeners(manager) {
      manager.addEventListener('upload-success', (e) => this.__onManagerUploadSuccess(e));
      manager.addEventListener('upload-error', (e) => this.__onManagerUploadError(e));
      manager.addEventListener('upload-retry', (e) => this.__onManagerUploadRetry(e));
      ['upload-before', 'upload-request', 'upload-start', 'upload-progress', 'upload-response', 'upload-abort'].forEach(
        (type) => manager.addEventListener(type, (e) => this.__redispatchEvent(e)),
      );
    }

    /**
     * Create an UploadManager for internal use. Its `method`, `headers` and
     * `maxConcurrentUploads` accessors are shadowed with plain properties to
     * skip the manager's validation, since `<vaadin-upload>` has historically
     * accepted any values for these properties: an unsupported method is
     * passed to the request, a non-positive maxConcurrentUploads pauses
     * uploads, and undefined headers (from an invalid JSON string) throw when
     * the request is configured.
     * @private
     */
    __createManager() {
      const manager = new UploadManager();
      Object.defineProperties(manager, {
        method: { value: manager.method, writable: true },
        headers: { value: manager.headers, writable: true },
        maxConcurrentUploads: { value: manager.maxConcurrentUploads, writable: true },
      });
      return manager;
    }

    /** @private */
    __syncManagerConfig() {
      this.__applyManagerConfig(this._manager);
      // Validation properties only apply to files added to the list.
      // The manager does not accept negative maxFiles, which the component
      // treats as no limit.
      this._manager.maxFiles = this.maxFiles < 0 ? Infinity : this.maxFiles;
      this._manager.maxFileSize = this.maxFileSize;
      this._manager.accept = this.accept;

      if (this.__externalManager) {
        this.__applyManagerConfig(this.__externalManager);
      }
    }

    /**
     * Apply the configuration shared by the internal upload managers.
     * @private
     */
    __applyManagerConfig(manager) {
      manager.target = this.target;
      manager.method = this.method;
      this.__syncManagerHeaders(manager);
      manager.timeout = this.timeout;
      manager.noAuto = this.noAuto;
      manager.withCredentials = this.withCredentials;
      manager.uploadFormat = this.uploadFormat;
      manager.maxConcurrentUploads = this.maxConcurrentUploads;
      manager.formDataName = this.formDataName;
    }

    /**
     * Sync `headers` to the manager. The `headers` property supports a JSON
     * string, while the manager only accepts an object, so strings are parsed
     * before syncing. An invalid JSON string resets the property to undefined.
     * @private
     */
    __syncManagerHeaders(manager) {
      let headers = this.headers;
      if (typeof headers === 'string') {
        try {
          headers = JSON.parse(headers);
        } catch (_) {
          issueWarning(`Failed to parse headers "${headers}". Expected a valid JSON string.`);
          headers = undefined;
          this.headers = undefined;
        }
      }
      manager.headers = headers;
    }

    /** @private */
    __filesChanged(files) {
      // Sync files to manager when set directly (e.g., from tests or user code)
      // Skip if this change was triggered by the manager's files-changed event
      if (this._manager && !this.__updatingFromManager) {
        // Use flag to prevent the manager's files-changed event from re-syncing
        this.__syncingToManager = true;
        this.__setManagerFiles(files);
        this.__syncingToManager = false;
        // Sync `maxFilesReached` in case it changed while its updates were suppressed
        this._setMaxFilesReached(this._manager.maxFilesReached);
      }
    }

    /**
     * Assign files to the manager without validation. The manager's files
     * setter validates new files against the configured constraints, while
     * files assigned to the `files` property directly (e.g. to show previously
     * uploaded files) must be accepted as-is.
     * @private
     */
    __setManagerFiles(files) {
      const manager = this._manager;
      const { maxFiles, maxFileSize, accept } = manager;
      // Temporarily lift the constraints so that the setter accepts all files
      Object.assign(manager, { maxFiles: Infinity, maxFileSize: Infinity, accept: '' });
      manager.files = files;
      Object.assign(manager, { maxFiles, maxFileSize, accept });
    }

    // ============ Manager event handlers ============

    /** @private */
    __onManagerFilesChanged(event) {
      // Skip if this event was triggered by our own sync to the manager
      if (this.__syncingToManager) {
        return;
      }
      const files = event.detail.value;
      // Only update the `files` property when files are added or removed, so that
      // `files-changed` is not fired for upload state updates on individual files
      const filesChanged = files.length !== this.files.length || files.some((file, i) => file !== this.files[i]);
      if (filesChanged) {
        // Use flag to prevent recursive sync back to manager
        this.__updatingFromManager = true;
        this.files = [...files];
        this.__updatingFromManager = false;
      }
      this.__renderFileList();
    }

    /** @private */
    __renderFileList() {
      if (this._fileList && typeof this._fileList.requestContentUpdate === 'function') {
        this._fileList.requestContentUpdate();
      } else {
        // A custom file list does not compute file status strings on its own,
        // so keep them up-to-date here
        this.files.forEach((file) => updateFileStatus(file, this.__effectiveI18n));
      }
    }

    /** @private */
    __onManagerMaxFilesReachedChanged(event) {
      // Ignore transient changes caused by assigning files to the manager
      if (this.__syncingToManager) {
        return;
      }
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
      const { file } = event.detail;
      if (file && this.__isExternalFile(file)) {
        // Files that are not rendered by the file list still need up-to-date
        // status strings when their upload events are dispatched
        updateFileStatus(file, this.__effectiveI18n);
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

    // ============ External uploads ============

    /**
     * Files passed to `uploadFiles` that are not in the `files` list are
     * uploaded without being added to it. They are handled by a separate
     * manager so that they never affect the `files` list, its validation,
     * or the `maxFilesReached` state.
     * @private
     */
    __getExternalManager() {
      if (!this.__externalManager) {
        const manager = this.__createManager();
        manager._createXhr = this._manager._createXhr;
        manager.addEventListener('files-changed', () => {
          this.__updateExternalFileStatuses();
          // The file list has historically been rendered on upload state
          // changes even for files that it does not display
          this.__renderFileList();
        });
        this.__addUploadEventListeners(manager);
        this.__externalManager = manager;
        this.__applyManagerConfig(manager);
      }
      return this.__externalManager;
    }

    /** @private */
    __isExternalFile(file) {
      return !!this.__externalManager && this.__externalManager.files.includes(file);
    }

    /** @private */
    __managerFor(file) {
      return this.__isExternalFile(file) ? this.__externalManager : this._manager;
    }

    /** @private */
    __updateExternalFileStatuses() {
      this.__externalManager.files.forEach((file) => updateFileStatus(file, this.__effectiveI18n));
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
    __onManagerUploadRetry(event) {
      this.__redispatchEvent(event);
      if (!event.defaultPrevented) {
        this.__clearFileError(event.detail.file);

        const fileIndex = this.files.indexOf(event.detail.file);
        if (fileIndex >= 0) {
          // The file list does not change on retry, so the file can be
          // focused synchronously
          this.__focusFile(fileIndex);
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
      if (!file.complete && !file.uploading) {
        file.error = false;
      }
    }

    /** @private */
    __onManagerUploadError(event) {
      const { file } = event.detail;
      // Translate errorKey to i18n message and set file.error (only if error wasn't already set directly)
      if (file.errorKey && !file.error) {
        file.error = this.__effectiveI18n.uploading.error[file.errorKey] || file.errorKey;
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
        this.__syncManagerConfig();
        this._manager.addFiles(files);
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
      this.__syncManagerConfig();
      this._manager.addFiles(event.target.files);
    }

    // ============ File events ============

    /** @private */
    _onFileStart(event) {
      this.uploadFiles(event.detail.file);
    }

    /** @private */
    _onFileRetry(event) {
      this.__syncManagerConfig();
      this.__managerFor(event.detail.file).retryUpload(event.detail.file);
    }

    /** @private */
    _onFileAbort(event) {
      const manager = this.__managerFor(event.detail.file);
      manager.abortUpload(event.detail.file);
      // The manager does not process its upload queue when a file that has
      // not started uploading is removed, so removing a queued file would
      // not free capacity for other queued files without this
      manager._processUploadQueue();
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
        this.__focusFile(fileIndex);
      });
    }

    /** @private */
    __focusFile(fileIndex) {
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
      if (this.__externalManager) {
        this.__externalManager._createXhr = value;
      }
    }

    /**
     * Triggers the upload of any files that are not completed
     *
     * @param {!UploadFile | !Array<!UploadFile>=} files - Files being uploaded. Defaults to all outstanding files
     */
    uploadFiles(files = this.files) {
      // Ensure manager config is synced before uploading files
      this.__syncManagerConfig();

      // Convert to array if single file
      if (files && !Array.isArray(files)) {
        files = [files];
      }

      files.forEach((file) => this.__clearFileError(file));

      // Files that are not in the `files` list are uploaded by a separate
      // manager without being added to the list
      const externalFiles = files.filter((file) => !this.files.includes(file));
      if (externalFiles.length > 0) {
        const externalManager = this.__getExternalManager();
        const externalManagerFiles = externalManager.files;
        const newFiles = externalFiles.filter((file) => !externalManagerFiles.includes(file));
        newFiles.forEach((file) => {
          file.formDataName ??= this.formDataName;
        });
        externalManager.files = [...externalManagerFiles, ...newFiles];
        externalManager.uploadFiles(externalFiles);
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
