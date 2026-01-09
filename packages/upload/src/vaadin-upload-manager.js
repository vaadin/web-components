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
   * @param {string} [options.target=''] - The server URL. The default value is an empty string, which means that _window.location_ will be used.
   * @param {string} [options.method='POST'] - HTTP Method used to send the files. Only POST and PUT are allowed.
   * @param {Object} [options.headers={}] - Key-Value map to send to the server.
   * @param {number} [options.timeout=0] - Max time in milliseconds for the entire upload process, if exceeded the request will be aborted. Zero means that there is no timeout.
   * @param {number} [options.maxFiles=Infinity] - Limit of files to upload, by default it is unlimited. If the value is set to one, native file browser will prevent selecting multiple files.
   * @param {number} [options.maxFileSize=Infinity] - Specifies the maximum file size in bytes allowed to upload. Notice that it is a client-side constraint, which will be checked before sending the request. Obviously you need to do the same validation in the server-side and be sure that they are aligned.
   * @param {string} [options.accept=''] - Specifies the types of files that the server accepts. Syntax: a comma-separated list of MIME type patterns (wildcards are allowed) or file extensions. Notice that MIME types are widely supported, while file extensions are only implemented in certain browsers, so avoid using it. Example: accept="video/*,image/tiff" or accept=".pdf,audio/mp3"
   * @param {boolean} [options.noAuto=false] - Prevents upload(s) from immediately uploading upon adding file(s). When set, you must manually trigger uploads using the `uploadFiles` method.
   * @param {boolean} [options.withCredentials=false] - Set the withCredentials flag on the request.
   * @param {string} [options.uploadFormat='raw'] - Specifies the upload format to use when sending files to the server. 'raw': Send file as raw binary data with the file's MIME type as Content-Type (default). 'multipart': Send file using multipart/form-data encoding.
   * @param {number} [options.maxConcurrentUploads=3] - Specifies the maximum number of files that can be uploaded simultaneously. This helps prevent browser performance degradation and XHR limitations when uploading large numbers of files. Files exceeding this limit will be queued and uploaded as active uploads complete.
   * @param {string} [options.formDataName='file'] - Specifies the 'name' property at Content-Disposition for multipart uploads. This property is ignored when uploadFormat is 'raw'.
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
    this.__files = [];
    this.__maxFilesReached = false;
    this.__uploadQueue = [];
    this.__activeUploads = 0;
  }

  /**
   * The array of files being processed, or already uploaded.
   *
   * Each element is a [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File)
   * object with a number of extra properties to track the upload process:
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
   * @type {Array<UploadFile>}
   */
  get files() {
    return this.__files;
  }

  set files(value) {
    const oldValue = this.__files;
    this.__files = value;
    this.__updateMaxFilesReached();
    this.dispatchEvent(
      new CustomEvent('files-changed', {
        detail: { value, oldValue },
      }),
    );
  }

  /**
   * Specifies if the maximum number of files have been uploaded.
   * @type {boolean}
   * @readonly
   */
  get maxFilesReached() {
    return this.__maxFilesReached;
  }

  /**
   * Add files to the upload list.
   * @param {FileList|File[]} files - Files to add
   */
  addFiles(files) {
    Array.from(files).forEach((file) => this.__addFile(file));
  }

  /**
   * Triggers the upload of any files that are not completed.
   *
   * @param {UploadFile|UploadFile[]} [files] - Files being uploaded. Defaults to all outstanding files.
   */
  uploadFiles(files = this.__files) {
    if (files && !Array.isArray(files)) {
      files = [files];
    }
    files.filter((file) => !file.complete).forEach((file) => this.__queueFileUpload(file));
  }

  /**
   * Retry a failed upload.
   * @param {UploadFile} file - The file to retry
   */
  retryUpload(file) {
    this.__retryFileUpload(file);
  }

  /**
   * Abort an upload.
   * @param {UploadFile} file - The file to abort
   */
  abortUpload(file) {
    this.__abortFileUpload(file);
  }

  /**
   * Remove a file from the list.
   * @param {UploadFile} file - The file to remove
   */
  removeFile(file) {
    this.__removeFile(file);
  }

  // ============ Private methods ============

  /** @private */
  get __acceptRegexp() {
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
  __updateMaxFilesReached() {
    const reached = this.maxFiles >= 0 && this.__files.length >= this.maxFiles;
    if (reached !== this.__maxFilesReached) {
      this.__maxFilesReached = reached;
      this.dispatchEvent(
        new CustomEvent('max-files-reached-changed', {
          detail: { value: reached },
        }),
      );
    }
  }

  /** @private */
  __addFile(file) {
    if (this.__maxFilesReached) {
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
    const re = this.__acceptRegexp;
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
    this.files = [file, ...this.__files];

    if (!this.noAuto) {
      this.__queueFileUpload(file);
    }
  }

  /** @private */
  __removeFile(file) {
    this.__uploadQueue = this.__uploadQueue.filter((f) => f !== file);

    const fileIndex = this.__files.indexOf(file);
    if (fileIndex >= 0) {
      this.files = this.__files.filter((f) => f !== file);

      this.dispatchEvent(
        new CustomEvent('file-remove', {
          detail: { file, fileIndex },
        }),
      );
    }
  }

  /** @private */
  __queueFileUpload(file) {
    if (file.uploading) {
      return;
    }

    file.loaded = 0;
    file.progress = 0;
    file.held = true;
    file.uploading = file.indeterminate = true;
    file.complete = file.abort = file.error = false;
    file.stalled = false;
    this.__notifyFilesChanged();

    this.__uploadQueue.push(file);
    this.__processUploadQueue();
  }

  /** @private */
  __processUploadQueue() {
    while (this.__uploadQueue.length > 0 && this.__activeUploads < this.maxConcurrentUploads) {
      const nextFile = this.__uploadQueue.shift();
      if (nextFile) {
        this.__uploadFile(nextFile);
      }
    }
  }

  /** @private */
  __uploadFile(file) {
    this.__activeUploads += 1;

    const ini = Date.now();
    const xhr = (file.xhr = this.__createXhr());

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
          this.__setStatus(file, total, loaded, elapsed);
          stalledId = setTimeout(() => {
            file.stalled = true;
            this.__notifyFilesChanged();
          }, 2000);
        }
      }

      this.__notifyFilesChanged();
      this.dispatchEvent(new CustomEvent('upload-progress', { detail: { file, xhr } }));
    };

    xhr.onabort = () => {
      this.__activeUploads -= 1;
      this.__processUploadQueue();
    };

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        clearTimeout(stalledId);
        file.indeterminate = file.uploading = false;

        this.__activeUploads -= 1;
        this.__processUploadQueue();

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

        this.__notifyFilesChanged();
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
    this.__configureXhr(xhr, file, isRawUpload);

    file.held = false;

    xhr.upload.onloadstart = () => {
      this.dispatchEvent(
        new CustomEvent('upload-start', {
          detail: { file, xhr },
        }),
      );
      this.__notifyFilesChanged();
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
  __createXhr() {
    return new XMLHttpRequest();
  }

  /** @private */
  __configureXhr(xhr, file = null, isRawUpload = false) {
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
  __retryFileUpload(file) {
    const evt = this.dispatchEvent(
      new CustomEvent('upload-retry', {
        detail: { file, xhr: file.xhr },
        cancelable: true,
      }),
    );
    if (evt) {
      this.__queueFileUpload(file);
    }
  }

  /** @private */
  __abortFileUpload(file) {
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
      this.__removeFile(file);
    }
  }

  /** @private */
  __setStatus(file, total, loaded, elapsed) {
    file.elapsed = elapsed;
    file.remaining = Math.ceil(elapsed * (total / loaded - 1));
    file.speed = ~~(total / elapsed / 1024);
    file.total = total;
  }

  /** @private */
  __notifyFilesChanged() {
    this.dispatchEvent(
      new CustomEvent('files-changed', {
        detail: { value: this.__files, oldValue: this.__files },
      }),
    );
  }
}
