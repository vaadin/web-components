/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A pure JavaScript class that manages file upload state and XHR requests.
 * It has no knowledge of UI components - components should listen to events and
 * call methods to interact with the manager.
 *
 * @example
 * ```javascript
 * import { UploadManager } from '@vaadin/upload';
 *
 * const manager = new UploadManager({
 *   target: '/api/upload',
 *   maxFiles: 5
 * });
 *
 * // Listen to state changes
 * manager.addEventListener('files-changed', (e) => {
 *   myFileList.items = e.detail.value;
 * });
 *
 * manager.addEventListener('max-files-reached-changed', (e) => {
 *   myAddButton.disabled = e.detail.value;
 * });
 *
 * manager.addEventListener('upload-success', (e) => {
 *   console.log('File uploaded:', e.detail.file.name);
 * });
 *
 * // Add files (e.g., from a file input or drop event)
 * fileInput.addEventListener('change', (e) => {
 *   manager.addFiles(e.target.files);
 * });
 *
 * // Clean up when done
 * manager.destroy();
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
export class UploadManager extends EventTarget {
  /**
   * Create an UploadManager instance.
   * @param {Object} options - Configuration options
   * @param {string} [options.target=''] - Server URL for uploads
   * @param {string} [options.method='POST'] - HTTP method (POST or PUT)
   * @param {Object} [options.headers={}] - Custom HTTP headers
   * @param {number} [options.timeout=0] - Upload timeout in milliseconds (0 = no timeout)
   * @param {number} [options.maxFiles=Infinity] - Maximum number of files allowed
   * @param {number} [options.maxFileSize=Infinity] - Maximum file size in bytes
   * @param {string} [options.accept=''] - Accepted file types (MIME types or extensions)
   * @param {boolean} [options.noAuto=false] - Prevent automatic upload on file addition
   * @param {boolean} [options.withCredentials=false] - Include credentials in XHR
   * @param {string} [options.uploadFormat='raw'] - Upload format: 'raw' or 'multipart'
   * @param {number} [options.maxConcurrentUploads=3] - Maximum concurrent uploads
   * @param {string} [options.formDataName='file'] - Form field name for multipart uploads
   */
  constructor(options = {}) {
    super();

    // Configuration properties
    this.target = options.target || '';
    this.method = options.method || 'POST';
    this.headers = options.headers || {};
    this.timeout = options.timeout || 0;
    this.maxFiles = options.maxFiles || Infinity;
    this.maxFileSize = options.maxFileSize || Infinity;
    this.accept = options.accept || '';
    this.noAuto = options.noAuto || false;
    this.withCredentials = options.withCredentials || false;
    this.uploadFormat = options.uploadFormat || 'raw';
    this.maxConcurrentUploads = options.maxConcurrentUploads || 3;
    this.formDataName = options.formDataName || 'file';

    // State
    this._files = [];
    this._maxFilesReached = false;
    this._uploadQueue = [];
    this._activeUploads = 0;
    this._destroyed = false;
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
   * Clean up resources and abort active uploads.
   * Call this when the manager is no longer needed.
   */
  destroy() {
    this._destroyed = true;

    // Abort all active uploads
    this._files.forEach((file) => {
      if (file.xhr && file.uploading) {
        file.xhr.abort();
      }
    });

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
      this.dispatchEvent(
        new CustomEvent('max-files-reached-changed', {
          detail: { value: reached },
        }),
      );
    }
  }

  /** @private */
  _addFile(file) {
    if (this._maxFilesReached) {
      this.dispatchEvent(
        new CustomEvent('file-reject', {
          detail: { file, error: 'tooManyFiles' },
        }),
      );
      return;
    }
    if (this.maxFileSize >= 0 && file.size > this.maxFileSize) {
      this.dispatchEvent(
        new CustomEvent('file-reject', {
          detail: { file, error: 'fileIsTooBig' },
        }),
      );
      return;
    }
    const re = this._acceptRegexp;
    if (re && !(re.test(file.type) || re.test(file.name))) {
      this.dispatchEvent(
        new CustomEvent('file-reject', {
          detail: { file, error: 'incorrectFileType' },
        }),
      );
      return;
    }

    file.loaded = 0;
    file.held = true;
    file.formDataName = this.formDataName;
    this.files = [file, ...this._files];

    if (!this.noAuto) {
      this._queueFileUpload(file);
    }
  }

  /** @private */
  _removeFile(file) {
    this._uploadQueue = this._uploadQueue.filter((f) => f !== file);

    const fileIndex = this._files.indexOf(file);
    if (fileIndex >= 0) {
      this.files = this._files.filter((f) => f !== file);

      this.dispatchEvent(
        new CustomEvent('file-remove', {
          detail: { file, fileIndex },
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
    this._notifyFilesChanged();

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
            file.stalled = true;
            this._notifyFilesChanged();
          }, 2000);
        }
      }

      this._notifyFilesChanged();
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
          file.error = 'serverUnavailable';
        } else if (xhr.status >= 500) {
          file.error = 'unexpectedServerError';
        } else if (xhr.status >= 400) {
          file.error = 'forbidden';
        }

        file.complete = !file.error;
        const eventName = file.error ? 'upload-error' : 'upload-success';
        this.dispatchEvent(new CustomEvent(eventName, { detail: { file, xhr } }));

        this._notifyFilesChanged();
      }
    };

    const isRawUpload = this.uploadFormat === 'raw';

    if (!file.uploadTarget) {
      file.uploadTarget = this.target || '';
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
      formData.append(file.formDataName || this.formDataName, file, file.name);
      requestBody = formData;
    }

    xhr.open(this.method, file.uploadTarget, true);
    this._configureXhr(xhr, file, isRawUpload);

    file.held = false;

    xhr.upload.onloadstart = () => {
      this.dispatchEvent(
        new CustomEvent('upload-start', {
          detail: { file, xhr },
        }),
      );
      this._notifyFilesChanged();
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
    file.remaining = Math.ceil(elapsed * (total / loaded - 1));
    file.speed = ~~(total / elapsed / 1024);
    file.total = total;
  }

  /** @private */
  _notifyFilesChanged() {
    this.dispatchEvent(
      new CustomEvent('files-changed', {
        detail: { value: this._files, oldValue: this._files },
      }),
    );
  }
}
