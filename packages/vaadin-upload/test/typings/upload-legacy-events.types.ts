import '../../vaadin-upload.js';

import {
  UploadAbort,
  UploadBefore,
  UploadError,
  UploadFileReject,
  UploadFilesChanged,
  UploadMaxFilesReachedChanged,
  UploadProgress,
  UploadRequest,
  UploadResponse,
  UploadRetry,
  UploadStart,
  UploadSuccess
} from '../../vaadin-upload.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const upload = document.createElement('vaadin-upload');

upload.addEventListener('max-files-reached-changed', (event) => {
  assertType<UploadMaxFilesReachedChanged>(event);
});

upload.addEventListener('file-reject', (event) => {
  assertType<UploadFileReject>(event);
});

upload.addEventListener('files-changed', (event) => {
  assertType<UploadFilesChanged>(event);
});

upload.addEventListener('upload-before', (event) => {
  assertType<UploadBefore>(event);
});

upload.addEventListener('upload-start', (event) => {
  assertType<UploadStart>(event);
});

upload.addEventListener('upload-progress', (event) => {
  assertType<UploadProgress>(event);
});

upload.addEventListener('upload-response', (event) => {
  assertType<UploadResponse>(event);
});

upload.addEventListener('upload-success', (event) => {
  assertType<UploadSuccess>(event);
});

upload.addEventListener('upload-error', (event) => {
  assertType<UploadError>(event);
});

upload.addEventListener('upload-retry', (event) => {
  assertType<UploadRetry>(event);
});

upload.addEventListener('upload-abort', (event) => {
  assertType<UploadAbort>(event);
});

upload.addEventListener('upload-request', (event) => {
  assertType<UploadRequest>(event);
});
