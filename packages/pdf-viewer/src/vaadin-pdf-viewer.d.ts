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
import { PdfViewerMixin, type PdfViewerZoom } from './vaadin-pdf-viewer-mixin.js';

export type { PdfViewerZoom } from './vaadin-pdf-viewer-mixin.js';

export interface PdfViewerI18n {
  loadError?: string;
  passwordError?: string;
  toolbar?: string;
  thumbnails?: string;
  thumbnailsView?: string;
  outline?: string;
  previousPage?: string;
  nextPage?: string;
  page?: string;
  pageOf?: string;
  pageAnnouncement?: string;
  zoom?: string;
  zoomIn?: string;
  zoomOut?: string;
  pageWidth?: string;
  pageFit?: string;
  find?: string;
  previousMatch?: string;
  nextMatch?: string;
  closeFind?: string;
  findResult?: string;
  findResultAnnouncement?: string;
  findNoMatches?: string;
  document?: string;
  pages?: string;
  pageLabel?: string;
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
 * Fired when the `zoom` property changes.
 */
export type PdfViewerZoomChangedEvent = CustomEvent<{ value: PdfViewerZoom }>;

/**
 * Fired when the `sidebarOpened` property changes.
 */
export type PdfViewerSidebarOpenedChangedEvent = CustomEvent<{ value: boolean }>;

export interface PdfViewerCustomEventMap {
  'document-load': PdfViewerDocumentLoadEvent;

  'document-error': PdfViewerDocumentErrorEvent;

  'page-changed': PdfViewerPageChangedEvent;

  'sidebar-opened-changed': PdfViewerSidebarOpenedChangedEvent;

  'zoom-changed': PdfViewerZoomChangedEvent;
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
 * Part name              | Description
 * -----------------------|------------
 * `toolbar`              | The toolbar above the pages.
 * `toolbar-group`        | A group of related controls in the toolbar.
 * `find-bar`             | The bar with the controls for finding text, below the toolbar.
 * `sidebar`              | The sidebar next to the pages.
 * `thumbnails`           | The scrollable list of page thumbnails in the sidebar.
 * `thumbnail`            | A page thumbnail. Also has the `current` part name for the current page.
 * `sidebar-header`       | The header of the sidebar with the buttons that switch between thumbnails and outline.
 * `outline`              | The outline (bookmarks) of the document in the sidebar.
 * `outline-item`         | An item of the outline.
 * `outline-item-content` | The row of an outline item, with its toggle and title.
 * `outline-toggle`       | The button that expands or collapses an outline item. Has the `expanded` attribute when expanded.
 * `outline-item-title`   | The title of an outline item.
 * `content`              | The scrollable area that contains the pages.
 * `page`                 | A page of the document.
 * `error-message`        | The message shown when the document could not be loaded.
 * `loader`               | The loading indicator shown while the document loads.
 *
 * The following state attributes are available for styling:
 *
 * Attribute        | Description
 * -----------------|------------
 * `loading`        | Set while the document is loading.
 * `has-error`      | Set when the document could not be loaded.
 * `sidebar-opened` | Set when the sidebar is shown.
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                                 |
 * :----------------------------------------------------|
 * | `--vaadin-pdf-viewer-background`                   |
 * | `--vaadin-pdf-viewer-border-color`                 |
 * | `--vaadin-pdf-viewer-border-radius`                |
 * | `--vaadin-pdf-viewer-current-match-background`     |
 * | `--vaadin-pdf-viewer-error-color`                  |
 * | `--vaadin-pdf-viewer-find-field-width`             |
 * | `--vaadin-pdf-viewer-icon-close`                   |
 * | `--vaadin-pdf-viewer-icon-find`                    |
 * | `--vaadin-pdf-viewer-icon-next-page`               |
 * | `--vaadin-pdf-viewer-icon-previous-page`           |
 * | `--vaadin-pdf-viewer-icon-sidebar`                 |
 * | `--vaadin-pdf-viewer-icon-zoom-in`                 |
 * | `--vaadin-pdf-viewer-icon-zoom-out`                |
 * | `--vaadin-pdf-viewer-match-background`             |
 * | `--vaadin-pdf-viewer-padding`                      |
 * | `--vaadin-pdf-viewer-page-background`              |
 * | `--vaadin-pdf-viewer-page-field-width`             |
 * | `--vaadin-pdf-viewer-page-gap`                     |
 * | `--vaadin-pdf-viewer-page-shadow`                  |
 * | `--vaadin-pdf-viewer-selection-background`         |
 * | `--vaadin-pdf-viewer-sidebar-background`           |
 * | `--vaadin-pdf-viewer-sidebar-shadow`               |
 * | `--vaadin-pdf-viewer-sidebar-width`                |
 * | `--vaadin-pdf-viewer-text-color`                   |
 * | `--vaadin-pdf-viewer-thumbnail-current-background` |
 * | `--vaadin-pdf-viewer-thumbnail-font-size`          |
 * | `--vaadin-pdf-viewer-toolbar-background`           |
 * | `--vaadin-pdf-viewer-toolbar-gap`                  |
 * | `--vaadin-pdf-viewer-toolbar-padding`              |
 * | `--vaadin-pdf-viewer-zoom-select-width`            |
 *
 * The `--vaadin-pdf-viewer-icon-*` properties take an image (e.g. an SVG data URL) used as a mask.
 * In the Lumo theme, they take a glyph of the `lumo-icons` font instead, like the icons of `<vaadin-map>`.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {CustomEvent} document-load - Fired when the document has loaded.
 * @fires {CustomEvent} document-error - Fired when the document could not be loaded.
 * @fires {CustomEvent} page-changed - Fired when the `page` property changes.
 * @fires {CustomEvent} sidebar-opened-changed - Fired when the `sidebarOpened` property changes.
 * @fires {CustomEvent} zoom-changed - Fired when the `zoom` property changes.
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
   *   passwordError: 'Password-protected documents are not supported.',
   *   // Accessible label of the toolbar.
   *   toolbar: 'PDF toolbar',
   *   // Accessible label and tooltip of the sidebar button, and accessible label of the thumbnail list.
   *   thumbnails: 'Page thumbnails',
   *   // Labels of the buttons that switch the sidebar between the thumbnails and the outline,
   *   // and accessible label of the outline.
   *   thumbnailsView: 'Thumbnails',
   *   outline: 'Outline',
   *   // Accessible labels and tooltips of the page navigation buttons.
   *   previousPage: 'Previous page',
   *   nextPage: 'Next page',
   *   // Accessible label of the page number field, without and with a document.
   *   // {pageCount} is replaced with the number of pages.
   *   page: 'Page',
   *   pageOf: 'Page of {pageCount}',
   *   // Announced when a toolbar control changes the page.
   *   // {page} and {pageCount} are replaced with the page number and the number of pages.
   *   pageAnnouncement: 'Page {page} of {pageCount}',
   *   // Accessible label of the zoom select.
   *   zoom: 'Zoom',
   *   // Accessible labels and tooltips of the zoom buttons.
   *   zoomIn: 'Zoom in',
   *   zoomOut: 'Zoom out',
   *   // Labels of the zoom levels that fit the page to the viewer.
   *   pageWidth: 'Page width',
   *   pageFit: 'Page fit',
   *   // Accessible label of the find button and the find field.
   *   find: 'Find in document',
   *   // Accessible labels and tooltips of the find bar buttons.
   *   previousMatch: 'Previous match',
   *   nextMatch: 'Next match',
   *   closeFind: 'Close find',
   *   // Shown and announced when finding text.
   *   // {current} and {total} are replaced with the number of the current match and the number of matches.
   *   findResult: '{current} of {total}',
   *   // Announced when moving to a match. {page} is replaced with the page of the match.
   *   findResultAnnouncement: '{current} of {total}, page {page}',
   *   findNoMatches: 'No matches',
   *   // Accessible name of the viewer when the document has no title
   *   // and the application has not set aria-label or aria-labelledby.
   *   document: 'PDF document',
   *   // Accessible name of the scrollable area that contains the pages.
   *   pages: 'Pages',
   *   // Accessible name of each page. {page} is replaced with the page number.
   *   pageLabel: 'Page {page}',
   *   // Accessible names of links to another place in the document that have no text.
   *   // {page} is replaced with the number of the page the link goes to.
   *   goToPage: 'Go to page {page}',
   *   link: 'Link',
   *   // Accessible name of links that open in a new tab.
   *   // {text} is replaced with the text of the link, or its URL.
   *   externalLink: '{text} (opens in a new tab)'
   * }
   * ```
   */
  i18n: PdfViewerI18n | undefined;

  /**
   * Whether the sidebar with the page thumbnails is shown.
   *
   * @attr {boolean} sidebar-opened
   */
  sidebarOpened: boolean;

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
