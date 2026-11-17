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
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { TemplateResult } from 'lit';

/**
 * A mixin that adds the header and the toolbar with the sidebar button, the
 * page navigation, the zoom and the download button.
 */
export declare function PdfViewerToolbarMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<PdfViewerToolbarMixinClass> & T;

export declare class PdfViewerToolbarMixinClass {
  /**
   * Whether the header above the toolbar is hidden. The header shows
   * `headerTitle`, or else the name of the document, and collapses and
   * expands the toolbar when clicked.
   *
   * @attr {boolean} header-hidden
   */
  headerHidden: boolean;

  /**
   * The title shown in the header, see `headerHidden`. When not set,
   * the header shows `fileName`, else the PDF file name from the
   * `Content-Disposition` header of the response, else the PDF file name
   * at the end of the path of `src`, else the `document` text of `i18n`.
   *
   * @attr {string} header-title
   */
  headerTitle: string | null | undefined;

  /**
   * Whether the toolbar is collapsed. The header collapses and expands
   * it, so the toolbar collapses only while the header is shown, see
   * `headerHidden`.
   *
   * @attr {boolean} toolbar-collapsed
   */
  toolbarCollapsed: boolean;

  /**
   * Whether the button that downloads the document is hidden from the
   * toolbar. The `download()` method works also while it is hidden.
   *
   * @attr {boolean} download-button-hidden
   */
  downloadButtonHidden: boolean;

  /**
   * Returns the template of the header and the toolbar.
   */
  protected _renderToolbar(): TemplateResult;

  /**
   * Returns the template of the previous page button in the `toolbar-previous-page` slot.
   */
  protected _renderPreviousPageButton(): TemplateResult;

  /**
   * Returns the template of the next page button in the `toolbar-next-page` slot.
   */
  protected _renderNextPageButton(): TemplateResult;

  /**
   * Returns the template of the page field in the `toolbar-page` slot.
   */
  protected _renderPageField(): TemplateResult;

  /**
   * Returns the template of the zoom out button in the `toolbar-zoom-out` slot.
   */
  protected _renderZoomOutButton(): TemplateResult;

  /**
   * Returns the template of the zoom select in the `toolbar-zoom` slot.
   */
  protected _renderZoomSelect(): TemplateResult;

  /**
   * Returns the template of the zoom in button in the `toolbar-zoom-in` slot.
   */
  protected _renderZoomInButton(): TemplateResult;

  /**
   * Returns the template of the download button in the `toolbar-download` slot.
   */
  protected _renderDownloadButton(): TemplateResult;
}
