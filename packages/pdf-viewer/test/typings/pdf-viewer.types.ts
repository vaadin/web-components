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
  PdfViewerSidebarOpenedChangedEvent,
  PdfViewerToolbarCollapsedChangedEvent,
  PdfViewerZoom,
  PdfViewerZoomChangedEvent,
} from '../../src/vaadin-pdf-viewer.js';
import type { PdfViewerFindMixinClass } from '../../src/vaadin-pdf-viewer-find-mixin.js';
import type { PdfViewerMixinClass } from '../../src/vaadin-pdf-viewer-mixin.js';
import type { PdfViewerOutlineMixinClass } from '../../src/vaadin-pdf-viewer-outline-mixin.js';
import type { PdfViewerPrintMixinClass } from '../../src/vaadin-pdf-viewer-print-mixin.js';
import type { PdfViewerSidebarMixinClass } from '../../src/vaadin-pdf-viewer-sidebar-mixin.js';
import type { PdfViewerToolbarMixinClass } from '../../src/vaadin-pdf-viewer-toolbar-mixin.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const viewer = document.createElement('vaadin-pdf-viewer');

assertType<PdfViewer>(viewer);

// Properties
assertType<string | null | undefined>(viewer.src);
assertType<number>(viewer.pageCount);
assertType<number>(viewer.page);
assertType<PdfViewerZoom>(viewer.zoom);
assertType<boolean>(viewer.sidebarOpened);
assertType<string | null | undefined>(viewer.fileName);
assertType<boolean>(viewer.fileNameVisible);
assertType<boolean>(viewer.toolbarCollapsed);
assertType<() => Promise<void>>(viewer.print);
viewer.zoom = 'page-fit';
viewer.zoom = 'page-width';
viewer.zoom = 1.5;
assertType<PdfViewerI18n | undefined>(viewer.i18n);

// I18n
assertType<PdfViewerI18n>({});
assertType<PdfViewerI18n>({ loadError: 'Error', passwordError: 'Password', pageError: 'Page {pageCount}' });

// Mixins
assertType<ElementMixinClass>(viewer);
assertType<I18nMixinClass<PdfViewerI18n>>(viewer);
assertType<PdfViewerMixinClass>(viewer);
assertType<PdfViewerFindMixinClass>(viewer);
assertType<PdfViewerOutlineMixinClass>(viewer);
assertType<PdfViewerPrintMixinClass>(viewer);
assertType<PdfViewerSidebarMixinClass>(viewer);
assertType<PdfViewerToolbarMixinClass>(viewer);
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

viewer.addEventListener('zoom-changed', (event) => {
  assertType<PdfViewerZoomChangedEvent>(event);
  assertType<PdfViewerZoom>(event.detail.value);
});

// I18n for the toolbar
assertType<PdfViewerI18n>({
  toolbar: 'Toolbar',
  previousPage: 'Previous',
  nextPage: 'Next',
  page: 'Page',
  pageAnnouncement: 'Page {page} of {pageCount}',
  zoom: 'Zoom',
  zoomIn: 'In',
  zoomOut: 'Out',
  pageWidth: 'Width',
  pageFit: 'Fit',
});

viewer.addEventListener('sidebar-opened-changed', (event) => {
  assertType<PdfViewerSidebarOpenedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

viewer.addEventListener('toolbar-collapsed-changed', (event) => {
  assertType<PdfViewerToolbarCollapsedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});
