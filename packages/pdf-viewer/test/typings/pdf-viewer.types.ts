import '../../vaadin-pdf-viewer.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { I18nMixinClass } from '@vaadin/component-base/src/i18n-mixin.js';
import type { ResizeMixinClass } from '@vaadin/component-base/src/resize-mixin.js';
import type {
  PdfViewer,
  PdfViewerDocumentErrorEvent,
  PdfViewerDocumentLoadEvent,
  PdfViewerI18n,
  PdfViewerPageChangedEvent,
  PdfViewerZoom,
} from '../../src/vaadin-pdf-viewer.js';
import type { PdfViewerMixinClass } from '../../src/vaadin-pdf-viewer-mixin.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const viewer = document.createElement('vaadin-pdf-viewer');

assertType<PdfViewer>(viewer);

// Properties
assertType<string | null | undefined>(viewer.src);
assertType<number>(viewer.pageCount);
assertType<number>(viewer.page);
assertType<PdfViewerZoom>(viewer.zoom);
viewer.zoom = 'page-fit';
viewer.zoom = 'page-width';
viewer.zoom = 1.5;
assertType<PdfViewerI18n | undefined>(viewer.i18n);

// I18n
assertType<PdfViewerI18n>({});
assertType<PdfViewerI18n>({ loadError: 'Error', passwordError: 'Password' });

// Mixins
assertType<ElementMixinClass>(viewer);
assertType<I18nMixinClass<PdfViewerI18n>>(viewer);
assertType<PdfViewerMixinClass>(viewer);
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
});

viewer.addEventListener('page-changed', (event) => {
  assertType<PdfViewerPageChangedEvent>(event);
  assertType<number>(event.detail.value);
});
