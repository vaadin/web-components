/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * Default i18n strings for upload.
 */
export const DEFAULT_UPLOAD_I18N = {
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
 * Core upload logic shared between UploadOrchestrator and UploadMixin.
 * This class handles all upload operations including file validation,
 * XHR management, queue processing, and progress tracking.
 *
 * @fires {CustomEvent} file-reject - Fired when a file cannot be added due to constraints
 * @fires {CustomEvent} file-remove - Fired when a file is removed from the list
 * @fires {CustomEvent} upload-before - Fired before the XHR is opened
 * @fires {CustomEvent} upload-request - Fired after the XHR is opened
 * @fires {CustomEvent} upload-start - Fired when the upload starts
 * @fires {CustomEvent} upload-progress - Fired during upload progress
 * @fires {CustomEvent} upload-response - Fired when response is received
 * @fires {CustomEvent} upload-success - Fired on successful upload
 * @fires {CustomEvent} upload-error - Fired on upload error
 * @fires {CustomEvent} upload-retry - Fired when retry is requested
 * @fires {CustomEvent} upload-abort - Fired when abort is requested
 */
export class UploadCore extends EventTarget {
  constructor() {
    super();

    // Configuration properties with defaults
    this._target = '';
    this._method = 'POST';
    this._headers = {};
    this._timeout = 0;
    this._maxFiles = Infinity;
    this._maxFileSize = Infinity;
    this._accept = '';
    this._formDataName = 'file';
    this._noAuto = false;
    this._withCredentials = false;
    this._uploadFormat = 'raw';
    this._maxConcurrentUploads = 3;
    this._nodrop = false;
    this._capture = undefined;

    // State
    this._files = [];
    this._maxFilesReached = false;
    this._uploadQueue = [];
    this._activeUploads = 0;

    // I18n
    this._i18n = { ...DEFAULT_UPLOAD_I18N };
  }

  // ============ Configuration getters/setters ============

  get target() {
    return this._target;
  }

  set target(value) {
    this._target = value == null ? '' : value;
  }

  get method() {
    return this._method;
  }

  set method(value) {
    this._method = value == null ? 'POST' : value;
  }

  get headers() {
    return this._headers;
  }

  set headers(value) {
    this._headers = value == null ? {} : value;
  }

  get timeout() {
    return this._timeout;
  }

  set timeout(value) {
    this._timeout = value == null ? 0 : value;
  }

  get maxFiles() {
    return this._maxFiles;
  }

  set maxFiles(value) {
    this._maxFiles = value == null ? Infinity : value;
    this._updateMaxFilesReached();
  }

  get maxFileSize() {
    return this._maxFileSize;
  }

  set maxFileSize(value) {
    this._maxFileSize = value == null ? Infinity : value;
  }

  get accept() {
    return this._accept;
  }

  set accept(value) {
    this._accept = value == null ? '' : value;
  }

  get formDataName() {
    return this._formDataName;
  }

  set formDataName(value) {
    this._formDataName = value == null ? 'file' : value;
  }

  get noAuto() {
    return this._noAuto;
  }

  set noAuto(value) {
    this._noAuto = value == null ? false : value;
  }

  get withCredentials() {
    return this._withCredentials;
  }

  set withCredentials(value) {
    this._withCredentials = value == null ? false : value;
  }

  get uploadFormat() {
    return this._uploadFormat;
  }

  set uploadFormat(value) {
    this._uploadFormat = value == null ? 'raw' : value;
  }

  get maxConcurrentUploads() {
    return this._maxConcurrentUploads;
  }

  set maxConcurrentUploads(value) {
    this._maxConcurrentUploads = value == null ? 3 : value;
  }

  get nodrop() {
    return this._nodrop;
  }

  set nodrop(value) {
    this._nodrop = value == null ? false : value;
  }

  get capture() {
    return this._capture;
  }

  set capture(value) {
    this._capture = value;
  }

  // ============ State getters/setters ============

  get files() {
    return this._files;
  }

  set files(value) {
    const oldValue = this._files;
    this._files = value;
    this._updateMaxFilesReached();
    this._onFilesChanged(value, oldValue);
  }

  get maxFilesReached() {
    return this._maxFilesReached;
  }

  get i18n() {
    return this._i18n;
  }

  set i18n(value) {
    this._i18n = { ...DEFAULT_UPLOAD_I18N, ...value };
    this._onI18nChanged();
  }

  // ============ Internal getters ============

  /** @protected */
  get _acceptRegexp() {
    if (!this._accept) {
      return null;
    }
    const processedTokens = this._accept.split(',').map((token) => {
      let processedToken = token.trim();
      processedToken = processedToken.replace(/[+.]/gu, '\\$&');
      if (processedToken.startsWith('\\.')) {
        processedToken = `.*${processedToken}$`;
      }
      return processedToken.replace(/\/\*/gu, '/.*');
    });
    return new RegExp(`^(${processedTokens.join('|')})$`, 'iu');
  }

  // ============ Public methods ============

  /**
   * Add files to the upload list.
   * @param {FileList|File[]} files - Files to add
   */
  addFiles(files) {
    Array.from(files).forEach((file) => this._addFile(file));
  }

  /**
   * Triggers the upload of any files that are not completed.
   * @param {UploadFile|UploadFile[]} [files] - Files to upload. Defaults to all outstanding files.
   */
  uploadFiles(files = this._files) {
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
    this._retryFileUpload(file);
  }

  /**
   * Abort an upload.
   * @param {UploadFile} file - The file to abort
   */
  abortUpload(file) {
    this._abortFileUpload(file);
  }

  /**
   * Remove a file from the list.
   * @param {UploadFile} file - The file to remove
   */
  removeFile(file) {
    this._removeFile(file);
  }

  // ============ Protected callback methods (override in subclasses) ============

  /**
   * Called when files array changes.
   * @param {UploadFile[]} _files - New files array
   * @param {UploadFile[]} _oldFiles - Previous files array
   * @protected
   */
  _onFilesChanged(_files, _oldFiles) {
    // Override in subclasses
  }

  /**
   * Called when i18n changes.
   * @protected
   */
  _onI18nChanged() {
    // Override in subclasses
  }

  /**
   * Called when maxFilesReached changes.
   * @param {boolean} _reached - Whether max files is reached
   * @protected
   */
  _onMaxFilesReachedChanged(_reached) {
    // Override in subclasses
  }

  /**
   * Called when file list needs to be re-rendered.
   * @protected
   */
  _renderFileList() {
    // Override in subclasses
  }

  /**
   * Called when a file is rejected.
   * @param {File} _file - The rejected file
   * @param {string} _error - The rejection reason
   * @protected
   */
  _onFileRejected(_file, _error) {
    // Override in subclasses for a11y announcements
  }

  /**
   * Called when upload starts.
   * @param {UploadFile} _file - The file being uploaded
   * @protected
   */
  _onUploadStarted(_file) {
    // Override in subclasses for a11y announcements
  }

  /**
   * Called when upload succeeds.
   * @param {UploadFile} _file - The uploaded file
   * @protected
   */
  _onUploadSucceeded(_file) {
    // Override in subclasses for a11y announcements
  }

  /**
   * Called when upload fails.
   * @param {UploadFile} _file - The failed file
   * @protected
   */
  _onUploadFailed(_file) {
    // Override in subclasses for a11y announcements
  }

  /**
   * Called after a file is removed to update focus.
   * @param {number} _fileIndex - The index of the removed file
   * @protected
   */
  _onFileRemoved(_fileIndex) {
    // Override in subclasses for focus management
  }

  // ============ Private methods ============

  /** @private */
  _updateMaxFilesReached() {
    const reached = this._maxFiles >= 0 && this._files.length >= this._maxFiles;
    if (reached !== this._maxFilesReached) {
      this._maxFilesReached = reached;
      this._onMaxFilesReachedChanged(reached);
    }
  }

  /** @private */
  _addFile(file) {
    if (this._maxFilesReached) {
      this.dispatchEvent(
        new CustomEvent('file-reject', {
          detail: { file, error: this._i18n.error.tooManyFiles },
        }),
      );
      this._onFileRejected(file, this._i18n.error.tooManyFiles);
      return;
    }
    if (this._maxFileSize >= 0 && file.size > this._maxFileSize) {
      this.dispatchEvent(
        new CustomEvent('file-reject', {
          detail: { file, error: this._i18n.error.fileIsTooBig },
        }),
      );
      this._onFileRejected(file, this._i18n.error.fileIsTooBig);
      return;
    }
    const re = this._acceptRegexp;
    if (re && !(re.test(file.type) || re.test(file.name))) {
      this.dispatchEvent(
        new CustomEvent('file-reject', {
          detail: { file, error: this._i18n.error.incorrectFileType },
        }),
      );
      this._onFileRejected(file, this._i18n.error.incorrectFileType);
      return;
    }

    file.loaded = 0;
    file.held = true;
    file.status = this._i18n.uploading.status.held;
    this.files = [file, ...this._files];

    if (!this._noAuto) {
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

      this._onFileRemoved(fileIndex);
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
    this._renderFileList();

    this._uploadQueue.push(file);
    this._processUploadQueue();
  }

  /** @private */
  _processUploadQueue() {
    while (this._uploadQueue.length > 0 && this._activeUploads < this._maxConcurrentUploads) {
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

    let stalledId;

    xhr.upload.onprogress = (e) => {
      clearTimeout(stalledId);

      const last = Date.now();
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
            this._renderFileList();
          }, 2000);
        } else {
          file.loadedStr = file.totalStr;
          file.status = this._i18n.uploading.status.processing;
        }
      }

      this._renderFileList();
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
          this._onUploadFailed(file);
        } else {
          this._onUploadSucceeded(file);
        }

        this._renderFileList();
      }
    };

    const isRawUpload = this._uploadFormat === 'raw';

    if (!file.uploadTarget) {
      file.uploadTarget = this._target || '';
    }

    if (!isRawUpload) {
      file.formDataName = this._formDataName;
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

    xhr.open(this._method, file.uploadTarget, true);
    this._configureXhr(xhr, file, isRawUpload);

    file.held = false;
    file.status = this._i18n.uploading.status.connecting;

    xhr.upload.onloadstart = () => {
      this.dispatchEvent(
        new CustomEvent('upload-start', {
          detail: { file, xhr },
        }),
      );
      this._onUploadStarted(file);
      this._renderFileList();
    };

    const eventDetail = {
      file,
      xhr,
      uploadFormat: this._uploadFormat,
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

  /** @protected */
  _createXhr() {
    return new XMLHttpRequest();
  }

  /** @private */
  _configureXhr(xhr, file = null, isRawUpload = false) {
    let headers = this._headers;
    if (typeof headers === 'string') {
      try {
        headers = JSON.parse(headers);
      } catch (_) {
        headers = {};
      }
    }
    Object.entries(headers).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value);
    });

    if (isRawUpload && file) {
      xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
      xhr.setRequestHeader('X-Filename', encodeURIComponent(file.name));
    }

    if (this._timeout) {
      xhr.timeout = this._timeout;
    }
    xhr.withCredentials = this._withCredentials;
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

  /**
   * Get files from a drop event. Handles directories recursively.
   * @param {DragEvent} dropEvent - The drop event
   * @returns {Promise<File[]>} - The files from the drop event
   * @protected
   */
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
}
