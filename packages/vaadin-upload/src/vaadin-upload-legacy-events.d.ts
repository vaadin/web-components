import {
  UploadAbortEvent,
  UploadBeforeEvent,
  UploadErrorEvent,
  UploadFileRejectEvent,
  UploadFilesChangedEvent,
  UploadMaxFilesReachedChangedEvent,
  UploadProgressEvent,
  UploadRequestEvent,
  UploadResponseEvent,
  UploadRetryEvent,
  UploadStartEvent,
  UploadSuccessEvent
} from './interfaces.js';

/**
 * @deprecated Please use `UploadFileRejectEvent` instead.
 */
export type UploadFileReject = UploadFileRejectEvent;

/**
 * @deprecated Please use `UploadFilesChangedEvent` instead.
 */
export type UploadFilesChanged = UploadFilesChangedEvent;

/**
 * @deprecated Please use `UploadMaxFilesReachedChangedEvent` instead.
 */
export type UploadMaxFilesReachedChanged = UploadMaxFilesReachedChangedEvent;

/**
 * @deprecated Please use `UploadBeforeEvent` instead.
 */
export type UploadBefore = UploadBeforeEvent;

/**
 * @deprecated Please use `UploadStartEvent` instead.
 */
export type UploadStart = UploadStartEvent;

/**
 * @deprecated Please use `UploadProgressEvent` instead.
 */
export type UploadProgress = UploadProgressEvent;

/**
 * @deprecated Please use `UploadSuccessEvent` instead.
 */
export type UploadSuccess = UploadSuccessEvent;

/**
 * @deprecated Please use `UploadErrorEvent` instead.
 */
export type UploadError = UploadErrorEvent;

/**
 * @deprecated Please use `UploadResponseEvent` instead.
 */
export type UploadResponse = UploadResponseEvent;

/**
 * @deprecated Please use `UploadRetryEvent` instead.
 */
export type UploadRetry = UploadRetryEvent;

/**
 * @deprecated Please use `UploadAbortEvent` instead.
 */
export type UploadAbort = UploadAbortEvent;

/**
 * @deprecated Please use `UploadRequestEvent` instead.
 */
export type UploadRequest = UploadRequestEvent;
