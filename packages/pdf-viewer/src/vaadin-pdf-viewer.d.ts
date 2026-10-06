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
import { I18nMixin } from '@vaadin/component-base/src/i18n-mixin.js';
import { PdfViewerMixin } from './vaadin-pdf-viewer-mixin.js';

export type { PdfViewerZoom } from './vaadin-pdf-viewer-mixin.js';

export interface PdfViewerI18n {
  loadError?: string;
  passwordError?: string;
}

/**
 * Fired when the document has loaded.
 */
export type PdfViewerDocumentLoadEvent = CustomEvent<{ pageCount: number; title: string }>;

/**
 * Fired when the document could not be loaded.
 */
export type PdfViewerDocumentErrorEvent = CustomEvent<{ reason: 'invalid' | 'network' | 'password'; error: unknown }>;

/**
 * Fired when the `page` property changes.
 */
export type PdfViewerPageChangedEvent = CustomEvent<{ value: number }>;

export interface PdfViewerCustomEventMap {
  'document-load': PdfViewerDocumentLoadEvent;

  'document-error': PdfViewerDocumentErrorEvent;

  'page-changed': PdfViewerPageChangedEvent;
}

export interface PdfViewerEventMap extends HTMLElementEventMap, PdfViewerCustomEventMap {}

/**
 * `<vaadin-pdf-viewer>` is a Web Component for showing PDF documents.
 *
 * ```html
 * <vaadin-pdf-viewer src="/files/report.pdf"></vaadin-pdf-viewer>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name       | Description
 * ----------------|------------
 * `content`       | The scrollable area that contains the pages.
 * `page`          | A page of the document.
 * `error-message` | The message shown when the document could not be loaded.
 * `loader`        | The loading indicator shown while the document loads.
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
 * Custom CSS property                       |
 * :-----------------------------------------|
 * | `--vaadin-pdf-viewer-background`        |
 * | `--vaadin-pdf-viewer-border-color`      |
 * | `--vaadin-pdf-viewer-border-radius`     |
 * | `--vaadin-pdf-viewer-error-color`       |
 * | `--vaadin-pdf-viewer-padding`           |
 * | `--vaadin-pdf-viewer-page-background`  |
 * | `--vaadin-pdf-viewer-page-gap`          |
 * | `--vaadin-pdf-viewer-page-shadow`       |
 * | `--vaadin-pdf-viewer-text-color`        |
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {CustomEvent} document-load - Fired when the document has loaded.
 * @fires {CustomEvent} document-error - Fired when the document could not be loaded.
 * @fires {CustomEvent} page-changed - Fired when the `page` property changes.
 */
declare class PdfViewer extends PdfViewerMixin(
  ElementMixin(I18nMixin<typeof HTMLElement, PdfViewerI18n>(HTMLElement)),
) {
  /**
   * The object used to localize this component. To change the default
   * localization, set this to an object that provides all properties, or
   * just the individual properties you want to change.
   *
   * The object has the following JSON structure and default values:
   *
   * ```
   * {
   *   // Message shown when the document could not be loaded.
   *   loadError: 'The document could not be loaded.',
   *   // Message shown when the document is password-protected.
   *   passwordError: 'Password-protected documents are not supported.'
   * }
   * ```
   */
  i18n: PdfViewerI18n | undefined;

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
