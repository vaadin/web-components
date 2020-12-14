export interface UploadFile extends File {
  uploadTarget: string;
  elapsed: number;
  elapsedStr: string;
  remaining: number;
  remainingStr: string;
  progress: number;
  speed: number;
  totalStr: string;
  loaded: number;
  loadedStr: string;
  status: string;
  error: string;
  abort?: boolean;
  complete?: boolean;
  uploading?: boolean;
}

export interface UploadI18n {
  dropFiles: {
    one: string;
    many: string;
  };
  addFiles: {
    one: string;
    many: string;
  };
  cancel: string;
  error: {
    tooManyFiles: string;
    fileIsTooBig: string;
    incorrectFileType: string;
  };
  uploading: {
    status: {
      connecting: string;
      stalled: string;
      processing: string;
      held: string;
    };
    remainingTime: {
      prefix: string;
      unknown: string;
    };
    error: {
      serverUnavailable: string;
      unexpectedServerError: string;
      forbidden: string;
    };
  };
  units: {
    size: string[];
    sizeBase?: number;
  };
  formatSize?: (bytes: number) => string;
  formatTime?: (seconds: number, units: number[]) => string;
}

export type UploadMethod = "POST" | "PUT";

/**
 * Fired when a file cannot be added to the queue due to a constrain:
 * file-size, file-type or maxFiles
 */
export type UploadFileReject = CustomEvent<{ file: UploadFile; error: string }>;

/**
 * Fired when the `files` property changes.
 */
export type UploadFilesChanged = CustomEvent<{ value: UploadFile[] }>;

/**
 * Fired when the `max-files-reached` property changes.
 */
export type UploadMaxFilesReachedChanged = CustomEvent<{ value: boolean }>;

/**
 * Fired before the XHR is opened. Could be used for changing the request
 * URL. If the default is prevented, then XHR would not be opened.
 */
export type UploadBefore = CustomEvent<{ xhr: XMLHttpRequest; file: UploadFile }>;

/**
 * Fired when the XHR is sent.
 */
export type UploadStart = CustomEvent<{ xhr: XMLHttpRequest; file: UploadFile }>;

/**
 * Fired as many times as the progress is updated.
 */
export type UploadProgress = CustomEvent<{ xhr: XMLHttpRequest; file: UploadFile }>;

/**
 * Fired in case the upload process succeeded.
 */
export type UploadSuccess = CustomEvent<{ xhr: XMLHttpRequest; file: UploadFile }>;

/**
 * Fired in case the upload process failed.
 */
export type UploadError = CustomEvent<{ xhr: XMLHttpRequest; file: UploadFile }>;

/**
 * Fired when we have the actual server response, and before the component
 * analyses it. It's useful for developers to make the upload fail depending
 * on the server response. If the event is defaultPrevented the vaadin-upload
 * will return allowing the user to do something on his own like retry the
 * upload, etc. since he has full access to the `xhr` and `file` objects.
 * Otherwise, if the event is not prevented default `vaadin-upload` continues
 * with the normal workflow checking the `xhr.status` and `file.error`
 * which also might be modified by the user to force a customized response,
 */
export type UploadResponse = CustomEvent<{ xhr: XMLHttpRequest; file: UploadFile }>;

/**
 * Fired when retry upload is requested. If the default is prevented, then
 * retry would not be performed.
 */
export type UploadRetry = CustomEvent<{ xhr: XMLHttpRequest; file: UploadFile }>;

/**
 * Fired when upload abort is requested. If the default is prevented, then the
 * file upload would not be aborted.
 */
export type UploadAbort = CustomEvent<{ xhr: XMLHttpRequest; file: UploadFile }>;

/**
 * Fired when the XHR has been opened but not sent yet. Useful for appending
 * data keys to the FormData object, for changing some parameters like
 * headers, etc. If the event is defaultPrevented, `vaadin-upload` will not
 * send the request allowing the user to do something on his own.
 */
export type UploadRequest = CustomEvent<{ xhr: XMLHttpRequest; file: UploadFile; formData: FormData }>;

export interface UploadElementEventMap {
  'file-reject': UploadFileReject;

  'files-changed': UploadFilesChanged;

  'max-files-reached-changed': UploadMaxFilesReachedChanged;

  'upload-before': UploadBefore;

  'upload-start': UploadStart;

  'upload-progress': UploadProgress;

  'upload-response': UploadResponse;

  'upload-success': UploadSuccess;

  'upload-error': UploadError;

  'upload-retry': UploadRetry;

  'upload-abort': UploadAbort;

  'upload-request': UploadRequest;
}

export interface UploadEventMap extends HTMLElementEventMap, UploadElementEventMap {}
