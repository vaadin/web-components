import '../../vaadin-pdf-viewer.js';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { KeyboardMixinClass } from '@vaadin/a11y-base/src/keyboard-mixin.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { I18nMixinClass } from '@vaadin/component-base/src/i18n-mixin.js';
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
import type { PdfViewerDocumentMixinClass } from '../../src/vaadin-pdf-viewer-document-mixin.js';
import type { PdfViewerKeyboardMixinClass } from '../../src/vaadin-pdf-viewer-keyboard-mixin.js';
import type { PdfViewerLinksMixinClass } from '../../src/vaadin-pdf-viewer-links-mixin.js';
import type { PdfViewerRenderMixinClass } from '../../src/vaadin-pdf-viewer-render-mixin.js';
import type { PdfViewerScrollMixinClass } from '../../src/vaadin-pdf-viewer-scroll-mixin.js';
import type { PdfViewerTextLayerMixinClass } from '../../src/vaadin-pdf-viewer-text-layer-mixin.js';
import type { PdfViewerToolbarMixinClass } from '../../src/vaadin-pdf-viewer-toolbar-mixin.js';
import type { PdfViewerZoomMixinClass } from '../../src/vaadin-pdf-viewer-zoom-mixin.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const viewer = document.createElement('vaadin-pdf-viewer');

assertType<PdfViewer>(viewer);

// Properties
assertType<string | null | undefined>(viewer.src);
assertType<boolean>(viewer.headerHidden);
assertType<string | null | undefined>(viewer.headerTitle);
assertType<boolean>(viewer.toolbarCollapsed);
assertType<number>(viewer.page);
assertType<number>(viewer.pageCount);
assertType<PdfViewerZoom>(viewer.zoom);
assertType<'page-fit' | 'page-width' | number>(viewer.zoom);
assertType<PdfViewerI18n | undefined>(viewer.i18n);
assertType<PdfViewerI18n>({ link: 'Link', goToPage: 'Go to page {page}', externalLink: '{text} (opens in a new tab)' });

// Mixins
assertType<ElementMixinClass>(viewer);
assertType<PdfViewerDocumentMixinClass>(viewer);
assertType<PdfViewerRenderMixinClass>(viewer);
assertType<PdfViewerScrollMixinClass>(viewer);
assertType<PdfViewerTextLayerMixinClass>(viewer);
assertType<PdfViewerLinksMixinClass>(viewer);
assertType<PdfViewerZoomMixinClass>(viewer);
assertType<PdfViewerToolbarMixinClass>(viewer);
assertType<PdfViewerKeyboardMixinClass>(viewer);
assertType<FocusMixinClass>(viewer);
assertType<KeyboardMixinClass>(viewer);
assertType<I18nMixinClass<PdfViewerI18n>>(viewer);

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

viewer.addEventListener('toolbar-collapsed-changed', (event) => {
  assertType<PdfViewerToolbarCollapsedChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

viewer.addEventListener('zoom-changed', (event) => {
  assertType<PdfViewerZoomChangedEvent>(event);
  assertType<PdfViewerZoom>(event.detail.value);
});
