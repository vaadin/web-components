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
 * Adds finding text to the PDF viewer: a button in the toolbar, a find bar
 * over the pages, and highlights of the matches on the pages.
 */
export declare function PdfViewerFindMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<PdfViewerFindMixinClass> & T;

export declare class PdfViewerFindMixinClass {
  /**
   * Whether the button that opens the find bar is hidden from the
   * toolbar. While it is hidden, Ctrl+F or Cmd+F opens the find of the
   * browser. The `find()` method works also while it is hidden.
   *
   * @attr {boolean} find-button-hidden
   */
  findButtonHidden: boolean;

  /**
   * Opens the find bar with the given text, searches the document for it
   * and scrolls to the first match. Fires `find-result` with the number of
   * matches. While the document loads, it runs once loaded. Does nothing
   * without a document, or when the viewer is not attached.
   */
  find(text: string): void;

  /**
   * Highlights the given text on the given page and scrolls to it, for
   * a passage that the application has located. The next `highlight()` or
   * `find()` clears it. While the document loads, it runs once loaded.
   * Does nothing without a document, or when the viewer is not attached.
   *
   * @param page the page number, starting from 1
   * @param text the text to highlight
   */
  highlight(page: number, text: string): void;

  /**
   * Returns the template of the find bar, which shows the controls of
   * `_renderFindControls()` in its slots.
   */
  protected _renderFindBar(): TemplateResult;

  /**
   * Returns the template of the find button and the controls of the find
   * bar, which are rendered into the light DOM.
   */
  protected _renderFindControls(): TemplateResult;
}
