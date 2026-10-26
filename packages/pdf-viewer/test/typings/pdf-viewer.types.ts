import '../../vaadin-pdf-viewer.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type {
  PdfViewer,
  PdfViewerDocumentErrorEvent,
  PdfViewerDocumentLoadEvent,
  PdfViewerPageCountChangedEvent,
} from '../../src/vaadin-pdf-viewer.js';
import type { PdfViewerDocumentMixinClass } from '../../src/vaadin-pdf-viewer-document-mixin.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const viewer = document.createElement('vaadin-pdf-viewer');

assertType<PdfViewer>(viewer);

// Properties
assertType<string | null | undefined>(viewer.src);
assertType<number>(viewer.pageCount);

// Mixins
assertType<ElementMixinClass>(viewer);
assertType<PdfViewerDocumentMixinClass>(viewer);

// Events
viewer.addEventListener('document-load', (event) => {
  assertType<PdfViewerDocumentLoadEvent>(event);
  assertType<number>(event.detail.pageCount);
  assertType<string>(event.detail.title);
});

viewer.addEventListener('document-error', (event) => {
  assertType<PdfViewerDocumentErrorEvent>(event);
  assertType<'invalid' | 'network' | 'password'>(event.detail.reason);
  assertType<unknown>(event.detail.error);
});

viewer.addEventListener('page-count-changed', (event) => {
  assertType<PdfViewerPageCountChangedEvent>(event);
  assertType<number>(event.detail.value);
});
