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
import { FocusMixin } from '@vaadin/a11y-base/src/focus-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { I18nMixin } from '@vaadin/component-base/src/i18n-mixin.js';
import { PdfViewerMixin } from './vaadin-pdf-viewer-mixin.js';
import type { PdfViewerZoom } from './vaadin-pdf-viewer-zoom-mixin.js';

export type { PdfViewerZoom } from './vaadin-pdf-viewer-zoom-mixin.js';

export interface PdfViewerI18n {
  previousPage?: string;
  nextPage?: string;
  pageError?: string;
  zoomIn?: string;
  zoomOut?: string;
  pageWidth?: string;
  pageFit?: string;
  document?: string;
  link?: string;
  goToPage?: string;
  externalLink?: string;
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

/**
 * Fired when the `pageCount` property changes.
 */
export type PdfViewerPageCountChangedEvent = CustomEvent<{ value: number }>;

/**
 * Fired when the `toolbarCollapsed` property changes.
 */
export type PdfViewerToolbarCollapsedChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `zoom` property changes.
 */
export type PdfViewerZoomChangedEvent = CustomEvent<{ value: PdfViewerZoom }>;

export interface PdfViewerCustomEventMap {
  'document-error': PdfViewerDocumentErrorEvent;

  'document-load': PdfViewerDocumentLoadEvent;

  'page-changed': PdfViewerPageChangedEvent;

  'page-count-changed': PdfViewerPageCountChangedEvent;

  'toolbar-collapsed-changed': PdfViewerToolbarCollapsedChangedEvent;

  'zoom-changed': PdfViewerZoomChangedEvent;
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
 * ### Slots
 *
 * Name              | Description
 * ------------------|-------------
 * `toolbar-actions` | Slot for application controls, e.g. buttons, at the end of the toolbar
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name       | Description
 * ----------------|------------
 * `header`        | The header above the toolbar, a button that collapses and expands it, see `headerHidden`.
 * `title`         | The title in the header.
 * `header-toggle` | The icon in the header that shows whether the toolbar is collapsed.
 * `toolbar`       | The toolbar above the pages.
 * `toolbar-group` | A group of related controls in the toolbar: navigation, zoom and actions.
 * `content`       | The scrollable area that contains the pages.
 * `page`          | A page of the document.
 * `loader`        | The loading indicator shown while the document loads.
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description
 * -------------|------------
 * `loading`    | Set while the document is loading.
 * `has-error`  | Set when the document could not be loaded.
 * `focused`    | Set when the page area is focused.
 * `focus-ring` | Set when the page area is focused using the keyboard.
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                        |
 * :-------------------------------------------|
 * | `--vaadin-pdf-viewer-background`          |
 * | `--vaadin-pdf-viewer-border-color`        |
 * | `--vaadin-pdf-viewer-border-radius`       |
 * | `--vaadin-pdf-viewer-padding`             |
 * | `--vaadin-pdf-viewer-page-background`     |
 * | `--vaadin-pdf-viewer-page-gap`            |
 * | `--vaadin-pdf-viewer-page-shadow`         |
 * | `--vaadin-pdf-viewer-text-color`          |
 * | `--vaadin-pdf-viewer-toolbar-background`  |
 * | `--vaadin-pdf-viewer-toolbar-gap`         |
 * | `--vaadin-pdf-viewer-toolbar-padding`     |
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {CustomEvent} document-error - Fired when the document could not be loaded.
 * @fires {CustomEvent} document-load - Fired when the document has loaded.
 * @fires {CustomEvent} page-changed - Fired when the `page` property changes.
 * @fires {CustomEvent} page-count-changed - Fired when the `pageCount` property changes.
 * @fires {CustomEvent} toolbar-collapsed-changed - Fired when the `toolbarCollapsed` property changes.
 * @fires {CustomEvent} zoom-changed - Fired when the `zoom` property changes.
 */
declare class PdfViewer extends PdfViewerMixin(
  FocusMixin(ElementMixin(I18nMixin<typeof HTMLElement, PdfViewerI18n>(HTMLElement))),
) {
  /**
   * The object used to localize this component. To change the default
   * localization, set this to an object that provides all properties, or
   * just the individual properties you want to change.
   *
   * When not set, defaults to `undefined`.
   *
   * The object has the following JSON structure and default values:
   *
   * ```
   * {
   *   // Tooltip of the previous page button, and accessible name of a link to the previous page.
   *   previousPage: 'Previous page',
   *   // Tooltip of the next page button, and accessible name of a link to the next page.
   *   nextPage: 'Next page',
   *   // Error shown for a page that does not exist. {pageCount} is replaced with the page count.
   *   pageError: 'Enter 1–{pageCount}',
   *   // Tooltip of the zoom in button.
   *   zoomIn: 'Zoom in',
   *   // Tooltip of the zoom out button.
   *   zoomOut: 'Zoom out',
   *   // Zoom select item that fits the page width to the viewer.
   *   pageWidth: 'Page width',
   *   // Zoom select item that fits the whole page into the viewer.
   *   pageFit: 'Page fit',
   *   // Title of the header for a document without a file name.
   *   document: 'PDF document',
   *   // Accessible name of a link without text whose destination is unknown.
   *   link: 'Link',
   *   // Accessible name of a link without text to another page. {page} is replaced with the page number.
   *   goToPage: 'Go to page {page}',
   *   // Accessible name of a link that opens in a new tab. {text} is replaced with the text of the link, or its URL.
   *   externalLink: '{text} (opens in a new tab)'
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
