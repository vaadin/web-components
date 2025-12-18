/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { announce } from '@vaadin/a11y-base/src/announce.js';
import { UploadCore } from './vaadin-upload-core.js';

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
 *
 * @extends UploadCore
 */
export class UploadOrchestrator extends UploadCore {
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

    this._destroyed = false;

    // Apply options
    if (options.target !== undefined) this.target = options.target;
    if (options.method !== undefined) this.method = options.method;
    if (options.headers !== undefined) this.headers = options.headers;
    if (options.timeout !== undefined) this.timeout = options.timeout;
    if (options.maxFiles !== undefined) this.maxFiles = options.maxFiles;
    if (options.maxFileSize !== undefined) this.maxFileSize = options.maxFileSize;
    if (options.accept !== undefined) this.accept = options.accept;
    if (options.formDataName !== undefined) this.formDataName = options.formDataName;
    if (options.noAuto !== undefined) this.noAuto = options.noAuto;
    if (options.withCredentials !== undefined) this.withCredentials = options.withCredentials;
    if (options.uploadFormat !== undefined) this.uploadFormat = options.uploadFormat;
    if (options.maxConcurrentUploads !== undefined) this.maxConcurrentUploads = options.maxConcurrentUploads;
    if (options.nodrop !== undefined) this.nodrop = options.nodrop;
    if (options.capture !== undefined) this.capture = options.capture;
    if (options.i18n !== undefined) this.i18n = options.i18n;

    // External UI elements
    this._fileList = null;
    this._addButton = null;
    this._dropZone = null;

    // Create hidden file input
    this._fileInput = document.createElement('input');
    this._fileInput.type = 'file';
    this._fileInput.style.display = 'none';
    this._fileInput.addEventListener('change', this._onFileInputChange.bind(this));
    this._updateFileInput();
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
      this._updateExternalFileList();
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
      this._updateExternalAddButton();
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
   * Open the file picker dialog.
   */
  openFilePicker() {
    if (this._destroyed || this._maxFilesReached) return;
    this._fileInput.value = '';
    this._fileInput.click();
  }

  // ============ Override UploadCore methods ============

  /** @override */
  addFiles(files) {
    if (this._destroyed) return;
    super.addFiles(files);
  }

  /** @override */
  uploadFiles(files) {
    if (this._destroyed) return;
    super.uploadFiles(files);
  }

  /** @override */
  retryUpload(file) {
    if (this._destroyed) return;
    super.retryUpload(file);
  }

  /** @override */
  abortUpload(file) {
    if (this._destroyed) return;
    super.abortUpload(file);
  }

  /** @override */
  removeFile(file) {
    if (this._destroyed) return;
    super.removeFile(file);
  }

  // ============ Override UploadCore callbacks ============

  /** @override @protected */
  _onFilesChanged(files, oldValue) {
    this._updateExternalFileList();
    this.dispatchEvent(
      new CustomEvent('files-changed', {
        detail: { value: files, oldValue },
      }),
    );
  }

  /** @override @protected */
  _onI18nChanged() {
    this._updateExternalFileList();
  }

  /** @override @protected */
  _onMaxFilesReachedChanged(reached) {
    this._updateExternalAddButton();
    this._updateFileInput();
    this.dispatchEvent(
      new CustomEvent('max-files-reached-changed', {
        detail: { value: reached },
      }),
    );
  }

  /** @override @protected */
  _renderFileList() {
    if (this._fileList && typeof this._fileList.requestContentUpdate === 'function') {
      this._fileList.requestContentUpdate();
    }
  }

  /** @override @protected */
  _onFileRejected(file, error) {
    announce(`${file.name}: ${error}`, { mode: 'alert' });
  }

  /** @override @protected */
  _onUploadStarted(file) {
    announce(`${file.name}: 0%`, { mode: 'alert' });
  }

  /** @override @protected */
  _onUploadSucceeded(file) {
    announce(`${file.name}: 100%`, { mode: 'alert' });
  }

  /** @override @protected */
  _onUploadFailed(file) {
    announce(`${file.name}: ${file.error}`, { mode: 'alert' });
  }

  // ============ Private methods ============

  /** @private */
  _updateFileInput() {
    if (this._fileInput) {
      this._fileInput.multiple = this._maxFiles !== 1;
      this._fileInput.accept = this._accept;
      if (this._capture) {
        this._fileInput.capture = this._capture;
      }
    }
  }

  /** @private */
  _updateExternalFileList() {
    if (this._fileList) {
      this._fileList.items = [...this._files];
      this._fileList.i18n = this._i18n;
    }
  }

  /** @private */
  _updateExternalAddButton() {
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
    if (!this._nodrop && !this._dragover) {
      this._dragoverValid = !this._maxFilesReached;
      this._dragover = true;
      if (this._dropZone) {
        this._dropZone.setAttribute('dragover', '');
      }
    }
    e.dataTransfer.dropEffect = !this._dragoverValid || this._nodrop ? 'none' : 'copy';
  }

  /** @private */
  _onDropZoneDragleave(e) {
    e.preventDefault();
    if (this._dragover && !this._nodrop) {
      this._dragover = this._dragoverValid = false;
      if (this._dropZone) {
        this._dropZone.removeAttribute('dragover');
      }
    }
  }

  /** @private */
  async _onDropZoneDrop(e) {
    if (!this._nodrop) {
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
    this.retryUpload(e.detail.file);
  }

  /** @private */
  _onFileListAbort(e) {
    this.abortUpload(e.detail.file);
  }

  /** @private */
  _onFileListStart(e) {
    this.uploadFiles(e.detail.file);
  }
}
