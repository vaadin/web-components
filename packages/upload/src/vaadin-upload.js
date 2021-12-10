/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@vaadin/button/src/vaadin-button.js';
import './vaadin-upload-icons.js';
import './vaadin-upload-file.js';
import { resetMouseCanceller } from '@polymer/polymer/lib/utils/gestures.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { isTouch } from '@vaadin/component-base/src/browser-utils.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

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
 * Part name | Description
 * ---|---
 * `primary-buttons` | Upload container
 * `upload-button` | Upload button
 * `drop-label` | Label for drop indicator
 * `drop-label-icon` | Icon for drop indicator
 * `file-list` | File list container
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
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
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
 * @mixes ThemableMixin
 * @mixes ElementMixin
 */
class Upload extends ElementMixin(ThemableMixin(PolymerElement)) {
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

        [part='file-list'] {
          padding: 0;
          margin: 0;
          list-style-type: none;
        }
      </style>

      <div part="primary-buttons">
        <div id="addFiles" on-touchend="_onAddFilesTouchEnd" on-click="_onAddFilesClick">
          <slot name="add-button">
            <vaadin-button part="upload-button" id="addButton" disabled="[[maxFilesReached]]">
              [[_i18nPlural(maxFiles, i18n.addFiles, i18n.addFiles.*)]]
            </vaadin-button>
          </slot>
        </div>
        <div part="drop-label" hidden$="[[nodrop]]" id="dropLabelContainer" aria-hidden="true">
          <slot name="drop-label-icon">
            <div part="drop-label-icon"></div>
          </slot>
          <slot name="drop-label" id="dropLabel"> [[_i18nPlural(maxFiles, i18n.dropFiles, i18n.dropFiles.*)]] </slot>
        </div>
      </div>
      <slot name="file-list">
        <ul id="fileList" part="file-list">
          <template is="dom-repeat" items="[[files]]" as="file">
            <li>
              <vaadin-upload-file tabindex="0" file="[[file]]" i18n="[[i18n]]"></vaadin-upload-file>
            </li>
          </template>
        </ul>
      </slot>
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
        value: isTouch
      },

      /**
       * The server URL. The default value is an empty string, which means that
       * _window.location_ will be used.
       * @type {string}
       */
      target: {
        type: String,
        value: ''
      },

      /**
       * HTTP Method used to send the files. Only POST and PUT are allowed.
       * @type {!UploadMethod}
       */
      method: {
        type: String,
        value: 'POST'
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
        value: {}
      },

      /**
       * Max time in milliseconds for the entire upload process, if exceeded the
       * request will be aborted. Zero means that there is no timeout.
       * @type {number}
       */
      timeout: {
        type: Number,
        value: 0
      },

      /** @private */
      _dragover: {
        type: Boolean,
        value: false,
        observer: '_dragoverChanged'
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
        value: function () {
          return [];
        }
      },

      /**
       * Limit of files to upload, by default it is unlimited. If the value is
       * set to one, native file browser will prevent selecting multiple files.
       * @attr {number} max-files
       * @type {number}
       */
      maxFiles: {
        type: Number,
        value: Infinity
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
        computed: '_maxFilesAdded(maxFiles, files.length)'
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
        value: ''
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
        value: Infinity
      },

      /**
       * Specifies if the dragover is validated with maxFiles and
       * accept properties.
       * @private
       */
      _dragoverValid: {
        type: Boolean,
        value: false,
        observer: '_dragoverValidChanged'
      },

      /**
       * Specifies the 'name' property at Content-Disposition
       * @attr {string} form-data-name
       * @type {string}
       */
      formDataName: {
        type: String,
        value: 'file'
      },

      /**
       * Prevents upload(s) from immediately uploading upon adding file(s).
       * When set, you must manually trigger uploads using the `uploadFiles` method
       * @attr {boolean} no-auto
       * @type {boolean}
       */
      noAuto: {
        type: Boolean,
        value: false
      },

      /**
       * Set the withCredentials flag on the request.
       * @attr {boolean} with-credentials
       * @type {boolean}
       */
      withCredentials: {
        type: Boolean,
        value: false
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
        value: function () {
          return {
            dropFiles: {
              one: 'Drop file here',
              many: 'Drop files here'
            },
            addFiles: {
              one: 'Upload File...',
              many: 'Upload Files...'
            },
            error: {
              tooManyFiles: 'Too Many Files.',
              fileIsTooBig: 'File is Too Big.',
              incorrectFileType: 'Incorrect File Type.'
            },
            uploading: {
              status: {
                connecting: 'Connecting...',
                stalled: 'Stalled',
                processing: 'Processing File...',
                held: 'Queued'
              },
              remainingTime: {
                prefix: 'remaining time: ',
                unknown: 'unknown remaining time'
              },
              error: {
                serverUnavailable: 'Upload failed, please try again later',
                unexpectedServerError: 'Upload failed due to server error',
                forbidden: 'Upload forbidden'
              }
            },
            file: {
              retry: 'Retry',
              start: 'Start',
              remove: 'Remove'
            },
            units: {
              size: ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
            }
          };
        }
      }
    };
  }

  /** @protected */
  ready() {
    super.ready();
    this.addEventListener('dragover', this._onDragover.bind(this));
    this.addEventListener('dragleave', this._onDragleave.bind(this));
    this.addEventListener('drop', this._onDrop.bind(this));
    this.addEventListener('file-retry', this._onFileRetry.bind(this));
    this.addEventListener('file-abort', this._onFileAbort.bind(this));
    this.addEventListener('file-remove', this._onFileRemove.bind(this));
    this.addEventListener('file-start', this._onFileStart.bind(this));
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
    const size = parseFloat((bytes / Math.pow(base, unit)).toFixed(dec));
    return size + ' ' + this.i18n.units.size[unit];
  }

  /** @private */
  _splitTimeByUnits(time) {
    const unitSizes = [60, 60, 24, Infinity];
    const timeValues = [0];

    for (var i = 0; i < unitSizes.length && time > 0; i++) {
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
    return (
      file.totalStr +
      ': ' +
      file.progress +
      '% (' +
      (file.loaded > 0
        ? this.i18n.uploading.remainingTime.prefix + file.remainingStr
        : this.i18n.uploading.remainingTime.unknown) +
      ')'
    );
  }

  /** @private */
  _maxFilesAdded(maxFiles, numFiles) {
    return maxFiles >= 0 && numFiles >= maxFiles;
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
    if (typeof this.headers == 'string') {
      try {
        this.headers = JSON.parse(this.headers);
      } catch (e) {
        this.headers = undefined;
      }
    }
    for (var key in this.headers) {
      xhr.setRequestHeader(key, this.headers[key]);
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
  uploadFiles(files) {
    if (files && !Array.isArray(files)) {
      files = [files];
    }
    files = files || this.files;
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
    // onprogress is called always after onreadystatechange
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
            this._notifyFileChanges(file);
          }, 2000);
        } else {
          file.loadedStr = file.totalStr;
          file.status = this.i18n.uploading.status.processing;
        }
      }

      this._notifyFileChanges(file);
      this.dispatchEvent(new CustomEvent('upload-progress', { detail: { file, xhr } }));
    };

    // More reliable than xhr.onload
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        clearTimeout(stalledId);
        file.indeterminate = file.uploading = false;
        if (file.abort) {
          this._notifyFileChanges(file);
          return;
        }
        file.status = '';
        // Custom listener can modify the default behavior either
        // preventing default, changing the xhr, or setting the file error
        const evt = this.dispatchEvent(
          new CustomEvent('upload-response', {
            detail: { file, xhr },
            cancelable: true
          })
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
            detail: { file, xhr }
          })
        );
        this._notifyFileChanges(file);
      }
    };

    const formData = new FormData();

    file.uploadTarget = file.uploadTarget || this.target || '';
    file.formDataName = this.formDataName;

    const evt = this.dispatchEvent(
      new CustomEvent('upload-before', {
        detail: { file, xhr },
        cancelable: true
      })
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
          detail: { file, xhr }
        })
      );
      this._notifyFileChanges(file);
    };

    // Custom listener could modify the xhr just before sending it
    // preventing default
    const uploadEvt = this.dispatchEvent(
      new CustomEvent('upload-request', {
        detail: { file, xhr, formData },
        cancelable: true
      })
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
        cancelable: true
      })
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
        cancelable: true
      })
    );
    if (evt) {
      file.abort = true;
      if (file.xhr) {
        file.xhr.abort();
      }
      this._notifyFileChanges(file);
    }
  }

  /** @private */
  _notifyFileChanges(file) {
    var p = 'files.' + this.files.indexOf(file) + '.';
    for (let i in file) {
      // eslint-disable-next-line no-prototype-builtins
      if (file.hasOwnProperty(i)) {
        this.notifyPath(p + i, file[i]);
      }
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
          detail: { file, error: this.i18n.error.tooManyFiles }
        })
      );
      return;
    }
    if (this.maxFileSize >= 0 && file.size > this.maxFileSize) {
      this.dispatchEvent(
        new CustomEvent('file-reject', {
          detail: { file, error: this.i18n.error.fileIsTooBig }
        })
      );
      return;
    }
    const fileExt = file.name.match(/\.[^.]*$|$/)[0];
    const re = new RegExp('^(' + this.accept.replace(/[, ]+/g, '|').replace(/\/\*/g, '/.*') + ')$', 'i');
    if (this.accept && !(re.test(file.type) || re.test(fileExt))) {
      this.dispatchEvent(
        new CustomEvent('file-reject', {
          detail: { file, error: this.i18n.error.incorrectFileType }
        })
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
    }
  }

  /** @private */
  _onAddFilesTouchEnd(e) {
    // Cancel the event to avoid the following click event
    e.preventDefault();
    // FIXME(platosha): workaround for Polymer Gestures mouseCanceller
    // cancelling the following synthetic click. See also:
    // https://github.com/Polymer/polymer/issues/5289
    this.__resetMouseCanceller();
    this._onAddFilesClick(e);
  }

  /** @private */
  __resetMouseCanceller() {
    resetMouseCanceller();
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
  _onFileRemove(event) {
    this._removeFile(event.detail.file);
  }

  /** @private */
  _dragoverChanged(dragover) {
    dragover ? this.setAttribute('dragover', dragover) : this.removeAttribute('dragover');
  }

  /** @private */
  _dragoverValidChanged(dragoverValid) {
    dragoverValid ? this.setAttribute('dragover-valid', dragoverValid) : this.removeAttribute('dragover-valid');
  }

  /** @private */
  _i18nPlural(value, plural) {
    return value == 1 ? plural.one : plural.many;
  }

  /** @private */
  _isMultiple(maxFiles) {
    return maxFiles != 1;
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
