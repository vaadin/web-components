import { UploadFile } from '../../vaadin-upload';
import '../../src/vaadin-upload';

const assert = <T>(value: T) => value;

const upload = document.createElement('vaadin-upload');

upload.addEventListener('max-files-reached-changed', (event) => {
  assert<boolean>(event.detail.value);
});

upload.addEventListener('file-reject', (event) => {
  assert<UploadFile>(event.detail.file);
  assert<string>(event.detail.error);
});

upload.addEventListener('files-changed', (event) => {
  assert<UploadFile[]>(event.detail.value);
});

upload.addEventListener('upload-before', (event) => {
  assert<UploadFile>(event.detail.file);
  assert<XMLHttpRequest>(event.detail.xhr);
});

upload.addEventListener('upload-start', (event) => {
  assert<UploadFile>(event.detail.file);
  assert<XMLHttpRequest>(event.detail.xhr);
});

upload.addEventListener('upload-progress', (event) => {
  assert<UploadFile>(event.detail.file);
  assert<XMLHttpRequest>(event.detail.xhr);
});

upload.addEventListener('upload-response', (event) => {
  assert<UploadFile>(event.detail.file);
  assert<XMLHttpRequest>(event.detail.xhr);
});

upload.addEventListener('upload-success', (event) => {
  assert<UploadFile>(event.detail.file);
  assert<XMLHttpRequest>(event.detail.xhr);
});

upload.addEventListener('upload-error', (event) => {
  assert<UploadFile>(event.detail.file);
  assert<XMLHttpRequest>(event.detail.xhr);
});

upload.addEventListener('upload-retry', (event) => {
  assert<UploadFile>(event.detail.file);
  assert<XMLHttpRequest>(event.detail.xhr);
});

upload.addEventListener('upload-abort', (event) => {
  assert<UploadFile>(event.detail.file);
  assert<XMLHttpRequest>(event.detail.xhr);
});

upload.addEventListener('upload-request', (event) => {
  assert<UploadFile>(event.detail.file);
  assert<FormData>(event.detail.formData);
});
