import type {
  UploadFile,
  UploadFormat,
  UploadManager,
  UploadManagerEventMap,
  UploadManagerOptions,
  UploadMethod,
} from '../../src/vaadin-upload-manager.js';
import { UploadManager as UploadManagerClass } from '../../src/vaadin-upload-manager.js';

const assertType = <TExpected>(actual: TExpected) => actual;

// Constructor with no options
const manager1 = new UploadManagerClass();
assertType<UploadManager>(manager1);

// Constructor with options
const options: UploadManagerOptions = {
  target: '/api/upload',
  method: 'PUT',
  headers: { Authorization: 'Bearer token' },
  timeout: 5000,
  maxFiles: 10,
  maxFileSize: 1024 * 1024,
  accept: 'image/*',
  noAuto: true,
  withCredentials: true,
  uploadFormat: 'multipart',
  maxConcurrentUploads: 5,
  formDataName: 'document',
};
const manager2 = new UploadManagerClass(options);
assertType<UploadManager>(manager2);

// Properties
assertType<string>(manager2.target);
assertType<UploadMethod>(manager2.method);
assertType<Record<string, string>>(manager2.headers);
assertType<number>(manager2.timeout);
assertType<number>(manager2.maxFiles);
assertType<number>(manager2.maxFileSize);
assertType<string>(manager2.accept);
assertType<boolean>(manager2.noAuto);
assertType<boolean>(manager2.withCredentials);
assertType<UploadFormat>(manager2.uploadFormat);
assertType<number>(manager2.maxConcurrentUploads);
assertType<string>(manager2.formDataName);
assertType<UploadFile[]>(manager2.files);
assertType<boolean>(manager2.maxFilesReached);

// Methods
manager2.addFiles([new File([''], 'test.txt')]);
manager2.uploadFiles();
manager2.uploadFiles(manager2.files[0]);
manager2.uploadFiles(manager2.files);
manager2.retryUpload(manager2.files[0]);
manager2.abortUpload(manager2.files[0]);
manager2.removeFile(manager2.files[0]);

// Events
manager2.addEventListener('file-reject', (event) => {
  assertType<UploadManagerEventMap['file-reject']>(event);
  assertType<File>(event.detail.file);
  assertType<string>(event.detail.error);
});

manager2.addEventListener('file-remove', (event) => {
  assertType<UploadManagerEventMap['file-remove']>(event);
  assertType<UploadFile>(event.detail.file);
});

manager2.addEventListener('upload-before', (event) => {
  assertType<UploadManagerEventMap['upload-before']>(event);
  assertType<UploadFile>(event.detail.file);
  assertType<XMLHttpRequest>(event.detail.xhr);
});

manager2.addEventListener('upload-request', (event) => {
  assertType<UploadManagerEventMap['upload-request']>(event);
  assertType<UploadFile>(event.detail.file);
  assertType<XMLHttpRequest>(event.detail.xhr);
  assertType<UploadFormat>(event.detail.uploadFormat);
  assertType<File | FormData>(event.detail.requestBody);
  assertType<FormData | undefined>(event.detail.formData);
});

manager2.addEventListener('upload-start', (event) => {
  assertType<UploadManagerEventMap['upload-start']>(event);
  assertType<UploadFile>(event.detail.file);
  assertType<XMLHttpRequest>(event.detail.xhr);
});

manager2.addEventListener('upload-progress', (event) => {
  assertType<UploadManagerEventMap['upload-progress']>(event);
  assertType<UploadFile>(event.detail.file);
  assertType<XMLHttpRequest>(event.detail.xhr);
});

manager2.addEventListener('upload-response', (event) => {
  assertType<UploadManagerEventMap['upload-response']>(event);
  assertType<UploadFile>(event.detail.file);
  assertType<XMLHttpRequest>(event.detail.xhr);
});

manager2.addEventListener('upload-success', (event) => {
  assertType<UploadManagerEventMap['upload-success']>(event);
  assertType<UploadFile>(event.detail.file);
  assertType<XMLHttpRequest>(event.detail.xhr);
});

manager2.addEventListener('upload-error', (event) => {
  assertType<UploadManagerEventMap['upload-error']>(event);
  assertType<UploadFile>(event.detail.file);
  assertType<XMLHttpRequest>(event.detail.xhr);
});

manager2.addEventListener('upload-retry', (event) => {
  assertType<UploadManagerEventMap['upload-retry']>(event);
  assertType<UploadFile>(event.detail.file);
  assertType<XMLHttpRequest>(event.detail.xhr);
});

manager2.addEventListener('upload-abort', (event) => {
  assertType<UploadManagerEventMap['upload-abort']>(event);
  assertType<UploadFile>(event.detail.file);
  assertType<XMLHttpRequest>(event.detail.xhr);
});

manager2.addEventListener('files-changed', (event) => {
  assertType<UploadManagerEventMap['files-changed']>(event);
  assertType<UploadFile[]>(event.detail.value);
});

manager2.addEventListener('max-files-reached-changed', (event) => {
  assertType<UploadManagerEventMap['max-files-reached-changed']>(event);
  assertType<boolean>(event.detail.value);
});

// removeEventListener
const handler = (e: UploadManagerEventMap['upload-success']) => {
  assertType<UploadFile>(e.detail.file);
};
manager2.addEventListener('upload-success', handler);
manager2.removeEventListener('upload-success', handler);

// UploadFile properties
const file: UploadFile = manager2.files[0];
assertType<string>(file.uploadTarget);
assertType<number>(file.elapsed);
assertType<number>(file.remaining);
assertType<number>(file.progress);
assertType<number>(file.speed);
assertType<number>(file.total);
assertType<number>(file.loaded);
assertType<string>(file.status);
assertType<string>(file.error);
assertType<boolean | undefined>(file.abort);
assertType<boolean | undefined>(file.complete);
assertType<boolean | undefined>(file.held);
assertType<boolean | undefined>(file.uploading);
assertType<boolean | undefined>(file.indeterminate);
assertType<boolean | undefined>(file.stalled);
assertType<string | undefined>(file.formDataName);
assertType<XMLHttpRequest | undefined>(file.xhr);

// Inherited File properties
assertType<string>(file.name);
assertType<number>(file.size);
assertType<string>(file.type);
assertType<number>(file.lastModified);
