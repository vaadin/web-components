/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { announce } from '@vaadin/a11y-base/src/announce.js';

/**
 * Default i18n strings for upload orchestrator.
 * @private
 */
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

/**
 * A pure JavaScript class that orchestrates file uploads without requiring
 * a DOM element. It can manage external UI components like file lists,
 * add buttons, and drop zones.
 *
 * @example
 * ```javascript
 * import { UploadOrchestrator } from '@vaadin/upload';
 *
 * const orchestrator = new UploadOrchestrator({
 *   target: '/api/upload',
 *   maxFiles: 5,
 *   fileList: document.getElementById('file-list'),
 *   addButton: document.getElementById('add-button'),
 *   dropZone: document.getElementById('drop-zone')
 * });
 *
 * // Listen to events
 * orchestrator.addEventListener('upload-success', (e) => {
 *   console.log('File uploaded:', e.detail.file.name);
 * });
 *
 * // Clean up when done
 * orchestrator.destroy();
 * ```
 *
 * @fires {CustomEvent} file-reject - Fired when a file cannot be added due to constraints
 * @fires {CustomEvent} file-remove - Fired when a file is removed from the list
 * @fires {CustomEvent} upload-before - Fired before the XHR is opened (can modify uploadTarget)
 * @fires {CustomEvent} upload-request - Fired after the XHR is opened (can modify FormData/headers)
 * @fires {CustomEvent} upload-start - Fired when the upload starts
 * @fires {CustomEvent} upload-progress - Fired during upload progress
 * @fires {CustomEvent} upload-response - Fired when response is received
 * @fires {CustomEvent} upload-success - Fired on successful upload
 * @fires {CustomEvent} upload-error - Fired on upload error
 * @fires {CustomEvent} upload-retry - Fired when retry is requested
 * @fires {CustomEvent} upload-abort - Fired when abort is requested
 * @fires {CustomEvent} files-changed - Fired when the files array changes
 * @fires {CustomEvent} max-files-reached-changed - Fired when maxFilesReached changes
 */
export class UploadOrchestrator extends EventTarget {
  /**
   * Create an UploadOrchestrator instance.
   * @param {Object} options - Configuration options
   * @param {string} [options.target=''] - Server URL for uploads
   * @param {string} [options.method='POST'] - HTTP method (POST or PUT)
   * @param {Object} [options.headers={}] - Custom HTTP headers
   * @param {number} [options.timeout=0] - Upload timeout in milliseconds (0 = no timeout)
   * @param {number} [options.maxFiles=Infinity] - Maximum number of files allowed
   * @param {number} [options.maxFileSize=Infinity] - Maximum file size in bytes
   * @param {string} [options.accept=''] - Accepted file types (MIME types or extensions)
   * @param {string} [options.formDataName='file'] - Form data field name for multipart uploads
   * @param {boolean} [options.noAuto=false] - Prevent automatic upload on file addition
   * @param {boolean} [options.withCredentials=false] - Include credentials in XHR
   * @param {string} [options.uploadFormat='raw'] - Upload format: 'raw' or 'multipart'
   * @param {number} [options.maxConcurrentUploads=3] - Maximum concurrent uploads
   * @param {boolean} [options.nodrop=false] - Disable drag-and-drop
   * @param {HTMLElement} [options.fileList] - External file list element
   * @param {HTMLElement} [options.addButton] - External add button element
   * @param {HTMLElement} [options.dropZone] - External drop zone element
   * @param {Object} [options.i18n] - Localization object
   */
  constructor(options = {}) {
    super();

    // Configuration properties
    this.target = options.target ?? '';
    this.method = options.method ?? 'POST';
    this.headers = options.headers ?? {};
    this.timeout = options.timeout ?? 0;
    this.maxFiles = options.maxFiles ?? Infinity;
    this.maxFileSize = options.maxFileSize ?? Infinity;
    this.accept = options.accept ?? '';
    this.formDataName = options.formDataName ?? 'file';
    this.noAuto = options.noAuto ?? false;
    this.withCredentials = options.withCredentials ?? false;
    this.uploadFormat = options.uploadFormat ?? 'raw';
    this.maxConcurrentUploads = options.maxConcurrentUploads ?? 3;
    this.nodrop = options.nodrop ?? false;
    this.capture = options.capture;

    // State
    this._files = [];
    this._maxFilesReached = false;
    this._uploadQueue = [];
    this._activeUploads = 0;
    this._destroyed = false;

    // I18n
    this._i18n = { ...DEFAULT_I18N, ...options.i18n };

    // External UI elements
    this._fileList = null;
    this._addButton = null;
    this._dropZone = null;

    // Create hidden file input
    this._fileInput = document.createElement('input');
    this._fileInput.type = 'file';
    this._fileInput.style.display = 'none';
    this._fileInput.addEventListener('change', this._onFileInputChange.bind(this));
    document.body.appendChild(this._fileInput);

    // Bind event handlers
    this._boundOnAddButtonTouchEnd = this._onAddButtonTouchEnd.bind(this);
    this._boundOnAddButtonClick = this._onAddButtonClick.bind(this);
    this._boundOnDropZoneDragover = this._onDropZoneDragover.bind(this);
    this._boundOnDropZoneDragleave = this._onDropZoneDragleave.bind(this);
    this._boundOnDropZoneDrop = this._onDropZoneDrop.bind(this);
    this._boundOnFileListRetry = this._onFileListRetry.bind(this);
    this._boundOnFileListAbort = this._onFileListAbort.bind(this);
    this._boundOnFileListStart = this._onFileListStart.bind(this);

    // Set external elements if provided
    if (options.fileList) {
      this.fileList = options.fileList;
    }
    if (options.addButton) {
      this.addButton = options.addButton;
    }
    if (options.dropZone) {
      this.dropZone = options.dropZone;
    }
  }

  /**
   * The array of files being processed or already uploaded.
   * @type {Array<UploadFile>}
   */
  get files() {
    return this._files;
  }

  set files(value) {
    const oldValue = this._files;
    this._files = value;
    this._updateMaxFilesReached();
    this._updateFileList();
    this.dispatchEvent(
      new CustomEvent('files-changed', {
        detail: { value, oldValue },
      }),
    );
  }

  /**
   * Whether the maximum number of files has been reached.
   * @type {boolean}
   * @readonly
   */
  get maxFilesReached() {
    return this._maxFilesReached;
  }

  /**
   * The localization object.
   * @type {Object}
   */
  get i18n() {
    return this._i18n;
  }

  set i18n(value) {
    this._i18n = { ...DEFAULT_I18N, ...value };
    this._updateFileList();
  }

  /**
   * The external file list element.
   * @type {HTMLElement|null}
   */
  get fileList() {
    return this._fileList;
  }

  set fileList(element) {
    if (this._fileList) {
      this._removeFileListListeners(this._fileList);
    }
    this._fileList = element;
    if (element) {
      this._addFileListListeners(element);
      this._updateFileList();
    }
  }

  /**
   * The external add button element.
   * @type {HTMLElement|null}
   */
  get addButton() {
    return this._addButton;
  }

  set addButton(element) {
    if (this._addButton) {
      this._removeAddButtonListeners(this._addButton);
    }
    this._addButton = element;
    if (element) {
      this._addAddButtonListeners(element);
      this._updateAddButton();
    }
  }

  /**
   * The external drop zone element.
   * @type {HTMLElement|null}
   */
  get dropZone() {
    return this._dropZone;
  }

  set dropZone(element) {
    if (this._dropZone) {
      this._removeDropZoneListeners(this._dropZone);
    }
    this._dropZone = element;
    if (element) {
      this._addDropZoneListeners(element);
    }
  }

  /**
   * Clean up resources and remove all event listeners.
   * Call this when the orchestrator is no longer needed.
   */
  destroy() {
    this._destroyed = true;

    // Remove file input
    if (this._fileInput && this._fileInput.parentNode) {
      this._fileInput.parentNode.removeChild(this._fileInput);
    }

    // Abort all active uploads
    this._files.forEach((file) => {
      if (file.xhr && file.uploading) {
        file.xhr.abort();
      }
    });

    // Clear listeners
    this.fileList = null;
    this.addButton = null;
    this.dropZone = null;

    // Clear state
    this._files = [];
    this._uploadQueue = [];
    this._activeUploads = 0;
  }

  /**
   * Add files to the upload list.
   * @param {FileList|File[]} files - Files to add
   */
  addFiles(files) {
    if (this._destroyed) return;
    Array.from(files).forEach((file) => this._addFile(file));
  }

  /**
   * Triggers the upload of any files that are not completed.
   * @param {UploadFile|UploadFile[]} [files] - Files to upload. Defaults to all outstanding files.
   */
  uploadFiles(files = this._files) {
    if (this._destroyed) return;
    if (files && !Array.isArray(files)) {
      files = [files];
    }
    files.filter((file) => !file.complete).forEach((file) => this._queueFileUpload(file));
  }

  /**
   * Retry a failed upload.
   * @param {UploadFile} file - The file to retry
   */
  retryUpload(file) {
    if (this._destroyed) return;
    this._retryFileUpload(file);
  }

  /**
   * Abort an upload.
   * @param {UploadFile} file - The file to abort
   */
  abortUpload(file) {
    if (this._destroyed) return;
    this._abortFileUpload(file);
  }

  /**
   * Remove a file from the list.
   * @param {UploadFile} file - The file to remove
   */
  removeFile(file) {
    if (this._destroyed) return;
    this._removeFile(file);
  }

  /**
   * Open the file picker dialog.
   */
  openFilePicker() {
    if (this._destroyed || this._maxFilesReached) return;
    this._fileInput.value = '';
    this._fileInput.click();
  }

  // ============ Private methods ============

  /** @private */
  get _acceptRegexp() {
    if (!this.accept) {
      return null;
    }
    const processedTokens = this.accept.split(',').map((token) => {
      let processedToken = token.trim();
      processedToken = processedToken.replace(/[+.]/gu, '\\$&');
      if (processedToken.startsWith('\\.')) {
        processedToken = `.*${processedToken}$`;
      }
      return processedToken.replace(/\/\*/gu, '/.*');
    });
    return new RegExp(`^(${processedTokens.join('|')})$`, 'iu');
  }

  /** @private */
  _updateMaxFilesReached() {
    const reached = this.maxFiles >= 0 && this._files.length >= this.maxFiles;
    if (reached !== this._maxFilesReached) {
      this._maxFilesReached = reached;
      this._updateAddButton();
      this._updateFileInput();
      this.dispatchEvent(
        new CustomEvent('max-files-reached-changed', {
          detail: { value: reached },
        }),
      );
    }
  }

  /** @private */
  _updateFileInput() {
    if (this._fileInput) {
      this._fileInput.multiple = this.maxFiles !== 1;
      this._fileInput.accept = this.accept;
      if (this.capture) {
        this._fileInput.capture = this.capture;
      }
    }
  }

  /** @private */
  _updateFileList() {
    if (this._fileList) {
      this._fileList.items = [...this._files];
      this._fileList.i18n = this._i18n;
    }
  }

  /** @private */
  _updateAddButton() {
    if (this._addButton) {
      this._addButton.disabled = this._maxFilesReached;
    }
  }

  /** @private */
  _addFileListListeners(list) {
    list.addEventListener('file-retry', this._boundOnFileListRetry);
    list.addEventListener('file-abort', this._boundOnFileListAbort);
    list.addEventListener('file-start', this._boundOnFileListStart);
  }

  /** @private */
  _removeFileListListeners(list) {
    list.removeEventListener('file-retry', this._boundOnFileListRetry);
    list.removeEventListener('file-abort', this._boundOnFileListAbort);
    list.removeEventListener('file-start', this._boundOnFileListStart);
  }

  /** @private */
  _addAddButtonListeners(button) {
    button.addEventListener('touchend', this._boundOnAddButtonTouchEnd);
    button.addEventListener('click', this._boundOnAddButtonClick);
  }

  /** @private */
  _removeAddButtonListeners(button) {
    button.removeEventListener('touchend', this._boundOnAddButtonTouchEnd);
    button.removeEventListener('click', this._boundOnAddButtonClick);
  }

  /** @private */
  _addDropZoneListeners(zone) {
    zone.addEventListener('dragover', this._boundOnDropZoneDragover);
    zone.addEventListener('dragleave', this._boundOnDropZoneDragleave);
    zone.addEventListener('drop', this._boundOnDropZoneDrop);
  }

  /** @private */
  _removeDropZoneListeners(zone) {
    zone.removeEventListener('dragover', this._boundOnDropZoneDragover);
    zone.removeEventListener('dragleave', this._boundOnDropZoneDragleave);
    zone.removeEventListener('drop', this._boundOnDropZoneDrop);
  }

  /** @private */
  _onAddButtonTouchEnd(e) {
    e.preventDefault();
    this._onAddButtonClick(e);
  }

  /** @private */
  _onAddButtonClick(e) {
    if (this._maxFilesReached) return;
    e.stopPropagation();
    this.openFilePicker();
  }

  /** @private */
  _onDropZoneDragover(e) {
    e.preventDefault();
    if (!this.nodrop && !this._dragover) {
      this._dragoverValid = !this._maxFilesReached;
      this._dragover = true;
      if (this._dropZone) {
        this._dropZone.setAttribute('dragover', '');
      }
    }
    e.dataTransfer.dropEffect = !this._dragoverValid || this.nodrop ? 'none' : 'copy';
  }

  /** @private */
  _onDropZoneDragleave(e) {
    e.preventDefault();
    if (this._dragover && !this.nodrop) {
      this._dragover = this._dragoverValid = false;
      if (this._dropZone) {
        this._dropZone.removeAttribute('dragover');
      }
    }
  }

  /** @private */
  async _onDropZoneDrop(e) {
    if (!this.nodrop) {
      e.preventDefault();
      this._dragover = this._dragoverValid = false;
      if (this._dropZone) {
        this._dropZone.removeAttribute('dragover');
      }

      const files = await this._getFilesFromDropEvent(e);
      this.addFiles(files);
    }
  }

  /** @private */
  _onFileInputChange(e) {
    this.addFiles(e.target.files);
  }

  /** @private */
  _onFileListRetry(e) {
    this._retryFileUpload(e.detail.file);
  }

  /** @private */
  _onFileListAbort(e) {
    this._abortFileUpload(e.detail.file);
  }

  /** @private */
  _onFileListStart(e) {
    this._queueFileUpload(e.detail.file);
  }

  /** @private */
  _getFilesFromDropEvent(dropEvent) {
    async function getFilesFromEntry(entry) {
      if (entry.isFile) {
        return new Promise((resolve) => {
          entry.file(resolve, () => resolve([]));
        });
      } else if (entry.isDirectory) {
        const reader = entry.createReader();
        const entries = await new Promise((resolve) => {
          reader.readEntries(resolve, () => resolve([]));
        });
        const files = await Promise.all(entries.map(getFilesFromEntry));
        return files.flat();
      }
    }

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
  _addFile(file) {
    if (this._maxFilesReached) {
      this.dispatchEvent(
        new CustomEvent('file-reject', {
          detail: { file, error: this._i18n.error.tooManyFiles },
        }),
      );
      announce(`${file.name}: ${this._i18n.error.tooManyFiles}`, { mode: 'alert' });
      return;
    }
    if (this.maxFileSize >= 0 && file.size > this.maxFileSize) {
      this.dispatchEvent(
        new CustomEvent('file-reject', {
          detail: { file, error: this._i18n.error.fileIsTooBig },
        }),
      );
      announce(`${file.name}: ${this._i18n.error.fileIsTooBig}`, { mode: 'alert' });
      return;
    }
    const re = this._acceptRegexp;
    if (re && !(re.test(file.type) || re.test(file.name))) {
      this.dispatchEvent(
        new CustomEvent('file-reject', {
          detail: { file, error: this._i18n.error.incorrectFileType },
        }),
      );
      announce(`${file.name}: ${this._i18n.error.incorrectFileType}`, { mode: 'alert' });
      return;
    }

    file.loaded = 0;
    file.held = true;
    file.status = this._i18n.uploading.status.held;
    this.files = [file, ...this._files];

    if (!this.noAuto) {
      this._queueFileUpload(file);
    }
  }

  /** @private */
  _removeFile(file) {
    this._uploadQueue = this._uploadQueue.filter((f) => f !== file);
    this._processUploadQueue();

    const fileIndex = this._files.indexOf(file);
    if (fileIndex >= 0) {
      this.files = this._files.filter((f) => f !== file);

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
  _queueFileUpload(file) {
    if (file.uploading) {
      return;
    }

    file.held = true;
    file.uploading = file.indeterminate = true;
    file.complete = file.abort = file.error = false;
    file.status = this._i18n.uploading.status.held;
    this._updateFileList();

    this._uploadQueue.push(file);
    this._processUploadQueue();
  }

  /** @private */
  _processUploadQueue() {
    while (this._uploadQueue.length > 0 && this._activeUploads < this.maxConcurrentUploads) {
      const nextFile = this._uploadQueue.shift();
      if (nextFile) {
        this._uploadFile(nextFile);
      }
    }
  }

  /** @private */
  _uploadFile(file) {
    this._activeUploads += 1;

    const ini = Date.now();
    const xhr = (file.xhr = this._createXhr());

    let stalledId, last;

    xhr.upload.onprogress = (e) => {
      clearTimeout(stalledId);

      last = Date.now();
      const elapsed = (last - ini) / 1000;
      const loaded = e.loaded;
      const total = e.total;
      const progress = ~~((loaded / total) * 100);
      file.loaded = loaded;
      file.progress = progress;
      file.indeterminate = loaded <= 0 || loaded >= total;

      if (file.error) {
        file.indeterminate = file.status = undefined;
      } else if (!file.abort) {
        if (progress < 100) {
          this._setStatus(file, total, loaded, elapsed);
          stalledId = setTimeout(() => {
            file.status = this._i18n.uploading.status.stalled;
            this._updateFileList();
          }, 2000);
        } else {
          file.loadedStr = file.totalStr;
          file.status = this._i18n.uploading.status.processing;
        }
      }

      this._updateFileList();
      this.dispatchEvent(new CustomEvent('upload-progress', { detail: { file, xhr } }));
    };

    xhr.onabort = () => {
      this._activeUploads -= 1;
      this._processUploadQueue();
    };

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        clearTimeout(stalledId);
        file.indeterminate = file.uploading = false;

        this._activeUploads -= 1;
        this._processUploadQueue();

        if (file.abort) {
          return;
        }
        file.status = '';

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
          file.error = this._i18n.uploading.error.serverUnavailable;
        } else if (xhr.status >= 500) {
          file.error = this._i18n.uploading.error.unexpectedServerError;
        } else if (xhr.status >= 400) {
          file.error = this._i18n.uploading.error.forbidden;
        }

        file.complete = !file.error;
        const eventName = file.error ? 'upload-error' : 'upload-success';
        this.dispatchEvent(new CustomEvent(eventName, { detail: { file, xhr } }));

        if (file.error) {
          announce(`${file.name}: ${file.error}`, { mode: 'alert' });
        } else {
          announce(`${file.name}: 100%`, { mode: 'alert' });
        }

        this._updateFileList();
      }
    };

    const isRawUpload = this.uploadFormat === 'raw';

    if (!file.uploadTarget) {
      file.uploadTarget = this.target || '';
    }

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
      requestBody = file;
    } else {
      const formData = new FormData();
      formData.append(file.formDataName, file, file.name);
      requestBody = formData;
    }

    xhr.open(this.method, file.uploadTarget, true);
    this._configureXhr(xhr, file, isRawUpload);

    file.held = false;
    file.status = this._i18n.uploading.status.connecting;

    xhr.upload.onloadstart = () => {
      this.dispatchEvent(
        new CustomEvent('upload-start', {
          detail: { file, xhr },
        }),
      );
      announce(`${file.name}: 0%`, { mode: 'alert' });
      this._updateFileList();
    };

    const eventDetail = {
      file,
      xhr,
      uploadFormat: this.uploadFormat,
      requestBody,
    };

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
  _createXhr() {
    return new XMLHttpRequest();
  }

  /** @private */
  _configureXhr(xhr, file = null, isRawUpload = false) {
    if (typeof this.headers === 'string') {
      try {
        this.headers = JSON.parse(this.headers);
      } catch (_) {
        this.headers = {};
      }
    }
    Object.entries(this.headers).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value);
    });

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
  _retryFileUpload(file) {
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

  /** @private */
  _formatSize(bytes) {
    if (typeof this._i18n.formatSize === 'function') {
      return this._i18n.formatSize(bytes);
    }

    const base = this._i18n.units.sizeBase || 1000;
    const unit = ~~(Math.log(bytes) / Math.log(base));
    const dec = Math.max(0, Math.min(3, unit - 1));
    const size = parseFloat((bytes / base ** unit).toFixed(dec));
    return `${size} ${this._i18n.units.size[unit]}`;
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
    if (typeof this._i18n.formatTime === 'function') {
      return this._i18n.formatTime(seconds, split);
    }

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
        ? this._i18n.uploading.remainingTime.prefix + file.remainingStr
        : this._i18n.uploading.remainingTime.unknown;

    return `${file.totalStr}: ${file.progress}% (${remainingTime})`;
  }
}
