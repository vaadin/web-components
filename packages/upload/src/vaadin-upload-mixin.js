/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { announce } from '@vaadin/a11y-base/src/announce.js';
import { isKeyboardActive } from '@vaadin/a11y-base/src/focus-utils.js';
import { isTouch } from '@vaadin/component-base/src/browser-utils.js';
import { I18nMixin } from '@vaadin/component-base/src/i18n-mixin.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';
import { DEFAULT_UPLOAD_I18N, UploadCore } from './vaadin-upload-core.js';

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
  class UploadMixin extends I18nMixin(DEFAULT_UPLOAD_I18N, superClass) {
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
        '__syncCoreTarget(target)',
        '__syncCoreMethod(method)',
        '__syncCoreHeaders(headers)',
        '__syncCoreTimeout(timeout)',
        '__syncCoreMaxFiles(maxFiles)',
        '__syncCoreMaxFileSize(maxFileSize)',
        '__syncCoreAccept(accept)',
        '__syncCoreFormDataName(formDataName)',
        '__syncCoreNoAuto(noAuto)',
        '__syncCoreWithCredentials(withCredentials)',
        '__syncCoreUploadFormat(uploadFormat)',
        '__syncCoreMaxConcurrentUploads(maxConcurrentUploads)',
        '__syncCoreNodrop(nodrop)',
        '__syncCoreCapture(capture)',
        '__syncCoreI18n(__effectiveI18n)',
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

    /** @protected */
    ready() {
      super.ready();

      // Create the UploadCore instance that handles all upload logic
      this._uploadCore = new UploadCore();

      // Override _createXhr to allow external customization
      this._uploadCore._createXhr = () => this._createXhr();

      // Set up event forwarding from core to this element
      this.__setupCoreEventForwarding();

      // Set up drag/drop on this element
      this.addEventListener('dragover', this._onDragover.bind(this));
      this.addEventListener('dragleave', this._onDragleave.bind(this));
      this.addEventListener('drop', this._onDrop.bind(this));

      // Set up file list event listeners
      this.addEventListener('file-retry', this._onFileRetry.bind(this));
      this.addEventListener('file-abort', this._onFileAbort.bind(this));
      this.addEventListener('file-start', this._onFileStart.bind(this));

      // Set up a11y announcement listeners
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
    __setupCoreEventForwarding() {
      // Forward all upload events from core to this element
      const events = [
        'file-reject',
        'file-remove',
        'upload-before',
        'upload-request',
        'upload-start',
        'upload-progress',
        'upload-response',
        'upload-success',
        'upload-error',
        'upload-retry',
        'upload-abort',
      ];

      events.forEach((eventName) => {
        this._uploadCore.addEventListener(eventName, (e) => {
          // Re-dispatch with the same detail, cancelable status
          const newEvent = new CustomEvent(eventName, {
            detail: e.detail,
            cancelable: e.cancelable,
            bubbles: true,
            composed: true,
          });
          const result = this.dispatchEvent(newEvent);
          // If the re-dispatched event was prevented, prevent the original
          if (!result && e.cancelable) {
            e.preventDefault();
          }
        });
      });

      // Handle files-changed to sync back to component property
      this._uploadCore._onFilesChanged = (files) => {
        // Avoid infinite loop by checking if files actually changed
        if (this.files !== files) {
          this.files = files;
        }
        this._renderFileList();
      };

      // Handle maxFilesReached changes
      this._uploadCore._onMaxFilesReachedChanged = () => {
        // The component's observer handles this via __updateMaxFilesReached
      };

      // Handle file list rendering
      this._uploadCore._renderFileList = () => {
        this._renderFileList();
      };
    }

    /** @private */
    __syncCoreTarget(target) {
      if (this._uploadCore) this._uploadCore.target = target;
    }

    /** @private */
    __syncCoreMethod(method) {
      if (this._uploadCore) this._uploadCore.method = method;
    }

    /** @private */
    __syncCoreHeaders(headers) {
      if (this._uploadCore) this._uploadCore.headers = headers;
    }

    /** @private */
    __syncCoreTimeout(timeout) {
      if (this._uploadCore) this._uploadCore.timeout = timeout;
    }

    /** @private */
    __syncCoreMaxFiles(maxFiles) {
      if (this._uploadCore) this._uploadCore.maxFiles = maxFiles;
    }

    /** @private */
    __syncCoreMaxFileSize(maxFileSize) {
      if (this._uploadCore) this._uploadCore.maxFileSize = maxFileSize;
    }

    /** @private */
    __syncCoreAccept(accept) {
      if (this._uploadCore) this._uploadCore.accept = accept;
    }

    /** @private */
    __syncCoreFormDataName(formDataName) {
      if (this._uploadCore) this._uploadCore.formDataName = formDataName;
    }

    /** @private */
    __syncCoreNoAuto(noAuto) {
      if (this._uploadCore) this._uploadCore.noAuto = noAuto;
    }

    /** @private */
    __syncCoreWithCredentials(withCredentials) {
      if (this._uploadCore) this._uploadCore.withCredentials = withCredentials;
    }

    /** @private */
    __syncCoreUploadFormat(uploadFormat) {
      if (this._uploadCore) this._uploadCore.uploadFormat = uploadFormat;
    }

    /** @private */
    __syncCoreMaxConcurrentUploads(maxConcurrentUploads) {
      if (this._uploadCore) this._uploadCore.maxConcurrentUploads = maxConcurrentUploads;
    }

    /** @private */
    __syncCoreNodrop(nodrop) {
      if (this._uploadCore) this._uploadCore.nodrop = nodrop;
    }

    /** @private */
    __syncCoreCapture(capture) {
      if (this._uploadCore) this._uploadCore.capture = capture;
    }

    /** @private */
    __syncCoreI18n(effectiveI18n) {
      if (this._uploadCore) this._uploadCore.i18n = effectiveI18n;
    }

    /**
     * Synchronously sync all component properties to the upload core.
     * This is needed because Polymer observers may not have fired yet
     * when proxy methods are called immediately after property changes.
     * @private
     */
    __syncAllCoreProperties() {
      if (!this._uploadCore) return;

      this._uploadCore.target = this.target;
      this._uploadCore.method = this.method;
      this._uploadCore.headers = this.headers;
      this._uploadCore.timeout = this.timeout;
      this._uploadCore.maxFiles = this.maxFiles;
      this._uploadCore.maxFileSize = this.maxFileSize;
      this._uploadCore.accept = this.accept;
      this._uploadCore.formDataName = this.formDataName;
      this._uploadCore.noAuto = this.noAuto;
      this._uploadCore.withCredentials = this.withCredentials;
      this._uploadCore.uploadFormat = this.uploadFormat;
      this._uploadCore.maxConcurrentUploads = this.maxConcurrentUploads;
      this._uploadCore.nodrop = this.nodrop;
      this._uploadCore.capture = this.capture;
      this._uploadCore.i18n = this.__effectiveI18n;
      this._uploadCore._files = this.files;
    }

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

        const files = await this._uploadCore._getFilesFromDropEvent(event);
        this._addFiles(files);
      }
    }

    /**
     * Create XHR instance. Override to customize.
     * @protected
     */
    _createXhr() {
      return new XMLHttpRequest();
    }

    /**
     * Triggers the upload of any files that are not completed
     *
     * @param {!UploadFile | !Array<!UploadFile>=} files - Files being uploaded. Defaults to all outstanding files
     */
    uploadFiles(files = this.files) {
      if (!this._uploadCore) return;

      // Sync files to core before uploading
      this._uploadCore._files = this.files;
      this._uploadCore.uploadFiles(files);
    }

    /** @private */
    _renderFileList() {
      if (this._fileList && typeof this._fileList.requestContentUpdate === 'function') {
        this._fileList.requestContentUpdate();
      }
    }

    /** @private */
    _addFiles(files) {
      if (!this._uploadCore) return;

      // Ensure all properties are synced before adding files
      this.__syncAllCoreProperties();

      // Add files via core
      this._uploadCore.addFiles(files);

      // Sync back from core
      this.files = this._uploadCore.files;
    }

    /**
     * Add the file for uploading. Called internally for each file after picking files from dialog or dropping files.
     *
     * @param {!UploadFile} file File being added
     * @protected
     */
    _addFile(file) {
      this._addFiles([file]);
    }

    /**
     * Queue a file for upload.
     * @param {!UploadFile} file - File to queue
     * @private
     */
    _queueFileUpload(file) {
      if (!this._uploadCore) return;

      // Ensure all properties are synced before upload
      this.__syncAllCoreProperties();
      this._uploadCore._queueFileUpload(file);
    }

    /**
     * Upload a file.
     * @param {!UploadFile} file - File to upload
     * @private
     */
    _uploadFile(file) {
      if (!this._uploadCore) return;

      // Ensure all properties are synced before upload
      this.__syncAllCoreProperties();
      this._uploadCore._uploadFile(file);
    }

    /**
     * Retry uploading a file.
     * @param {!UploadFile} file - File to retry
     * @private
     */
    _retryFileUpload(file) {
      if (!this._uploadCore) return;

      // Ensure all properties are synced before upload
      this.__syncAllCoreProperties();
      this._uploadCore._retryFileUpload(file);
      this._updateFocus(this.files.indexOf(file));
    }

    /**
     * Abort uploading a file.
     * @param {!UploadFile} file - File to abort
     * @private
     */
    _abortFileUpload(file) {
      if (!this._uploadCore) return;

      const fileIndex = this.files.indexOf(file);

      // Ensure all properties are synced before upload
      this.__syncAllCoreProperties();
      this._uploadCore._abortFileUpload(file);

      // Sync back from core
      this.files = this._uploadCore.files;
      this._updateFocus(fileIndex);
    }

    /**
     * Remove file from upload list. Called internally if file upload was canceled.
     * @param {!UploadFile} file File to remove
     * @protected
     */
    _removeFile(file) {
      if (!this._uploadCore) return;

      const fileIndex = this.files.indexOf(file);

      // Sync files to core
      this._uploadCore._files = this.files;
      this._uploadCore._removeFile(file);

      // Sync back from core
      this.files = this._uploadCore.files;
      this._updateFocus(fileIndex);
    }

    /** @private */
    _updateFocus(fileIndex) {
      if (this.files.length === 0) {
        this._addButton.focus({ focusVisible: isKeyboardActive() });
        return;
      }
      const lastFileRemoved = fileIndex === this.files.length;
      if (lastFileRemoved) {
        fileIndex -= 1;
      }
      this._fileList.children[fileIndex].firstElementChild.focus({ focusVisible: isKeyboardActive() });
    }

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
      this._addFiles(event.target.files);
    }

    /** @private */
    _onFileStart(event) {
      this._queueFileUpload(event.detail.file);
    }

    /** @private */
    _onFileRetry(event) {
      this._retryFileUpload(event.detail.file);
    }

    /** @private */
    _onFileAbort(event) {
      this._abortFileUpload(event.detail.file);
    }

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

    /** @private */
    _i18nPlural(value, plural) {
      return value === 1 ? plural.one : plural.many;
    }

    /** @protected */
    _isMultiple(maxFiles) {
      return maxFiles !== 1;
    }
  };
