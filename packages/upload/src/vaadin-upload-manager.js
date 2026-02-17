/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

window.Vaadin = window.Vaadin || {};
window.Vaadin.featureFlags = window.Vaadin.featureFlags || {};

/**
 * A pure JavaScript class that manages file upload state and XHR requests.
 * It has no knowledge of UI components - components should listen to events and
 * call methods to interact with the manager.
 *
 * **Note:** This class is experimental and requires the `modularUpload` or `aiComponents` feature flag to be enabled:
 * ```javascript
 * window.Vaadin.featureFlags.modularUpload = true;
 * ```
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
 * @fires {CustomEvent} disabled-changed - Fired when disabled changes
 */
export class UploadManager extends EventTarget {
  /** @type {Array<UploadFile>} */
  #files = [];

  /** @type {boolean} */
  #maxFilesReached = false;

  /** @type {boolean} */
  #disabled = false;

  /** @type {Array<UploadFile>} */
  #uploadQueue = [];

  /** @type {number} */
  #activeUploads = 0;

  /** @type {string} */
  #method = 'POST';

  /** @type {number} */
  #maxFiles = Infinity;

  /** @type {number} */
  #maxConcurrentUploads = 3;

  /** @type {Record<string, string>} */
  #headers = {};

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
   * @param {boolean} [options.disabled=false] - Whether the upload manager is disabled. When true, connected components (upload-button, upload-drop-zone) will be automatically disabled.
   */
  constructor(options = {}) {
    super();

    if (!window.Vaadin.featureFlags.modularUpload && !window.Vaadin.featureFlags.aiComponents) {
      throw new Error(
        'UploadManager requires the modularUpload feature flag. Enable it with: window.Vaadin.featureFlags.modularUpload = true',
      );
    }

    // Configuration properties - use setters for validation
    this.target = options.target || '';
    this.method = options.method || 'POST';
    this.headers = options.headers || {};
    this.timeout = options.timeout || 0;
    this.maxFiles = options.maxFiles === undefined ? Infinity : options.maxFiles;
    this.maxFileSize = options.maxFileSize === undefined ? Infinity : options.maxFileSize;
    this.accept = options.accept || '';
    this.noAuto = options.noAuto === undefined ? false : options.noAuto;
    this.withCredentials = options.withCredentials === undefined ? false : options.withCredentials;
    this.uploadFormat = options.uploadFormat || 'raw';
    this.maxConcurrentUploads = options.maxConcurrentUploads === undefined ? 3 : options.maxConcurrentUploads;
    this.formDataName = options.formDataName || 'file';
    this.disabled = options.disabled === undefined ? false : options.disabled;
  }

  /**
   * HTTP Method used to send the files. Only POST and PUT are allowed.
   * @type {string}
   */
  get method() {
    return this.#method;
  }

  set method(value) {
    if (value !== 'POST' && value !== 'PUT') {
      throw new Error(`Invalid method "${value}". Only POST and PUT are allowed.`);
    }
    this.#method = value;
  }

  /**
   * Limit of files to upload, by default it is unlimited.
   * @type {number}
   */
  get maxFiles() {
    return this.#maxFiles;
  }

  set maxFiles(value) {
    if (value < 0) {
      throw new Error(`Invalid maxFiles "${value}". Value must be non-negative.`);
    }
    this.#maxFiles = value;
    this.#updateMaxFilesReached();
  }

  /**
   * Maximum number of files that can be uploaded simultaneously.
   * @type {number}
   */
  get maxConcurrentUploads() {
    return this.#maxConcurrentUploads;
  }

  set maxConcurrentUploads(value) {
    if (value <= 0) {
      throw new Error(`Invalid maxConcurrentUploads "${value}". Value must be positive.`);
    }
    this.#maxConcurrentUploads = value;
  }

  /**
   * Key-Value map to send to the server.
   * @type {Record<string, string>}
   */
  get headers() {
    return this.#headers;
  }

  set headers(value) {
    // Create a shallow copy to prevent external mutation
    this.#headers = { ...value };
  }

  /**
   * The array of files being processed, or already uploaded.
   *
   * Each element is a [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File)
   * object with a number of extra properties to track the upload process:
   * - `uploadTarget`: The target URL used to upload this file.
   * - `elapsed`: Elapsed time since the upload started.
   * - `remaining`: Number of seconds remaining for the upload to finish.
   * - `progress`: Percentage of the file already uploaded.
   * - `speed`: Upload speed in kB/s.
   * - `size`: File size in bytes.
   * - `total`: The total size of the data being transmitted or processed
   * - `loaded`: Bytes transferred so far.
   * - `status`: Status of the upload process.
   * - `errorKey`: Error key in case the upload failed.
   * - `abort`: True if the file was canceled by the user.
   * - `complete`: True when the file was transferred to the server.
   * - `uploading`: True while transferring data to the server.
   *
   * **Note:** The getter returns a shallow copy of the internal array to prevent
   * external mutation. Modifying the returned array will not affect the manager's state.
   *
   * **Note:** The setter validates files against maxFiles, maxFileSize, and accept constraints.
   * Files that fail validation will be rejected with a 'file-reject' event.
   * @type {Array<UploadFile>}
   */
  get files() {
    return [...this.#files];
  }

  set files(value) {
    const validFiles = [];

    for (const file of value) {
      // Skip validation for files already in the list
      if (this.#files.includes(file)) {
        validFiles.push(file);
        continue;
      }

      const error = this.#validateFile(file, validFiles.length);
      if (error) {
        this.dispatchEvent(
          new CustomEvent('file-reject', {
            detail: { file, error },
          }),
        );
        continue;
      }

      validFiles.push(file);
    }

    this.#setFiles(validFiles);
  }

  // Internal setter - bypasses validation for internal use only
  #setFiles(value) {
    this.#files = value;
    this.#updateMaxFilesReached();
    this.#notifyFilesChanged();
  }

  /**
   * Specifies if the maximum number of files have been uploaded.
   * @type {boolean}
   * @readonly
   */
  get maxFilesReached() {
    return this.#maxFilesReached;
  }

  /**
   * Whether the upload manager is disabled.
   * When true, connected components (upload-button, upload-drop-zone) will be automatically disabled.
   * @type {boolean}
   */
  get disabled() {
    return this.#disabled;
  }

  set disabled(value) {
    const disabled = Boolean(value);
    if (disabled !== this.#disabled) {
      this.#disabled = disabled;
      this.dispatchEvent(
        new CustomEvent('disabled-changed', {
          detail: { value: disabled },
        }),
      );
    }
  }

  /**
   * Add files to the upload list.
   * @param {FileList|File[]} files - Files to add
   */
  addFiles(files) {
    Array.from(files).forEach((file) => this.#addFile(file));
  }

  /**
   * Triggers the upload of any files that are not completed.
   *
   * @param {UploadFile|UploadFile[]} [files] - Files being uploaded. Defaults to all outstanding files.
   */
  uploadFiles(files = this.#files) {
    if (files && !Array.isArray(files)) {
      files = [files];
    }
    // Only upload files that are managed by this instance and not already complete
    files.filter((file) => this.#files.includes(file) && !file.complete).forEach((file) => this.#queueFileUpload(file));
  }

  /**
   * Retry a failed upload.
   * @param {UploadFile} file - The file to retry
   */
  retryUpload(file) {
    this.#retryFileUpload(file);
  }

  /**
   * Abort an upload.
   * @param {UploadFile} file - The file to abort
   */
  abortUpload(file) {
    this.#abortFileUpload(file);
  }

  /**
   * Remove a file from the list.
   * @param {UploadFile} file - The file to remove
   */
  removeFile(file) {
    this.#removeFile(file);
  }

  // ============ Private methods ============

  get #acceptRegexp() {
    if (!this.accept) {
      return null;
    }
    const processedTokens = this.accept.split(',').map((token) => {
      let processedToken = token.trim();
      processedToken = processedToken.replaceAll(/[+.]/gu, String.raw`\$&`);
      if (processedToken.startsWith(String.raw`\.`)) {
        processedToken = `.*${processedToken}$`;
      }
      return processedToken.replaceAll('/*', '/.*');
    });
    return new RegExp(`^(${processedTokens.join('|')})$`, 'iu');
  }

  #updateMaxFilesReached() {
    const reached = this.maxFiles >= 0 && this.#files.length >= this.maxFiles;
    if (reached !== this.#maxFilesReached) {
      this.#maxFilesReached = reached;
      this.dispatchEvent(
        new CustomEvent('max-files-reached-changed', {
          detail: { value: reached },
        }),
      );
    }
  }

  /**
   * Validates a file against constraints.
   * @param {File} file - The file to validate
   * @param {number} currentCount - Current number of files (for maxFiles check)
   * @returns {string|null} Error code if invalid, null if valid
   */
  #validateFile(file, currentCount) {
    if (currentCount >= this.maxFiles) {
      return 'tooManyFiles';
    }
    if (this.maxFileSize >= 0 && file.size > this.maxFileSize) {
      return 'fileIsTooBig';
    }
    const re = this.#acceptRegexp;
    if (re && !(re.test(file.type) || re.test(file.name))) {
      return 'incorrectFileType';
    }
    return null;
  }

  #addFile(file) {
    const error = this.#validateFile(file, this.#files.length);
    if (error) {
      this.dispatchEvent(
        new CustomEvent('file-reject', {
          detail: { file, error },
        }),
      );
      return;
    }

    file.loaded = 0;
    file.held = true;
    file.formDataName = this.formDataName;
    this.#setFiles([file, ...this.#files]);

    if (!this.noAuto) {
      this.#queueFileUpload(file);
    }
  }

  #removeFile(file) {
    this.#uploadQueue = this.#uploadQueue.filter((f) => f !== file);

    // If the file is actively uploading (not held) and not already aborted, abort the XHR
    if (file.uploading && !file.held && !file.abort && file.xhr) {
      file.abort = true;
      file.xhr.abort();
    }

    const fileIndex = this.#files.indexOf(file);
    if (fileIndex >= 0) {
      this.#setFiles(this.#files.filter((f) => f !== file));

      this.dispatchEvent(
        new CustomEvent('file-remove', {
          detail: { file, fileIndex },
        }),
      );
    }
  }

  #queueFileUpload(file) {
    if (file.uploading) {
      return;
    }

    // Prevent duplicate entries in queue
    if (this.#uploadQueue.includes(file)) {
      return;
    }

    file.loaded = 0;
    file.progress = 0;
    file.held = true;
    file.uploading = file.indeterminate = true;
    file.complete = file.abort = file.errorKey = false;
    file.stalled = false;
    this.#notifyFilesChanged();

    this.#uploadQueue.push(file);
    this.#processUploadQueue();
  }

  #processUploadQueue() {
    while (this.#uploadQueue.length > 0 && this.#activeUploads < this.maxConcurrentUploads) {
      const nextFile = this.#uploadQueue.shift();
      if (nextFile) {
        this.#uploadFile(nextFile);
      }
    }
  }

  #uploadFile(file) {
    this.#activeUploads += 1;

    const ini = Date.now();
    const xhr = (file.xhr = this._createXhr());

    let stalledId;

    xhr.upload.onprogress = (e) => {
      clearTimeout(stalledId);

      const elapsed = (Date.now() - ini) / 1000;
      const loaded = e.loaded;
      const total = e.total;
      // Clamp to [0, 100] range
      const rawProgress = total > 0 ? Math.trunc((loaded / total) * 100) : 100;
      const progress = Math.max(0, Math.min(100, rawProgress));
      file.loaded = loaded;
      file.progress = progress;
      file.indeterminate = total > 0 ? loaded <= 0 || loaded >= total : false;

      // Reset stalled flag when progress resumes
      if (file.stalled) {
        file.stalled = false;
      }

      if (file.errorKey) {
        file.indeterminate = file.status = undefined;
      } else if (!file.abort) {
        if (progress < 100) {
          this.#setStatus(file, total, loaded, elapsed);
          stalledId = setTimeout(() => {
            // Only set stalled if file is still uploading and not aborted
            if (file.uploading && !file.abort) {
              file.stalled = true;
              this.#notifyFilesChanged();
            }
          }, 2000);
        }
      }

      this.#notifyFilesChanged();
      this.dispatchEvent(new CustomEvent('upload-progress', { detail: { file, xhr } }));
    };

    xhr.onabort = () => {
      clearTimeout(stalledId);
      this.#activeUploads -= 1;
      this.#cleanupXhr(xhr);
      this.#processUploadQueue();
    };

    xhr.ontimeout = () => {
      clearTimeout(stalledId);
      file.indeterminate = file.uploading = false;
      file.errorKey = 'timeout';
      file.status = '';

      this.#activeUploads -= 1;
      this.#processUploadQueue();
      this.#cleanupXhr(xhr);

      this.dispatchEvent(new CustomEvent('upload-error', { detail: { file, xhr } }));
      this.#notifyFilesChanged();
    };

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        clearTimeout(stalledId);
        file.indeterminate = file.uploading = false;

        this.#activeUploads -= 1;
        this.#processUploadQueue();
        this.#cleanupXhr(xhr);

        // Return early if already handled (abort or timeout)
        if (file.abort || file.errorKey) {
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
          file.errorKey = 'serverUnavailable';
        } else if (xhr.status >= 500) {
          file.errorKey = 'unexpectedServerError';
        } else if (xhr.status === 413) {
          file.errorKey = 'fileTooLarge';
        } else if (xhr.status >= 400) {
          file.errorKey = 'forbidden';
        }

        file.complete = !file.errorKey;
        const eventName = file.errorKey ? 'upload-error' : 'upload-success';
        this.dispatchEvent(new CustomEvent(eventName, { detail: { file, xhr } }));

        // Clear file.xhr reference to allow garbage collection
        file.xhr = null;

        this.#notifyFilesChanged();
      }
    };

    const isRawUpload = this.uploadFormat === 'raw';

    if (!file.uploadTarget) {
      file.uploadTarget = this.target;
    }

    const evt = this.dispatchEvent(
      new CustomEvent('upload-before', {
        detail: { file, xhr },
        cancelable: true,
      }),
    );
    if (!evt) {
      this.#holdFile(file);
      return;
    }

    // Check if file was removed during upload-before handler
    // If file.abort is true, onabort already decremented #activeUploads
    if (!this.#files.includes(file)) {
      if (!file.abort) {
        this.#activeUploads -= 1;
      }
      this.#cleanupXhr(xhr);
      this.#processUploadQueue();
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
    this.#configureXhr(xhr, file, isRawUpload);

    file.held = false;

    xhr.upload.onloadstart = () => {
      this.dispatchEvent(
        new CustomEvent('upload-start', {
          detail: { file, xhr },
        }),
      );
      this.#notifyFilesChanged();
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
    if (!uploadEvt) {
      this.#holdFile(file);
      return;
    }

    // Check if file was removed during upload-request handler
    // If file.abort is true, onabort already decremented #activeUploads
    if (!this.#files.includes(file)) {
      if (!file.abort) {
        this.#activeUploads -= 1;
      }
      this.#cleanupXhr(xhr);
      this.#processUploadQueue();
      return;
    }

    try {
      xhr.send(requestBody);
    } catch (e) {
      this.#activeUploads -= 1;
      file.uploading = false;
      file.indeterminate = false;
      file.errorKey = e.message || 'sendFailed';
      this.#cleanupXhr(xhr);
      this.#notifyFilesChanged();
      this.#processUploadQueue();
    }
  }

  /**
   * Creates an XMLHttpRequest instance. Override in tests to mock XHR behavior.
   * @private
   */
  _createXhr() {
    return new XMLHttpRequest();
  }

  /**
   * Reset file state when upload is prevented.
   */
  #holdFile(file) {
    this.#activeUploads -= 1;
    file.uploading = false;
    file.indeterminate = false;
    file.held = true;
    this.#notifyFilesChanged();
    this.#processUploadQueue();
  }

  /**
   * Clean up XHR handlers to prevent memory leaks
   */
  #cleanupXhr(xhr) {
    if (xhr) {
      xhr.upload.onprogress = null;
      xhr.upload.onloadstart = null;
      xhr.onreadystatechange = null;
      xhr.onabort = null;
      xhr.ontimeout = null;
    }
  }

  #configureXhr(xhr, file, isRawUpload) {
    Object.entries(this.headers).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value);
    });

    if (isRawUpload) {
      xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
      xhr.setRequestHeader('X-Filename', encodeURIComponent(file.name));
    }

    if (this.timeout) {
      xhr.timeout = this.timeout;
    }
    xhr.withCredentials = this.withCredentials;
  }

  #retryFileUpload(file) {
    const evt = this.dispatchEvent(
      new CustomEvent('upload-retry', {
        detail: { file, xhr: file.xhr },
        cancelable: true,
      }),
    );
    if (evt) {
      // Reset uploading flag so #queueFileUpload doesn't early-return
      // This allows retrying queued files that haven't started yet
      file.uploading = false;
      // Remove from queue if present (for queued files being retried)
      this.#uploadQueue = this.#uploadQueue.filter((f) => f !== file);
      this.#queueFileUpload(file);
    }
  }

  #abortFileUpload(file) {
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
      this.#removeFile(file);
    }
  }

  #setStatus(file, total, loaded, elapsed) {
    file.elapsed = elapsed;
    // Avoid division by zero - if loaded is 0, remaining is unknown
    file.remaining = loaded > 0 ? Math.ceil(elapsed * (total / loaded - 1)) : 0;
    // Speed should be based on bytes actually transferred, not total file size
    // Avoid division by zero - if elapsed is 0, speed is 0
    file.speed = elapsed > 0 ? Math.trunc(loaded / elapsed / 1024) : 0;
    file.total = total;
  }

  #notifyFilesChanged() {
    // This method is called when file properties change (progress, status, etc.)
    // but not when the array structure changes. We don't track the previous state,
    // so we only provide the current value.
    this.dispatchEvent(
      new CustomEvent('files-changed', {
        detail: { value: this.#files },
      }),
    );
  }
}
