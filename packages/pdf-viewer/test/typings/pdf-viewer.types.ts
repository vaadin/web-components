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
  PdfViewerPageCountChangedEvent,
  PdfViewerToolbarCollapsedChangedEvent,
  PdfViewerZoom,
  PdfViewerZoomChangedEvent,
} from '../../src/vaadin-pdf-viewer.js';
import type { PdfViewerMixinClass } from '../../src/vaadin-pdf-viewer-mixin.js';
import type { PdfViewerPrintMixinClass } from '../../src/vaadin-pdf-viewer-print-mixin.js';
import type { PdfViewerToolbarMixinClass } from '../../src/vaadin-pdf-viewer-toolbar-mixin.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const viewer = document.createElement('vaadin-pdf-viewer');

assertType<PdfViewer>(viewer);

// Properties
assertType<string | null | undefined>(viewer.src);
assertType<number>(viewer.page);
assertType<number>(viewer.pageCount);
assertType<string | null | undefined>(viewer.fileName);
assertType<PdfViewerZoom>(viewer.zoom);
assertType<'page-fit' | 'page-width' | number>(viewer.zoom);
assertType<boolean>(viewer.headerVisible);
assertType<string | null | undefined>(viewer.headerTitle);
assertType<boolean>(viewer.toolbarCollapsed);
assertType<boolean>(viewer.downloadButtonHidden);
assertType<PdfViewerI18n | undefined>(viewer.i18n);

// I18n
assertType<PdfViewerI18n>({});
assertType<PdfViewerI18n>({
  loadError: 'Error',
  passwordError: 'Password',
  toolbar: 'Toolbar',
  toolbarToggle: 'Toggle',
  previousPage: 'Previous',
  nextPage: 'Next',
  page: 'Page',
  pageOf: 'Page of {pageCount}',
  pageError: 'Enter 1–{pageCount}',
  pageAnnouncement: 'Page {page} of {pageCount}',
  zoom: 'Zoom',
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  pageWidth: 'Width',
  pageFit: 'Fit',
  document: 'Document',
  pages: 'Pages',
  pageLabel: 'Page {page}',
  link: 'Link',
  goToPage: 'Go to page {page}',
  externalLink: '{text} (opens in a new tab)',
  download: 'Download',
});

// Methods
assertType<() => void>(viewer.download);

// Mixins
assertType<ElementMixinClass>(viewer);
assertType<I18nMixinClass<PdfViewerI18n>>(viewer);
assertType<PdfViewerMixinClass>(viewer);
assertType<PdfViewerToolbarMixinClass>(viewer);
assertType<PdfViewerPrintMixinClass>(viewer);
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

viewer.addEventListener('zoom-changed', (event) => {
  assertType<PdfViewerZoomChangedEvent>(event);
  assertType<PdfViewerZoom>(event.detail.value);
});

viewer.addEventListener('toolbar-collapsed-changed', (event) => {
  assertType<PdfViewerToolbarCollapsedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});
