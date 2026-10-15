/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { UploadManager } from './vaadin-upload-manager.js';

/**
 * The `headers` property also supports a JSON string, while the manager only
 * accepts an object, so strings are parsed. An invalid JSON string parses to
 * undefined, which throws when the request is configured.
 */
export function parseHeaders(headers) {
  if (typeof headers !== 'string') {
    return headers;
  }
  try {
    return JSON.parse(headers);
  } catch (_) {
    return undefined;
  }
}

// The manager configuration derived from the component properties. Each entry
// is defined as a getter on `InternalUploadManager`, so that the manager reads
// the current value whenever it needs it. This way configuration changed by an
// `upload-before` listener (e.g. headers with a fresh auth token) applies to
// the request being started, like it historically did.
//
// `formDataName` is not included: the `upload-before` listener assigns it to
// the file when the upload starts, like the component has historically done.
const MANAGER_CONFIG = {
  // Fall back to an empty string, which means that window.location will be
  // used, also when the property is set to null
  target: (host) => host.target || '',
  // Unlike the manager, the component passes an unsupported method to the
  // request as-is instead of throwing
  method: (host) => host.method,
  headers: (host) => parseHeaders(host.headers),
  timeout: (host) => host.timeout,
  noAuto: (host) => host.noAuto,
  withCredentials: (host) => host.withCredentials,
  uploadFormat: (host) => host.uploadFormat,
  // Unlike the manager, the component pauses uploads on a non-positive value
  // instead of throwing
  maxConcurrentUploads: (host) => host.maxConcurrentUploads,
  // Unlike the manager, the component treats a negative value as no limit
  maxFiles: (host) => (host.maxFiles < 0 ? Infinity : host.maxFiles),
  maxFileSize: (host) => host.maxFileSize,
  accept: (host) => host.accept,
};

/**
 * An `UploadManager` subclass used internally by `<vaadin-upload>`. It reads
 * its configuration from the host component, and overrides the manager
 * behavior where the component behavior that predates the manager integration
 * differs from the standalone manager.
 */
export class InternalUploadManager extends UploadManager {
  /**
   * @param {HTMLElement} host The `<vaadin-upload>` element to read the
   *   configuration from
   */
  constructor(host) {
    super();
    this.__host = host;
  }

  /**
   * Override accessor from `UploadManager` to accept assigned files as-is,
   * without validating them against the maxFiles, maxFileSize and accept
   * constraints, e.g. to show previously uploaded files.
   * @override
   */
  get files() {
    return super.files;
  }

  set files(files) {
    this._setFiles([...files]);
  }

  /**
   * Start the upload of the given file, even if it is already complete, in
   * which case it is uploaded again from scratch. A file that is already
   * uploading or queued is ignored.
   * @param {UploadFile} file
   */
  startUpload(file) {
    this._queueFileUpload(file);
  }

  /**
   * Override method from `UploadManager` to not restart the upload of a
   * file that is already uploading or queued, like the component
   * historically does; only the `upload-retry` event is dispatched.
   * @override
   */
  retryUpload(file) {
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

  /**
   * Override method from `UploadManager` to treat all files as managed:
   * files that are not in the `files` list are uploaded without being added
   * to it, and removing a file in an `upload-before` or `upload-request`
   * listener does not cancel its upload.
   * @override
   */
  _isFileManaged(_file) {
    return true;
  }

  /**
   * Override method from `UploadManager` to leave the state of a file whose
   * `upload-before` or `upload-request` event was prevented untouched, so
   * that the preventing listener can take over the request (e.g. send the
   * xhr manually). The upload slot stays taken until the taken-over request
   * completes.
   * @override
   */
  _holdFile(_file) {
    // The listener that prevented the upload is expected to take it over
  }

  /**
   * Override method from `UploadManager` to keep the progress properties of
   * the previous upload attempt until a new upload progresses.
   * @override
   */
  _resetFileProgress(_file) {
    // Progress is only updated by upload progress events
  }

  /**
   * Override method from `UploadManager` to keep the last request available
   * on the file after the upload has finished, e.g. in the `upload-retry`
   * event detail.
   * @override
   */
  _clearFileXhr(_file) {
    // The request reference is kept on the file
  }

  /**
   * Override method from `UploadManager` to also free upload capacity for
   * other queued files when a file is removed.
   * @override
   */
  _removeFile(file) {
    super._removeFile(file);
    this._processUploadQueue();
  }
}

// Define the configuration properties as getters that read the current value
// from the host component. The setters are no-ops so that the assignments in
// the `UploadManager` constructor are ignored.
Object.entries(MANAGER_CONFIG).forEach(([prop, getValue]) => {
  Object.defineProperty(InternalUploadManager.prototype, prop, {
    get() {
      return getValue(this.__host);
    },
    set(_value) {},
  });
});
