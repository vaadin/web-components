import '../../src/vaadin-upload-file.js';
import type {
  UploadFileAbortEvent,
  UploadFileI18n,
  UploadFileRetryEvent,
  UploadFileStartEvent,
} from '../../src/vaadin-upload-file.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const uploadFile = document.createElement('vaadin-upload-file');

// Properties
assertType<boolean>(uploadFile.disabled);
assertType<boolean>(uploadFile.complete);
assertType<boolean>(uploadFile.held);
assertType<boolean>(uploadFile.indeterminate);
assertType<boolean>(uploadFile.uploading);
assertType<string>(uploadFile.errorMessage);
assertType<string>(uploadFile.fileName);
assertType<string>(uploadFile.status);
assertType<File>(uploadFile.file);
assertType<UploadFileI18n>(uploadFile.i18n);

// Events
uploadFile.addEventListener('file-retry', (event) => {
  assertType<UploadFileRetryEvent>(event);
  assertType<File>(event.detail.file);
});

uploadFile.addEventListener('file-start', (event) => {
  assertType<UploadFileStartEvent>(event);
  assertType<File>(event.detail.file);
});

uploadFile.addEventListener('file-abort', (event) => {
  assertType<UploadFileAbortEvent>(event);
  assertType<File>(event.detail.file);
});
