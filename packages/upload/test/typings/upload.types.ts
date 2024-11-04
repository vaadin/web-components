import '../../vaadin-upload.js';
import type {
  UploadAbortEvent,
  UploadBeforeEvent,
  UploadErrorEvent,
  UploadFile,
  UploadFileRejectEvent,
  UploadFilesChangedEvent,
  UploadI18n,
  UploadMaxFilesReachedChangedEvent,
  UploadMethod,
  UploadProgressEvent,
  UploadRequestEvent,
  UploadResponseEvent,
  UploadRetryEvent,
  UploadStartEvent,
  UploadSuccessEvent,
} from '../../vaadin-upload.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const upload = document.createElement('vaadin-upload');

// Properties
assertType<boolean>(upload.disabled);
assertType<boolean>(upload.nodrop);
assertType<string>(upload.target);
assertType<string>(upload.accept);
assertType<string>(upload.formDataName);
assertType<UploadFile[]>(upload.files);
assertType<UploadMethod>(upload.method);
assertType<object | string | null>(upload.headers);
assertType<number>(upload.timeout);
assertType<number>(upload.maxFiles);
assertType<boolean>(upload.maxFilesReached);
assertType<number>(upload.maxFileSize);
assertType<boolean>(upload.noAuto);
assertType<boolean>(upload.withCredentials);
assertType<string | null | undefined>(upload.capture);
assertType<UploadI18n>(upload.i18n);

// Events
upload.addEventListener('max-files-reached-changed', (event) => {
  assertType<UploadMaxFilesReachedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

upload.addEventListener('file-reject', (event) => {
  assertType<UploadFileRejectEvent>(event);
  assertType<UploadFile>(event.detail.file);
  assertType<string>(event.detail.error);
});

upload.addEventListener('files-changed', (event) => {
  assertType<UploadFilesChangedEvent>(event);
  assertType<UploadFile[]>(event.detail.value);
});

upload.addEventListener('upload-before', (event) => {
  assertType<UploadBeforeEvent>(event);
  assertType<UploadFile>(event.detail.file);
  assertType<XMLHttpRequest>(event.detail.xhr);
});

upload.addEventListener('upload-start', (event) => {
  assertType<UploadStartEvent>(event);
  assertType<UploadFile>(event.detail.file);
  assertType<XMLHttpRequest>(event.detail.xhr);
});

upload.addEventListener('upload-progress', (event) => {
  assertType<UploadProgressEvent>(event);
  assertType<UploadFile>(event.detail.file);
  assertType<XMLHttpRequest>(event.detail.xhr);
});

upload.addEventListener('upload-response', (event) => {
  assertType<UploadResponseEvent>(event);
  assertType<UploadFile>(event.detail.file);
  assertType<XMLHttpRequest>(event.detail.xhr);
});

upload.addEventListener('upload-success', (event) => {
  assertType<UploadSuccessEvent>(event);
  assertType<UploadFile>(event.detail.file);
  assertType<XMLHttpRequest>(event.detail.xhr);
});

upload.addEventListener('upload-error', (event) => {
  assertType<UploadErrorEvent>(event);
  assertType<UploadFile>(event.detail.file);
  assertType<XMLHttpRequest>(event.detail.xhr);
});

upload.addEventListener('upload-retry', (event) => {
  assertType<UploadRetryEvent>(event);
  assertType<UploadFile>(event.detail.file);
  assertType<XMLHttpRequest>(event.detail.xhr);
});

upload.addEventListener('upload-abort', (event) => {
  assertType<UploadAbortEvent>(event);
  assertType<UploadFile>(event.detail.file);
  assertType<XMLHttpRequest>(event.detail.xhr);
});

upload.addEventListener('upload-request', (event) => {
  assertType<UploadRequestEvent>(event);
  assertType<UploadFile>(event.detail.file);
  assertType<FormData>(event.detail.formData);
});
