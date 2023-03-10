/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@vaadin/button/src/vaadin-button.js';
import './vaadin-upload-icon.js';
import './vaadin-upload-icons.js';
import './vaadin-upload-file-list.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { announce } from '@vaadin/a11y-base/src/announce.js';
import { isTouch } from '@vaadin/component-base/src/browser-utils.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

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
 * `<vaadin-upload>` is a Web Component for uploading multiple files with drag and drop support.
 *
 * Example:
 *
 * ```
 * <vaadin-upload></vaadin-upload>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name          | Description
 * -------------------|-------------------------------------
 * `primary-buttons`  | Upload container
 * `drop-label`       | Element wrapping drop label and icon
 *
 * The following state attributes are available for styling:
 *
 * Attribute | Description | Part name
 * ---|---|---
 * `nodrop` | Set when drag and drop is disabled (e. g., on touch devices) | `:host`
 * `dragover` | A file is being dragged over the element | `:host`
 * `dragover-valid` | A dragged file is valid with `maxFiles` and `accept` criteria | `:host`
 * `max-files-reached` | The maximum number of files that the user is allowed to add to the upload has been reached | `:host`
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/custom-theme/styling-components) documentation.
 *
 * @fires {CustomEvent} file-reject - Fired when a file cannot be added to the queue due to a constrain.
 * @fires {CustomEvent} files-changed - Fired when the `files` property changes.
 * @fires {CustomEvent} max-files-reached-changed - Fired when the `maxFilesReached` property changes.
 * @fires {CustomEvent} upload-before - Fired before the XHR is opened.
 * @fires {CustomEvent} upload-start - Fired when the XHR is sent.
 * @fires {CustomEvent} upload-progress - Fired as many times as the progress is updated.
 * @fires {CustomEvent} upload-success - Fired in case the upload process succeeded.
 * @fires {CustomEvent} upload-error - Fired in case the upload process failed.
 * @fires {CustomEvent} upload-request - Fired when the XHR has been opened but not sent yet.
 * @fires {CustomEvent} upload-response - Fired when on the server response before analyzing it.
 * @fires {CustomEvent} upload-retry - Fired when retry upload is requested.
 * @fires {CustomEvent} upload-abort - Fired when upload abort is requested.
 *
 * @extends HTMLElement
 * @mixes ControllerMixin
 * @mixes ThemableMixin
 * @mixes ElementMixin
 */
class Upload extends ElementMixin(ThemableMixin(ControllerMixin(PolymerElement))) {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          position: relative;
          box-sizing: border-box;
        }

        :host([hidden]) {
          display: none !important;
        }

        [hidden] {
          display: none !important;
        }
      </style>

      <div part="primary-buttons">
        <slot name="add-button"></slot>
        <div part="drop-label" hidden$="[[nodrop]]" id="dropLabelContainer" aria-hidden="true">
          <slot name="drop-label-icon"></slot>
          <slot name="drop-label"></slot>
        </div>
      </div>
      <slot name="file-list"></slot>
      <slot></slot>
      <input
        type="file"
        id="fileInput"
        hidden
        on-change="_onFileInputChange"
        accept$="{{accept}}"
        multiple$="[[_isMultiple(maxFiles)]]"
        capture$="[[capture]]"
      />
    `;
  }

  static get is() {
    return 'vaadin-upload';
  }

  static get properties() {
    return {
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
       * ```
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
        computed: '_maxFilesAdded(maxFiles, files.length)',
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
       * Specifies the 'name' property at Content-Disposition
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
       * Pass-through to input's capture attribute. Allows user to trigger device inputs
       * such as camera or microphone immediately.
       */
      capture: String,

      /**
       * The object used to localize this component.
       * For changing the default localization, change the entire
       * _i18n_ object or just the property you want to modify.
       *
       * The object has the following JSON structure and default values:
       *
       * ```
       * {
       *   dropFiles: {
       *     one: 'Drop file here',
       *     many: 'Drop files here'
       *   },
       *   addFiles: {
       *     one: 'Select File...',
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
       *       serverUnavailable: 'Server Unavailable',
       *       unexpectedServerError: 'Unexpected Server Error',
       *       forbidden: 'Forbidden'
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
       *
       * @type {!UploadI18n}
       * @default {English}
       */
      i18n: {
        type: Object,
        value() {
          return {
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
        },
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

      /** @private */
      _files: {
        type: Array,
      },
    };
  }

  static get observers() {
    return [
      '__updateAddButton(_addButton, maxFiles, i18n, maxFilesReached)',
      '__updateDropLabel(_dropLabel, maxFiles, i18n)',
      '__updateFileList(_fileList, files, i18n)',
    ];
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
    if (typeof this.i18n.formatSize === 'function') {
      return this.i18n.formatSize(bytes);
    }

    // https://wiki.ubuntu.com/UnitsPolicy
    const base = this.i18n.units.sizeBase || 1000;
    const unit = ~~(Math.log(bytes) / Math.log(base));
    const dec = Math.max(0, Math.min(3, unit - 1));
    const size = parseFloat((bytes / base ** unit).toFixed(dec));
    return `${size} ${this.i18n.units.size[unit]}`;
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
    if (typeof this.i18n.formatTime === 'function') {
      return this.i18n.formatTime(seconds, split);
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
        ? this.i18n.uploading.remainingTime.prefix + file.remainingStr
        : this.i18n.uploading.remainingTime.unknown;

    return `${file.totalStr}: ${file.progress}% (${remainingTime})`;
  }

  /** @private */
  _maxFilesAdded(maxFiles, numFiles) {
    return maxFiles >= 0 && numFiles >= maxFiles;
  }

  /** @private */
  __updateAddButton(addButton, maxFiles, i18n, maxFilesReached) {
    if (addButton) {
      addButton.disabled = maxFilesReached;

      // Only update text content for the default button element
      if (addButton === this._addButtonController.defaultNode) {
        addButton.textContent = this._i18nPlural(maxFiles, i18n.addFiles);
      }
    }
  }

  /** @private */
  __updateDropLabel(dropLabel, maxFiles, i18n) {
    // Only update text content for the default label element
    if (dropLabel && dropLabel === this._dropLabelController.defaultNode) {
      dropLabel.textContent = this._i18nPlural(maxFiles, i18n.dropFiles);
    }
  }

  /** @private */
  __updateFileList(list, files, i18n) {
    if (list) {
      list.items = [...files];
      list.i18n = i18n;
    }
  }

  /** @private */
  _onDragover(event) {
    event.preventDefault();
    if (!this.nodrop && !this._dragover) {
      this._dragoverValid = !this.maxFilesReached;
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
  _onDrop(event) {
    if (!this.nodrop) {
      event.preventDefault();
      this._dragover = this._dragoverValid = false;
      this._addFiles(event.dataTransfer.files);
    }
  }

  /** @private */
  _createXhr() {
    return new XMLHttpRequest();
  }

  /** @private */
  _configureXhr(xhr) {
    if (typeof this.headers === 'string') {
      try {
        this.headers = JSON.parse(this.headers);
      } catch (e) {
        this.headers = undefined;
      }
    }
    Object.entries(this.headers).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value);
    });
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
            file.status = this.i18n.uploading.status.stalled;
            this._renderFileList();
          }, 2000);
        } else {
          file.loadedStr = file.totalStr;
          file.status = this.i18n.uploading.status.processing;
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
          file.error = this.i18n.uploading.error.serverUnavailable;
        } else if (xhr.status >= 500) {
          file.error = this.i18n.uploading.error.unexpectedServerError;
        } else if (xhr.status >= 400) {
          file.error = this.i18n.uploading.error.forbidden;
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

    const formData = new FormData();

    file.uploadTarget = file.uploadTarget || this.target || '';
    file.formDataName = this.formDataName;

    const evt = this.dispatchEvent(
      new CustomEvent('upload-before', {
        detail: { file, xhr },
        cancelable: true,
      }),
    );
    if (!evt) {
      return;
    }

    formData.append(file.formDataName, file, file.name);

    xhr.open(this.method, file.uploadTarget, true);
    this._configureXhr(xhr);

    file.status = this.i18n.uploading.status.connecting;
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
    const uploadEvt = this.dispatchEvent(
      new CustomEvent('upload-request', {
        detail: { file, xhr, formData },
        cancelable: true,
      }),
    );
    if (uploadEvt) {
      xhr.send(formData);
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
    if (this._fileList) {
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
          detail: { file, error: this.i18n.error.tooManyFiles },
        }),
      );
      return;
    }
    if (this.maxFileSize >= 0 && file.size > this.maxFileSize) {
      this.dispatchEvent(
        new CustomEvent('file-reject', {
          detail: { file, error: this.i18n.error.fileIsTooBig },
        }),
      );
      return;
    }
    // Escape regex operators common to mime types
    const escapedAccept = this.accept.replace(/[+.]/gu, '\\$&');
    // Make extension patterns match the end of the file name
    const acceptWithUpdatedExtensions = escapedAccept.replace(/\\\.[^,]*($|(?=,))/gu, (extension) => `.*${extension}$`);
    // Create accept regex that can match comma separated patterns, star (*) wildcards
    const re = new RegExp(`^(${acceptWithUpdatedExtensions.replace(/[, ]+/gu, '|').replace(/\/\*/gu, '/.*')})$`, 'iu');
    if (this.accept && !(re.test(file.type) || re.test(file.name))) {
      this.dispatchEvent(
        new CustomEvent('file-reject', {
          detail: { file, error: this.i18n.error.incorrectFileType },
        }),
      );
      return;
    }
    file.loaded = 0;
    file.held = true;
    file.status = this.i18n.uploading.status.held;
    this.files = [file, ...this.files];

    if (!this.noAuto) {
      this._uploadFile(file);
    }
  }

  /**
   * Remove file from upload list. Called internally if file upload was canceled.
   * @param {!UploadFile} file File to remove
   * @protected
   */
  _removeFile(file) {
    if (this.files.indexOf(file) > -1) {
      this.files = this.files.filter((i) => i !== file);

      this.dispatchEvent(
        new CustomEvent('file-remove', {
          detail: { file },
          bubbles: true,
          composed: true,
        }),
      );
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
    announce(`${event.detail.file.name}: ${event.detail.file.error}`, { mode: 'alert' });
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

  /** @private */
  _isMultiple(maxFiles) {
    return maxFiles !== 1;
  }

  /**
   * Fired when a file cannot be added to the queue due to a constrain:
   *  file-size, file-type or maxFiles
   *
   * @event file-reject
   * @param {Object} detail
   * @param {Object} detail.file the file added
   * @param {string} detail.error the cause
   */

  /**
   * Fired before the XHR is opened. Could be used for changing the request
   * URL. If the default is prevented, then XHR would not be opened.
   *
   * @event upload-before
   * @param {Object} detail
   * @param {Object} detail.xhr the xhr
   * @param {Object} detail.file the file being uploaded
   * @param {Object} detail.file.uploadTarget the upload request URL, initialized with the value of vaadin-upload `target` property
   */

  /**
   * Fired when the XHR has been opened but not sent yet. Useful for appending
   * data keys to the FormData object, for changing some parameters like
   * headers, etc. If the event is defaultPrevented, `vaadin-upload` will not
   * send the request allowing the user to do something on his own.
   *
   * @event upload-request
   * @param {Object} detail
   * @param {Object} detail.xhr the xhr
   * @param {Object} detail.file the file being uploaded
   * @param {Object} detail.formData the FormData object
   */

  /**
   * Fired when the XHR is sent.
   *
   * @event upload-start
   * @param {Object} detail
   * @param {Object} detail.xhr the xhr
   * @param {Object} detail.file the file being uploaded
   */

  /**
   * Fired as many times as the progress is updated.
   *
   * @event upload-progress
   * @param {Object} detail
   * @param {Object} detail.xhr the xhr
   * @param {Object} detail.file the file being uploaded with loaded info
   */

  /**
   * Fired when we have the actual server response, and before the component
   * analyses it. It's useful for developers to make the upload fail depending
   * on the server response. If the event is defaultPrevented the vaadin-upload
   * will return allowing the user to do something on his own like retry the
   * upload, etc. since he has full access to the `xhr` and `file` objects.
   * Otherwise, if the event is not prevented default `vaadin-upload` continues
   * with the normal workflow checking the `xhr.status` and `file.error`
   * which also might be modified by the user to force a customized response.
   *
   * @event upload-response
   * @param {Object} detail
   * @param {Object} detail.xhr the xhr
   * @param {Object} detail.file the file being uploaded
   */

  /**
   * Fired in case the upload process succeed.
   *
   * @event upload-success
   * @param {Object} detail
   * @param {Object} detail.xhr the xhr
   * @param {Object} detail.file the file being uploaded with loaded info
   */

  /**
   * Fired in case the upload process failed.
   *
   * @event upload-error
   * @param {Object} detail
   * @param {Object} detail.xhr the xhr
   * @param {Object} detail.file the file being uploaded
   */

  /**
   * Fired when retry upload is requested. If the default is prevented, then
   * retry would not be performed.
   *
   * @event upload-retry
   * @param {Object} detail
   * @param {Object} detail.xhr the previous upload xhr
   * @param {Object} detail.file the file being uploaded
   */

  /**
   * Fired when retry abort is requested. If the default is prevented, then the
   * file upload would not be aborted.
   *
   * @event upload-abort
   * @param {Object} detail
   * @param {Object} detail.xhr the xhr
   * @param {Object} detail.file the file being uploaded
   */
}

customElements.define(Upload.is, Upload);

export { Upload };
