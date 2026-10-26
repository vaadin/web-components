/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PdfViewerMixin } from './vaadin-pdf-viewer-mixin.js';

/**
 * Fired when the document has loaded.
 */
export type PdfViewerDocumentLoadEvent = CustomEvent<{ pageCount: number; title: string }>;

/**
 * Fired when the document could not be loaded.
 */
export type PdfViewerDocumentErrorEvent = CustomEvent<{ reason: 'invalid' | 'network' | 'password'; error: unknown }>;

/**
 * Fired when the `pageCount` property changes.
 */
export type PdfViewerPageCountChangedEvent = CustomEvent<{ value: number }>;

export interface PdfViewerCustomEventMap {
  'document-error': PdfViewerDocumentErrorEvent;

  'document-load': PdfViewerDocumentLoadEvent;

  'page-count-changed': PdfViewerPageCountChangedEvent;
}

export interface PdfViewerEventMap extends HTMLElementEventMap, PdfViewerCustomEventMap {}

/**
 * `<vaadin-pdf-viewer>` is a web component for viewing PDF documents.
 *
 * ```html
 * <vaadin-pdf-viewer src="/files/report.pdf"></vaadin-pdf-viewer>
 * ```
 *
 * The component is experimental and its API may change. To use it, enable
 * the following feature flag:
 *
 * ```js
 * window.Vaadin.featureFlags.pdfViewerComponent = true;
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------|------------
 * `loader`  | The loading indicator shown while the document loads.
 *
 * The following state attributes are available for styling:
 *
 * Attribute   | Description
 * ------------|------------
 * `loading`   | Set while the document is loading.
 * `has-error` | Set when the document could not be loaded.
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                  |
 * :-------------------------------------|
 * | `--vaadin-pdf-viewer-background`    |
 * | `--vaadin-pdf-viewer-border-color`  |
 * | `--vaadin-pdf-viewer-border-radius` |
 * | `--vaadin-pdf-viewer-text-color`    |
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {CustomEvent} document-error - Fired when the document could not be loaded.
 * @fires {CustomEvent} document-load - Fired when the document has loaded.
 * @fires {CustomEvent} page-count-changed - Fired when the `pageCount` property changes.
 */
declare class PdfViewer extends PdfViewerMixin(ElementMixin(HTMLElement)) {
  addEventListener<K extends keyof PdfViewerEventMap>(
    type: K,
    listener: (this: PdfViewer, ev: PdfViewerEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof PdfViewerEventMap>(
    type: K,
    listener: (this: PdfViewer, ev: PdfViewerEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-pdf-viewer': PdfViewer;
  }
}

export { PdfViewer };
