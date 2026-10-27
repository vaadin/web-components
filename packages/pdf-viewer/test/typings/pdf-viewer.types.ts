import '../../vaadin-pdf-viewer.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { ResizeMixinClass } from '@vaadin/component-base/src/resize-mixin.js';
import type {
  PdfViewer,
  PdfViewerDocumentErrorEvent,
  PdfViewerDocumentLoadEvent,
  PdfViewerPageChangedEvent,
  PdfViewerPageCountChangedEvent,
} from '../../src/vaadin-pdf-viewer.js';
import type { PdfViewerDocumentMixinClass } from '../../src/vaadin-pdf-viewer-document-mixin.js';
import type { PdfViewerRenderMixinClass } from '../../src/vaadin-pdf-viewer-render-mixin.js';
import type { PdfViewerScrollMixinClass } from '../../src/vaadin-pdf-viewer-scroll-mixin.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const viewer = document.createElement('vaadin-pdf-viewer');

assertType<PdfViewer>(viewer);

// Properties
assertType<string | null | undefined>(viewer.src);
assertType<number>(viewer.page);
assertType<number>(viewer.pageCount);

// Mixins
assertType<ElementMixinClass>(viewer);
assertType<PdfViewerDocumentMixinClass>(viewer);
assertType<PdfViewerRenderMixinClass>(viewer);
assertType<PdfViewerScrollMixinClass>(viewer);
assertType<ResizeMixinClass>(viewer);

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

viewer.addEventListener('page-changed', (event) => {
  assertType<PdfViewerPageChangedEvent>(event);
  assertType<number>(event.detail.value);
});

viewer.addEventListener('page-count-changed', (event) => {
  assertType<PdfViewerPageCountChangedEvent>(event);
  assertType<number>(event.detail.value);
});
