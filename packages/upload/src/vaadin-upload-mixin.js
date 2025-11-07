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

const DEFAULT_I18N = {
  dropFiles: {
    one: 'Drop file here',
    many: 'Drop files here',
  },
  addFiles: {
    one: 'Upload File...',
    many: 'Upload Files...',
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
  file: {
    retry: 'Retry',
    start: 'Start',
    remove: 'Remove',
  },
  units: {
    size: ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
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

        /** @private */
        _files: {
          type: Array,
        },
      };
    }

    static get observers() {
      return [
        '__updateAddButton(_addButton, maxFiles, __effectiveI18n, maxFilesReached, disabled)',
        '__updateDropLabel(_dropLabel, maxFiles, __effectiveI18n)',
        '__updateFileList(_fileList, files, __effectiveI18n, disabled)',
        '__updateMaxFilesReached(maxFiles, files)',
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

    /** @private */
    get __acceptRegexp() {
      if (!this.accept) {
        return null;
      }
      const processedTokens = this.accept.split(',').map((token) => {
        let processedToken = token.trim();
        // Escape regex operators common to mime types
        processedToken = processedToken.replace(/[+.]/gu, '\\$&');
        // Make extension patterns match the end of the file name
        if (processedToken.startsWith('\\.')) {
          processedToken = `.*${processedToken}$`;
        }
        // Handle star (*) wildcards
        return processedToken.replace(/\/\*/gu, '/.*');
      });
      // Create accept regex
      return new RegExp(`^(${processedTokens.join('|')})$`, 'iu');
    }

    /** @protected */
    ready() {
      super.ready();
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
    _formatSize(bytes) {
      if (typeof this.__effectiveI18n.formatSize === 'function') {
        return this.__effectiveI18n.formatSize(bytes);
      }

      // https://wiki.ubuntu.com/UnitsPolicy
      const base = this.__effectiveI18n.units.sizeBase || 1000;
      const unit = ~~(Math.log(bytes) / Math.log(base));
      const dec = Math.max(0, Math.min(3, unit - 1));
      const size = parseFloat((bytes / base ** unit).toFixed(dec));
      return `${size} ${this.__effectiveI18n.units.size[unit]}`;
    }

    /** @private */
    _splitTimeByUnits(time) {
      const unitSizes = [60, 60, 24, Infinity];
      const timeValues = [0];

      for (let i = 0; i < unitSizes.length && time > 0; i++) {
        timeValues[i] = time % unitSizes[i];
        time = Math.floor(time / unitSizes[i]);
      }

      return timeValues;
    }

    /** @private */
    _formatTime(seconds, split) {
      if (typeof this.__effectiveI18n.formatTime === 'function') {
        return this.__effectiveI18n.formatTime(seconds, split);
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
    _formatFileProgress(file) {
      const remainingTime =
        file.loaded > 0
          ? this.__effectiveI18n.uploading.remainingTime.prefix + file.remainingStr
          : this.__effectiveI18n.uploading.remainingTime.unknown;

      return `${file.totalStr}: ${file.progress}% (${remainingTime})`;
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

        const files = await this.__getFilesFromDropEvent(event);
        this._addFiles(files);
      }
    }

    /**
     * Get the files from the drop event. The dropped items may contain a
     * combination of files and directories. If a dropped item is a directory,
     * it will be recursively traversed to get all files.
     *
     * @param {!DragEvent} dropEvent - The drop event
     * @returns {Promise<File[]>} - The files from the drop event
     * @private
     */
    __getFilesFromDropEvent(dropEvent) {
      async function getFilesFromEntry(entry) {
        if (entry.isFile) {
          return new Promise((resolve) => {
            // In case of an error, resolve without any files
            entry.file(resolve, () => resolve([]));
          });
        } else if (entry.isDirectory) {
          const reader = entry.createReader();
          const entries = await new Promise((resolve) => {
            // In case of an error, resolve without any files
            reader.readEntries(resolve, () => resolve([]));
          });
          const files = await Promise.all(entries.map(getFilesFromEntry));
          return files.flat();
        }
      }

      // In some cases (like dragging attachments from Outlook on Windows), "webkitGetAsEntry"
      // can return null for "dataTransfer" items. Also, there is no reason to check for
      // "webkitGetAsEntry" when there are no folders. Therefore, "dataTransfer.files" is used
      // to handle such cases.
      const containsFolders = Array.from(dropEvent.dataTransfer.items)
        .filter((item) => !!item)
        .filter((item) => typeof item.webkitGetAsEntry === 'function')
        .map((item) => item.webkitGetAsEntry())
        .some((entry) => !!entry && entry.isDirectory);
      if (!containsFolders) {
        return Promise.resolve(dropEvent.dataTransfer.files ? Array.from(dropEvent.dataTransfer.files) : []);
      }

      const filePromises = Array.from(dropEvent.dataTransfer.items)
        .map((item) => item.webkitGetAsEntry())
        .filter((entry) => !!entry)
        .map(getFilesFromEntry);

      return Promise.all(filePromises).then((files) => files.flat());
    }

    /** @private */
    _createXhr() {
      return new XMLHttpRequest();
    }

    /** @private */
    _configureXhr(xhr, file = null, isRawUpload = false) {
      if (typeof this.headers === 'string') {
        try {
          this.headers = JSON.parse(this.headers);
        } catch (_) {
          this.headers = undefined;
        }
      }
      Object.entries(this.headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });

      // Set Content-Type and filename header for raw binary uploads
      if (isRawUpload && file) {
        xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
        xhr.setRequestHeader('X-Filename', encodeURIComponent(file.name));
      }

      if (this.timeout) {
        xhr.timeout = this.timeout;
      }
      xhr.withCredentials = this.withCredentials;
    }

    /** @private */
    _setStatus(file, total, loaded, elapsed) {
      file.elapsed = elapsed;
      file.elapsedStr = this._formatTime(file.elapsed, this._splitTimeByUnits(file.elapsed));
      file.remaining = Math.ceil(elapsed * (total / loaded - 1));
      file.remainingStr = this._formatTime(file.remaining, this._splitTimeByUnits(file.remaining));
      file.speed = ~~(total / elapsed / 1024);
      file.totalStr = this._formatSize(total);
      file.loadedStr = this._formatSize(loaded);
      file.status = this._formatFileProgress(file);
    }

    /**
     * Triggers the upload of any files that are not completed
     *
     * @param {!UploadFile | !Array<!UploadFile>=} files - Files being uploaded. Defaults to all outstanding files
     */
    uploadFiles(files = this.files) {
      if (files && !Array.isArray(files)) {
        files = [files];
      }
      files = files.filter((file) => !file.complete);
      Array.prototype.forEach.call(files, this._uploadFile.bind(this));
    }

    /** @private */
    _uploadFile(file) {
      if (file.uploading) {
        return;
      }

      const ini = Date.now();
      const xhr = (file.xhr = this._createXhr());

      let stalledId, last;
      // Onprogress is called always after onreadystatechange
      xhr.upload.onprogress = (e) => {
        clearTimeout(stalledId);

        last = Date.now();
        const elapsed = (last - ini) / 1000;
        const loaded = e.loaded,
          total = e.total,
          progress = ~~((loaded / total) * 100);
        file.loaded = loaded;
        file.progress = progress;
        file.indeterminate = loaded <= 0 || loaded >= total;

        if (file.error) {
          file.indeterminate = file.status = undefined;
        } else if (!file.abort) {
          if (progress < 100) {
            this._setStatus(file, total, loaded, elapsed);
            stalledId = setTimeout(() => {
              file.status = this.__effectiveI18n.uploading.status.stalled;
              this._renderFileList();
            }, 2000);
          } else {
            file.loadedStr = file.totalStr;
            file.status = this.__effectiveI18n.uploading.status.processing;
          }
        }

        this._renderFileList();
        this.dispatchEvent(new CustomEvent('upload-progress', { detail: { file, xhr } }));
      };

      // More reliable than xhr.onload
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          clearTimeout(stalledId);
          file.indeterminate = file.uploading = false;
          if (file.abort) {
            return;
          }
          file.status = '';
          // Custom listener can modify the default behavior either
          // preventing default, changing the xhr, or setting the file error
          const evt = this.dispatchEvent(
            new CustomEvent('upload-response', {
              detail: { file, xhr },
              cancelable: true,
            }),
          );

          if (!evt) {
            return;
          }
          if (xhr.status === 0) {
            file.error = this.__effectiveI18n.uploading.error.serverUnavailable;
          } else if (xhr.status >= 500) {
            file.error = this.__effectiveI18n.uploading.error.unexpectedServerError;
          } else if (xhr.status >= 400) {
            file.error = this.__effectiveI18n.uploading.error.forbidden;
          }

          file.complete = !file.error;
          this.dispatchEvent(
            new CustomEvent(`upload-${file.error ? 'error' : 'success'}`, {
              detail: { file, xhr },
            }),
          );
          this._renderFileList();
        }
      };

      // Determine upload format and prepare request body
      const isRawUpload = this.uploadFormat === 'raw';

      if (!file.uploadTarget) {
        file.uploadTarget = this.target || '';
      }

      // Only set formDataName for multipart uploads
      if (!isRawUpload) {
        file.formDataName = this.formDataName;
      }

      const evt = this.dispatchEvent(
        new CustomEvent('upload-before', {
          detail: { file, xhr },
          cancelable: true,
        }),
      );
      if (!evt) {
        return;
      }

      let requestBody;
      if (isRawUpload) {
        // Raw binary upload - send file directly
        requestBody = file;
      } else {
        // Multipart upload - use FormData
        const formData = new FormData();
        formData.append(file.formDataName, file, file.name);
        requestBody = formData;
      }

      xhr.open(this.method, file.uploadTarget, true);
      this._configureXhr(xhr, file, isRawUpload);

      file.status = this.__effectiveI18n.uploading.status.connecting;
      file.uploading = file.indeterminate = true;
      file.complete = file.abort = file.error = file.held = false;

      xhr.upload.onloadstart = () => {
        this.dispatchEvent(
          new CustomEvent('upload-start', {
            detail: { file, xhr },
          }),
        );
        this._renderFileList();
      };

      // Custom listener could modify the xhr just before sending it
      // preventing default
      const eventDetail = {
        file,
        xhr,
        uploadFormat: this.uploadFormat,
        requestBody,
      };

      // Expose formData property when using multipart so listeners can modify it
      if (!isRawUpload) {
        eventDetail.formData = requestBody;
      }

      const uploadEvt = this.dispatchEvent(
        new CustomEvent('upload-request', {
          detail: eventDetail,
          cancelable: true,
        }),
      );
      if (uploadEvt) {
        xhr.send(requestBody);
      }
    }

    /** @private */
    _retryFileUpload(file) {
      const evt = this.dispatchEvent(
        new CustomEvent('upload-retry', {
          detail: { file, xhr: file.xhr },
          cancelable: true,
        }),
      );
      if (evt) {
        this._uploadFile(file);
        this._updateFocus(this.files.indexOf(file));
      }
    }

    /** @private */
    _abortFileUpload(file) {
      const evt = this.dispatchEvent(
        new CustomEvent('upload-abort', {
          detail: { file, xhr: file.xhr },
          cancelable: true,
        }),
      );
      if (evt) {
        file.abort = true;
        if (file.xhr) {
          file.xhr.abort();
        }
        this._removeFile(file);
      }
    }

    /** @private */
    _renderFileList() {
      if (this._fileList && typeof this._fileList.requestContentUpdate === 'function') {
        this._fileList.requestContentUpdate();
      }
    }

    /** @private */
    _addFiles(files) {
      Array.prototype.forEach.call(files, this._addFile.bind(this));
    }

    /**
     * Add the file for uploading. Called internally for each file after picking files from dialog or dropping files.
     *
     * @param {!UploadFile} file File being added
     * @protected
     */
    _addFile(file) {
      if (this.maxFilesReached) {
        this.dispatchEvent(
          new CustomEvent('file-reject', {
            detail: { file, error: this.__effectiveI18n.error.tooManyFiles },
          }),
        );
        return;
      }
      if (this.maxFileSize >= 0 && file.size > this.maxFileSize) {
        this.dispatchEvent(
          new CustomEvent('file-reject', {
            detail: { file, error: this.__effectiveI18n.error.fileIsTooBig },
          }),
        );
        return;
      }
      const re = this.__acceptRegexp;
      if (re && !(re.test(file.type) || re.test(file.name))) {
        this.dispatchEvent(
          new CustomEvent('file-reject', {
            detail: { file, error: this.__effectiveI18n.error.incorrectFileType },
          }),
        );
        return;
      }
      file.loaded = 0;
      file.held = true;
      file.status = this.__effectiveI18n.uploading.status.held;
      this.files = [file, ...this.files];

      if (!this.noAuto) {
        this._uploadFile(file);
      }
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

    /**
     * Remove file from upload list. Called internally if file upload was canceled.
     * @param {!UploadFile} file File to remove
     * @protected
     */
    _removeFile(file) {
      const fileIndex = this.files.indexOf(file);
      if (fileIndex >= 0) {
        this.files = this.files.filter((i) => i !== file);

        this.dispatchEvent(
          new CustomEvent('file-remove', {
            detail: { file },
            bubbles: true,
            composed: true,
          }),
        );

        this._updateFocus(fileIndex);
      }
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
      this._uploadFile(event.detail.file);
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
