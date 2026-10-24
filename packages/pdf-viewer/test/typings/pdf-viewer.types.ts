import '../../vaadin-pdf-viewer.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { I18nMixinClass } from '@vaadin/component-base/src/i18n-mixin.js';
import type { ResizeMixinClass } from '@vaadin/component-base/src/resize-mixin.js';
import type {
  PdfViewer,
  PdfViewerDocumentErrorEvent,
  PdfViewerDocumentLoadEvent,
  PdfViewerFindResultEvent,
  PdfViewerI18n,
  PdfViewerPageChangedEvent,
  PdfViewerPageCountChangedEvent,
  PdfViewerSidebarOpenedChangedEvent,
  PdfViewerToolbarCollapsedChangedEvent,
  PdfViewerZoom,
  PdfViewerZoomChangedEvent,
} from '../../src/vaadin-pdf-viewer.js';
import type { PdfViewerFindMixinClass } from '../../src/vaadin-pdf-viewer-find-mixin.js';
import type { PdfViewerMixinClass } from '../../src/vaadin-pdf-viewer-mixin.js';
import type { PdfViewerPrintMixinClass } from '../../src/vaadin-pdf-viewer-print-mixin.js';
import type { PdfViewerSidebarMixinClass } from '../../src/vaadin-pdf-viewer-sidebar-mixin.js';
import type { PdfViewerToolbarMixinClass } from '../../src/vaadin-pdf-viewer-toolbar-mixin.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const viewer = document.createElement('vaadin-pdf-viewer');

assertType<PdfViewer>(viewer);

// Properties
assertType<string | null | undefined>(viewer.src);
assertType<number>(viewer.page);
assertType<number>(viewer.pageCount);
assertType<string | null | undefined>(viewer.fileName);
assertType<string | null | undefined>(viewer.assetsUrl);
assertType<PdfViewerZoom>(viewer.zoom);
assertType<'page-fit' | 'page-width' | number>(viewer.zoom);
assertType<boolean>(viewer.headerVisible);
assertType<string | null | undefined>(viewer.headerTitle);
assertType<boolean>(viewer.toolbarCollapsed);
assertType<boolean>(viewer.downloadButtonHidden);
assertType<boolean>(viewer.printButtonHidden);
assertType<boolean>(viewer.findButtonHidden);
assertType<boolean>(viewer.sidebarOpened);
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
  print: 'Print',
  printing: 'Preparing to print…',
  cancelPrint: 'Cancel',
  printError: 'The document could not be printed.',
  find: 'Find',
  previousMatch: 'Previous match',
  nextMatch: 'Next match',
  closeFind: 'Close',
  findResult: '{current} of {total}',
  findResultAnnouncement: '{current} of {total}, page {page}',
  findNoMatches: 'No matches',
  sidebar: 'Sidebar',
  sidebarView: 'Sidebar view',
  thumbnails: 'Page thumbnails',
  thumbnailsView: 'Thumbnails',
  outline: 'Outline',
});

// Methods
assertType<() => void>(viewer.download);
assertType<() => Promise<void>>(viewer.print);
assertType<(text: string) => void>(viewer.find);
assertType<(page: number, text: string) => void>(viewer.highlight);

// Mixins
assertType<ElementMixinClass>(viewer);
assertType<I18nMixinClass<PdfViewerI18n>>(viewer);
assertType<PdfViewerMixinClass>(viewer);
assertType<PdfViewerToolbarMixinClass>(viewer);
assertType<PdfViewerFindMixinClass>(viewer);
assertType<PdfViewerSidebarMixinClass>(viewer);
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

viewer.addEventListener('find-result', (event) => {
  assertType<PdfViewerFindResultEvent>(event);
  assertType<string>(event.detail.query);
  assertType<number>(event.detail.matchCount);
});

viewer.addEventListener('sidebar-opened-changed', (event) => {
  assertType<PdfViewerSidebarOpenedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});
